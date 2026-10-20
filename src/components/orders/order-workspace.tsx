"use client";

import { useMemo, useState } from "react";

import { OrderEditForm, OrderForm } from "@/components/orders/order-form";
import { OrderFilters, type OrderFilterState } from "@/components/orders/order-filters";
import { OrderHeader } from "@/components/orders/order-header";
import { OrderKpis } from "@/components/orders/order-kpis";
import { OrderPipeline } from "@/components/orders/order-pipeline";
import { OrderTable } from "@/components/orders/order-table";
import { useOrders } from "@/components/orders/order-store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { OrderRecord } from "@/data/orders";

const TODAY = "2026-10-14";
const DAYS_14 = "2026-10-28";
const QUARTER_END = "2026-12-31";

const initialFilters: OrderFilterState = {
  query: "",
  status: "ALL",
  type: "ALL",
  priority: "ALL",
  customer: "ALL",
  owner: "ALL",
  targetActivation: "ALL",
  atRisk: "ALL",
  sort: "updated",
};

const priorityRank = { HIGH: 0, MEDIUM: 1, LOW: 2 };

export function OrderWorkspace() {
  const { orders, addOrder, updateOrder } = useOrders();
  const [filters, setFilters] = useState<OrderFilterState>(initialFilters);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState<OrderRecord | null>(null);
  const [editing, setEditing] = useState<OrderRecord | null>(null);
  const [saved, setSaved] = useState(false);
  const [exporting, setExporting] = useState(false);
  const owners = useMemo(() => [...new Set(orders.map((order) => order.ownerName))].sort(), [orders]);
  const customers = useMemo(() => [...new Set(orders.map((order) => order.customer.name))].sort(), [orders]);
  const visible = useMemo(() => applyFilters(orders, filters), [orders, filters]);

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <OrderHeader
        onCreate={() => {
          setAdded(null);
          setAdding(true);
        }}
        onExport={() => setExporting(true)}
      />
      <OrderKpis />
      <OrderPipeline
        activeStatus={filters.status}
        onSelect={(status) => setFilters((current) => ({ ...current, status }))}
      />
      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-sm font-medium">Orders</h2>
          <p className="text-xs text-muted-foreground">
            {visible.length} {visible.length === 1 ? "order" : "orders"}
          </p>
        </div>
        <OrderFilters filters={filters} owners={owners} customers={customers} onChange={setFilters} />
        <OrderTable
          orders={visible}
          onEdit={(order) => {
            setSaved(false);
            setEditing(order);
          }}
        />
      </div>

      <Dialog open={adding} onOpenChange={setAdding}>
        <DialogContent className="max-h-[min(44rem,calc(100%-2rem))] w-[min(42rem,calc(100%-2rem))] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Order</DialogTitle>
            <DialogDescription>
              {added
                ? `${added.orderNumber} was added as a new order. Nothing was written to a database.`
                : "Open an order from an accepted quote. It is stored in this browser session only."}
            </DialogDescription>
          </DialogHeader>
          {added ? (
            <div className="flex justify-end">
              <Button type="button" onClick={() => setAdding(false)}>
                Close
              </Button>
            </div>
          ) : (
            <OrderForm
              onSubmit={(values) => {
                setAdded(addOrder(values));
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[min(44rem,calc(100%-2rem))] w-[min(42rem,calc(100%-2rem))] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
            <DialogDescription>
              {saved
                ? `${editing?.orderNumber} was updated in this browser session.`
                : editing
                  ? `Update ${editing.orderNumber}. Changes stay in this browser session.`
                  : "Update this order."}
            </DialogDescription>
          </DialogHeader>
          {saved ? (
            <div className="flex justify-end">
              <Button type="button" onClick={() => setEditing(null)}>
                Close
              </Button>
            </div>
          ) : editing ? (
            <OrderEditForm
              key={editing.id}
              order={editing}
              onSubmit={(values) => {
                updateOrder(editing.id, values);
                setSaved(true);
              }}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={exporting} onOpenChange={setExporting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export</DialogTitle>
            <DialogDescription>
              Order export will be available when the order data service is connected. No file is downloaded from
              this screen.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button type="button" onClick={() => setExporting(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function applyFilters(orders: OrderRecord[], filters: OrderFilterState) {
  const query = filters.query.trim().toLowerCase();

  const filtered = orders.filter((order) => {
    if (filters.status !== "ALL" && order.status !== filters.status) {
      return false;
    }

    if (filters.type !== "ALL" && order.orderType !== filters.type) {
      return false;
    }

    if (filters.priority !== "ALL" && order.priority !== filters.priority) {
      return false;
    }

    if (filters.customer !== "ALL" && order.customer.name !== filters.customer) {
      return false;
    }

    if (filters.owner !== "ALL" && order.ownerName !== filters.owner) {
      return false;
    }

    if (filters.atRisk === "YES" && !order.atRisk) {
      return false;
    }

    if (!matchesTarget(order.targetActivation, filters.targetActivation)) {
      return false;
    }

    if (!query) {
      return true;
    }

    return [order.orderNumber, order.customer.name, order.product, order.ownerName, order.quoteNumber ?? ""]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });

  return filtered.sort((a, b) => {
    if (filters.sort === "target") {
      return a.targetActivation.localeCompare(b.targetActivation);
    }

    if (filters.sort === "value") {
      return b.value - a.value;
    }

    if (filters.sort === "customer") {
      return a.customer.name.localeCompare(b.customer.name);
    }

    if (filters.sort === "priority") {
      return priorityRank[a.priority] - priorityRank[b.priority] || a.orderNumber.localeCompare(b.orderNumber);
    }

    return b.updatedAt.localeCompare(a.updatedAt);
  });
}

function matchesTarget(date: string, window: OrderFilterState["targetActivation"]) {
  if (window === "ALL") {
    return true;
  }

  if (window === "PAST") {
    return date < TODAY;
  }

  if (window === "DAYS_14") {
    return date >= TODAY && date <= DAYS_14;
  }

  if (window === "MONTH") {
    return date.startsWith("2026-10");
  }

  return date >= TODAY && date <= QUARTER_END;
}
