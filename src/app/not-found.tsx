"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]" />
      </div>

      <div className="mx-auto w-full max-w-2xl px-6 py-24 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
          error 404
        </p>

        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-text-primary sm:text-6xl">
          page not found
        </h1>

        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-text-secondary">
          looks like this page wandered off somewhere. it might have been
          deleted, moved, or never existed in the first place.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_rgba(168,85,247,0.25)] transition-all hover:bg-primary/90 hover:shadow-[0_0_45px_rgba(168,85,247,0.4)]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            back home
          </Link>

          <Link
            href="/discord"
            className="group inline-flex items-center justify-center gap-2 rounded-full border border-border-hover bg-bg-card/50 px-6 py-3 text-sm font-medium text-text-primary transition-all hover:bg-bg-elevated"
          >
            support server
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
