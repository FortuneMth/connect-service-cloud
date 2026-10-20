"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, MapPin, Pencil, ShoppingCart } from "lucide-react";

import { CustomerForm } from "@/components/customers/customer-form";
import { CustomerStatusBadge } from "@/components/customers/customer-status-badge";
import { draftFromCustomer, useCustomers } from "@/components/customers/customer-store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CUSTOMER_TYPE_LABEL, type CustomerRecord } from "@/data/customers";

const placeholders = [
  {
    id: "quote",
    label: "Create Quote",
    icon: FileText,
    detail: "Quote preparation for this customer will open here once commercial workflows are connected.",
  },
  {
    id: "order",
    label: "Create Order",
    icon: ShoppingCart,
    detail: "Order intake for this customer will open here once delivery workflows are connected.",
  },
  {
    id: "site",
    label: "Add Site",
    icon: MapPin,
    detail: "Site capture for this customer will open here once location records are connected.",
  },
] as const;

export function CustomerDetailHeader({ customer }: { customer: CustomerRecord }) {
  const { updateCustomer } = useCustomers();
  const [editing, setEditing] = useState(false);
  const [placeholder, setPlaceholder] = useState<(typeof placeholders)[number] | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/customers"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Customers
      </Link>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-heading text-xl font-semibold tracking-tight">{customer.name}</h1>
            <CustomerStatusBadge status={customer.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {customer.customerNumber} · {CUSTOMER_TYPE_LABEL[customer.type]} · {customer.accountOwner.name} ·{" "}
            {customer.primaryContact.name}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setEditing(true)}>
            <Pencil />
            Edit Customer
          </Button>
          {placeholders.map((action) => {
            const Icon = action.icon;
            return (
              <Button key={action.id} type="button" variant="outline" size="sm" onClick={() => setPlaceholder(action)}>
                <Icon />
                {action.label}
              </Button>
            );
          })}
        </div>
      </div>
      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent className="max-h-[min(44rem,calc(100%-2rem))] w-[min(42rem,calc(100%-2rem))] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>Changes stay in this browser session.</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <CustomerForm
              key={customer.updatedAt}
              initial={draftFromCustomer(customer)}
              submitLabel="Save changes"
              onCancel={() => setEditing(false)}
              onSubmit={(values) => {
                updateCustomer(customer.id, values);
                setEditing(false);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={placeholder !== null} onOpenChange={(open) => !open && setPlaceholder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{placeholder?.label}</DialogTitle>
            <DialogDescription>{placeholder?.detail} Nothing is saved from this screen.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
