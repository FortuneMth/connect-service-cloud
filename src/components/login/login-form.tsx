"use client";

import { useActionState, useState } from "react";

import { loginAction, type LoginState } from "@/auth/actions";
import { DEMO_PASSWORD } from "@/auth/demo-password";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: LoginState = { error: "" };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  const [email, setEmail] = useState("");

  return (
    <form className="flex flex-col gap-5" action={formAction}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          className="h-9"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={state.error ? true : undefined}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="h-9"
          required
          aria-invalid={state.error ? true : undefined}
        />
      </div>
      {state.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" className="w-full" size="lg" disabled={pending}>
        {pending ? "Signing in" : "Sign in"}
      </Button>
      <p className="text-xs leading-5 text-muted-foreground">
        Development accounts use the password {DEMO_PASSWORD}.
      </p>
    </form>
  );
}
