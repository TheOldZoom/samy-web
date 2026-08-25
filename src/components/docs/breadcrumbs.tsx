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
        className="flex items-center gap-1.5 rounded-md border border-border-subtle bg-accent-deep/30 px-2 py-1 text-accent transition-colors hover:border-accent/40 hover:bg-accent-deep/40 hover:text-text-primary"
      >
        <BookOpen className="h-3 w-3" />
        <span>Docs</span>
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="h-3 w-3 shrink-0 text-text-muted" />
            {isLast || !item.href ? (
              <span className="rounded-md border border-border-subtle bg-bg-card px-2 py-1 font-medium text-text-secondary">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="rounded-md border border-transparent px-2 py-1 text-text-muted transition-colors hover:border-border-subtle hover:bg-accent-deep/20 hover:text-text-primary"
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
