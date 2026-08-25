import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PagerLink {
  title: string;
  href: string;
}

interface DocPagerProps {
  prev: PagerLink | null;
  next: PagerLink | null;
}

export function DocPager({ prev, next }: DocPagerProps) {
  if (!prev && !next) return null;

  return (
    <div className="mt-14 grid grid-cols-1 gap-4 border-t border-border-subtle pt-8 sm:grid-cols-2">
      {prev ? (
        <Link
          href={prev.href}
          className="group relative flex flex-col items-start gap-1.5 rounded-xl border border-border-subtle bg-bg-elevated p-4.5 transition-all duration-200 hover:border-accent/50 hover:bg-bg-card hover:shadow-[0_0_24px_rgba(168,85,247,0.12)]"
        >
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent transition-colors group-hover:text-accent">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            Previous
          </span>
          <span className="text-sm font-semibold text-text-primary group-hover:text-text-primary">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}

      {next ? (
        <Link
          href={next.href}
          className="group relative flex flex-col items-end gap-1.5 rounded-xl border border-border-subtle bg-bg-elevated p-4.5 text-right transition-all duration-200 hover:border-accent/50 hover:bg-bg-card hover:shadow-[0_0_24px_rgba(168,85,247,0.12)]"
        >
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent transition-colors group-hover:text-accent">
            Next
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
          <span className="text-sm font-semibold text-text-primary group-hover:text-text-primary">
            {next.title}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}
    </div>
  );
}
