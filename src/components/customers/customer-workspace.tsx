"use client";

import { useMemo, useState } from "react";

import { CustomerFilters, type CustomerFilterState } from "@/components/customers/customer-filters";
import { CustomerForm } from "@/components/customers/customer-form";
import { CustomerHeader } from "@/components/customers/customer-header";
import { CustomerKpis } from "@/components/customers/customer-kpis";
import { draftFromCustomer, useCustomers } from "@/components/customers/customer-store";
import { CustomerTable } from "@/components/customers/customer-table";
import { ImportCustomerDialog } from "@/components/customers/import-customer-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CustomerRecord } from "@/data/customers";

const initialFilters: CustomerFilterState = {
  query: "",
  type: "ALL",
  status: "ALL",
  owner: "ALL",
  sort: "updated",
};

export function CustomerWorkspace() {
  const { customers, addCustomer, updateCustomer } = useCustomers();
  const [filters, setFilters] = useState<CustomerFilterState>(initialFilters);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState<CustomerRecord | null>(null);
  const [editing, setEditing] = useState<CustomerRecord | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const visible = useMemo(() => applyFilters(customers, filters), [customers, filters]);

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <CustomerHeader
        onAdd={() => {
          setAdded(null);
          setAdding(true);
        }}
        onImport={() => setImportOpen(true)}
      />
      <CustomerKpis />
      <CustomerFilters value={filters} onChange={setFilters} />
      <p className="text-xs text-muted-foreground">
        {visible.length} {visible.length === 1 ? "customer" : "customers"}
      </p>
      <CustomerTable customers={visible} onEdit={setEditing} />
      <Dialog
        open={adding}
        onOpenChange={(open) => {
          setAdding(open);
          if (!open) setAdded(null);
        }}
      >
        <DialogContent className="max-h-[min(44rem,calc(100%-2rem))] w-[min(42rem,calc(100%-2rem))] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{added ? "Customer added" : "Add Customer"}</DialogTitle>
            <DialogDescription>
              {added
                ? `${added.name} is available in this session as ${added.customerNumber}. Nothing is written to a database.`
                : "Capture the account details. The record stays in this browser session."}
            </DialogDescription>
          </DialogHeader>
          {added ? (
            <div className="mt-4 flex justify-end">
              <Button type="button" onClick={() => setAdding(false)}>
                Close
              </Button>
            </div>
          ) : (
            <div className="mt-4">
              <CustomerForm
                submitLabel="Add Customer"
                onCancel={() => setAdding(false)}
                onSubmit={(values) => setAdded(addCustomer(values))}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[min(44rem,calc(100%-2rem))] w-[min(42rem,calc(100%-2rem))] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              {editing ? `Update ${editing.name}. Changes stay in this browser session.` : "Update the customer."}
            </DialogDescription>
          </DialogHeader>
          {editing ? (
            <div className="mt-4">
              <CustomerForm
                key={editing.id}
                initial={draftFromCustomer(editing)}
                submitLabel="Save changes"
                onCancel={() => setEditing(null)}
                onSubmit={(values) => {
                  updateCustomer(editing.id, values);
                  setEditing(null);
                }}
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
      <ImportCustomerDialog open={importOpen} onOpenChange={setImportOpen} />
    </div>
  );
}

function applyFilters(customers: CustomerRecord[], filters: CustomerFilterState) {
  const query = filters.query.trim().toLowerCase();
  const filtered = customers.filter((customer) => {
    const matchesQuery =
      query.length === 0 ||
      customer.name.toLowerCase().includes(query) ||
      customer.customerNumber.toLowerCase().includes(query) ||
      customer.primaryContact.name.toLowerCase().includes(query) ||
      customer.accountOwner.name.toLowerCase().includes(query);
    const matchesType = filters.type === "ALL" || customer.type === filters.type;
    const matchesStatus = filters.status === "ALL" || customer.status === filters.status;
    const matchesOwner = filters.owner === "ALL" || customer.accountOwner.name === filters.owner;
    return matchesQuery && matchesType && matchesStatus && matchesOwner;
  });

  return filtered.sort((left, right) => {
    if (filters.sort === "name") return left.name.localeCompare(right.name);
    if (filters.sort === "mrr") return right.monthlyRecurringRevenue - left.monthlyRecurringRevenue;
    if (filters.sort === "services") return right.serviceCount - left.serviceCount;
    return right.updatedAt.localeCompare(left.updatedAt);
  });
}
