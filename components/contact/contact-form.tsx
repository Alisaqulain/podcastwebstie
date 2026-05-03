"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Please enter your name").max(200),
  email: z.string().email("Valid email required"),
  message: z.string().min(1, "Please share a message").max(5000),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setStatus("idle");
    const res = await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      setStatus("ok");
      reset();
    } else {
      setStatus("err");
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(onSubmit)}
      className="glass-panel space-y-6 rounded-3xl p-8 md:p-10"
    >
      <div>
        <label className="text-sm font-medium text-brand-dark" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          className="mt-2 w-full rounded-2xl border border-brand-gold/20 bg-white/80 px-4 py-3 text-sm outline-none ring-brand-gold/30 focus:ring-2"
          {...register("name")}
        />
        {errors.name ? (
          <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
        ) : null}
      </div>
      <div>
        <label className="text-sm font-medium text-brand-dark" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="mt-2 w-full rounded-2xl border border-brand-gold/20 bg-white/80 px-4 py-3 text-sm outline-none ring-brand-gold/30 focus:ring-2"
          {...register("email")}
        />
        {errors.email ? (
          <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
        ) : null}
      </div>
      <div>
        <label
          className="text-sm font-medium text-brand-dark"
          htmlFor="message"
        >
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          className="mt-2 w-full resize-y rounded-2xl border border-brand-gold/20 bg-white/80 px-4 py-3 text-sm outline-none ring-brand-gold/30 focus:ring-2"
          {...register("message")}
        />
        {errors.message ? (
          <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gold-gradient py-3.5 text-sm font-semibold text-brand-dark shadow-md transition hover:brightness-105 disabled:opacity-60 md:w-auto md:px-10"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          "Send message"
        )}
      </button>

      {status === "ok" ? (
        <p className="text-sm font-medium text-emerald-700">
          Thank you—your message was received. Namrata or her team will respond
          soon.
        </p>
      ) : null}
      {status === "err" ? (
        <p className="text-sm font-medium text-red-600">
          Something went wrong. Please try again or reach out on WhatsApp.
        </p>
      ) : null}
    </motion.form>
  );
}
