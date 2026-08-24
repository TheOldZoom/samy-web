"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Bot, ShieldCheck } from "lucide-react";

export default function InvitePage() {
  const inviteUrl =
    "https://discord.com/oauth2/authorize?client_id=1088623902332293212";

  return (
    <div className="relative flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[130px]" />
      </div>

      <div className="mx-auto w-full max-w-2xl px-6 py-24 text-center">
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-text-primary sm:text-6xl">
          add <span className="text-accent">Samy</span> to your server
        </h1>

        <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-text-secondary">
          moderation, utilities, server management, Last.Fm, and more. bring
          everything your server needs into one bot.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={inviteUrl}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_rgba(168,85,247,0.25)] transition-all hover:bg-primary/90 hover:shadow-[0_0_45px_rgba(168,85,247,0.4)]"
          >
            add to discord
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border-hover bg-bg-card/50 px-7 py-3.5 text-sm font-medium text-text-primary transition-all hover:bg-bg-elevated"
          >
            <ArrowLeft className="h-4 w-4" />
            back home
          </Link>
        </div>

        <p className="mt-6 text-xs text-text-muted">
          by adding Samy, you agree to our{" "}
          <Link
            href="/terms"
            className="text-accent underline underline-offset-2 transition-colors hover:text-accent/80"
          >
            terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-accent underline underline-offset-2 transition-colors hover:text-accent/80"
          >
            privacy policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
