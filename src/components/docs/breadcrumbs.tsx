import React from "react";
import Link from "next/link";
import { ChevronRight, Home, BookOpen } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs">
      <Link
        href="/docs"
        className="flex items-center gap-1.5 rounded-md border border-purple-500/20 bg-purple-950/30 px-2 py-1 text-purple-300 transition-colors hover:border-purple-400/40 hover:bg-purple-900/40 hover:text-white"
      >
        <BookOpen className="h-3 w-3" />
        <span>Docs</span>
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="h-3 w-3 shrink-0 text-zinc-500" />
            {isLast || !item.href ? (
              <span className="rounded-md border border-purple-500/10 bg-white/[0.04] px-2 py-1 font-medium text-zinc-200">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="rounded-md border border-transparent px-2 py-1 text-zinc-400 transition-colors hover:border-purple-500/20 hover:bg-purple-950/20 hover:text-zinc-100"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
