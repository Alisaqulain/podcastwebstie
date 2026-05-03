"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { SiteLogo } from "@/components/brand/site-logo";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type Form = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(schema) });

  async function onSubmit(values: Form) {
    setErr(null);
    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    if (res?.error) {
      setErr("Invalid email or password.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-[max(1rem,env(safe-area-inset-left,0px))] py-12 pr-[max(1rem,env(safe-area-inset-right,0px))] pb-[max(3rem,env(safe-area-inset-bottom,0px)+1rem)] pt-[max(2rem,env(safe-area-inset-top,0px)+1rem)] sm:py-16">
      <div className="w-full max-w-md rounded-4xl border border-brand-gold/20 bg-white/70 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block touch-manipulation">
            <SiteLogo variant="auth" />
          </Link>
          <h1 className="mt-6 font-display text-2xl font-semibold text-brand-dark">
            Admin sign in
          </h1>
          <p className="mt-2 text-sm text-brand-dark/60">
            Enter the credentials configured in your environment.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-brand-dark" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              className="mt-2 w-full rounded-2xl border border-brand-gold/20 bg-white px-4 py-3 text-sm outline-none ring-brand-gold/30 focus:ring-2"
              {...register("email")}
            />
          </div>
          <div>
            <label
              className="text-sm font-medium text-brand-dark"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="mt-2 w-full rounded-2xl border border-brand-gold/20 bg-white px-4 py-3 text-sm outline-none ring-brand-gold/30 focus:ring-2"
              {...register("password")}
            />
          </div>

          {err ? <p className="text-sm text-red-600">{err}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-dark py-3.5 text-sm font-semibold text-brand-cream transition hover:bg-brand-dark/90 disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
