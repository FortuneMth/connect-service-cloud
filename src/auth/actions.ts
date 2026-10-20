"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { signIn, signOut } from "@/auth";
import { authenticateDemoUser } from "@/auth/demo-users";
import { homePathFor } from "@/auth/permissions";

export type LoginState = {
  error: string;
};

export async function loginAction(_state: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const user = authenticateDemoUser(email, password);

  if (!user) {
    return { error: "The email or password is incorrect." };
  }

  try {
    const destination = await signIn("credentials", {
      email,
      password,
      redirect: false,
      redirectTo: homePathFor(user.userType),
    });

    if (typeof destination === "string" && destination.includes("error=")) {
      return { error: "The email or password is incorrect." };
    }
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "The email or password is incorrect." };
    }

    throw error;
  }

  redirect(homePathFor(user.userType));
}

export async function signOutAction() {
  await signOut({ redirectTo: "/login" });
}
