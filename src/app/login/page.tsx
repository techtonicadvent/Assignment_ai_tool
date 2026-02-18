"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect logged-in users to chat
  useEffect(() => {
    if (session) {
      router.push("/chat");
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 bg-gray-50">
      <h1 className="text-3xl font-semibold">Sign in to AI Assistant</h1>

      <div className="flex w-64 flex-col gap-3">
        <button
          onClick={() => signIn("github", { callbackUrl: "/chat" })}
          className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
        >
          Continue with GitHub
        </button>

        <button
          onClick={() => signIn("google", { callbackUrl: "/chat" })}
          className="rounded border px-4 py-2 hover:bg-gray-100"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
