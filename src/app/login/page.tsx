import type { Metadata } from "next";
import { Waypoints } from "lucide-react";

import { LoginForm } from "@/components/login/login-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <section className="hidden flex-col justify-between bg-foreground px-12 py-10 text-background lg:flex">
        <div className="flex items-center gap-2.5 text-sm font-medium">
          <span className="flex size-8 items-center justify-center rounded-md bg-background text-foreground">
            <Waypoints className="size-4" />
          </span>
          Connect Service Cloud
        </div>
        <div className="max-w-md">
          <p className="text-3xl font-semibold tracking-tight">
            From Order to Activation. One Platform.
          </p>
          <p className="mt-4 text-sm leading-6 text-background/75">
            The operations workspace and customer portal for connectivity service delivery.
          </p>
        </div>
        <p className="text-xs tracking-wide text-background/60 uppercase">
          Order · Delivery · Activation
        </p>
      </section>
      <section className="flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <div className="mb-6 flex items-center gap-2 text-sm font-medium lg:hidden">
              <span className="flex size-8 items-center justify-center rounded-md bg-foreground text-background">
                <Waypoints className="size-4" />
              </span>
              Connect Service Cloud
            </div>
            <h1 className="text-xl font-semibold tracking-tight">Sign in</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Connect Service Cloud. From Order to Activation. One Platform.
            </p>
          </div>
          <LoginForm />
        </div>
      </section>
    </div>
  );
}
