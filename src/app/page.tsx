import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-6">
      <Link href="/login" className="text-sm font-medium underline-offset-4 hover:underline">
        Sign in to Connect Service Cloud
      </Link>
    </main>
  );
}
