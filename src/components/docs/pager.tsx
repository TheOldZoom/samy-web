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
    <div className="mt-14 grid grid-cols-1 gap-4 border-t border-purple-500/20 pt-8 sm:grid-cols-2">
      {prev ? (
        <Link
          href={prev.href}
          className="group relative flex flex-col items-start gap-1.5 rounded-xl border border-purple-500/20 bg-[#100921]/90 p-4.5 backdrop-blur-md transition-all duration-200 hover:border-purple-400/50 hover:bg-[#180e30] hover:shadow-[0_0_24px_rgba(168,85,247,0.12)]"
        >
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-purple-300 transition-colors group-hover:text-purple-200">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            Previous
          </span>
          <span className="text-sm font-semibold text-zinc-100 group-hover:text-white">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}

      {next ? (
        <Link
          href={next.href}
          className="group relative flex flex-col items-end gap-1.5 rounded-xl border border-purple-500/20 bg-[#100921]/90 p-4.5 text-right backdrop-blur-md transition-all duration-200 hover:border-purple-400/50 hover:bg-[#180e30] hover:shadow-[0_0_24px_rgba(168,85,247,0.12)]"
        >
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-purple-300 transition-colors group-hover:text-purple-200">
            Next
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
          <span className="text-sm font-semibold text-zinc-100 group-hover:text-white">
            {next.title}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}
    </div>
  );
}
