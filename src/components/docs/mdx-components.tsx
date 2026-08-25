import React from "react";
import Link from "next/link";
import { Callout } from "./callout";
import { PreBlock } from "./code-block";
import { Separator } from "@/components/ui/separator";
import { ArrowUpRight, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardProps {
  title: string;
  description?: string;
  href: string;
  icon?: React.ReactNode;
  className?: string;
}

export function DocCard({
  title,
  description,
  href,
  icon,
  className,
}: CardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col justify-between rounded-xl border border-border-hover bg-bg-card p-5 transition-all duration-200 hover:border-accent/50 hover:bg-bg-elevated hover:shadow-[0_0_24px_rgba(168,85,247,0.14)]",
        className,
      )}
    >
      <div>
        {icon ? (
          <div className="mb-3.5 flex h-9 w-9 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-accent shadow-[0_0_12px_rgba(168,85,247,0.2)] group-hover:scale-105 group-hover:border-accent/50 transition-transform">
            {icon}
          </div>
        ) : null}
        <h3 className="font-heading text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">
          {title}
        </h3>
        {description && (
          <p className="mt-2 text-xs leading-relaxed text-text-secondary">
            {description}
          </p>
        )}
      </div>
      <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-accent group-hover:text-accent transition-colors">
        <span>Explore guide</span>
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Link>
  );
}

export function CardGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "my-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Steps({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("my-8 space-y-6 [counter-reset:step]", className)}>
      {children}
    </div>
  );
}

export function Step({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex gap-3.5 [counter-increment:step]",
        className,
      )}
    >
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent-deep/50 text-[12px] font-mono font-bold text-accent before:content-[counter(step)]" />
      <div className="flex-1 pt-0.5">
        <h3 className="text-[15px] font-semibold text-text-primary tracking-tight">
          {title}
        </h3>
        <div className="mt-2 text-[13.5px] leading-relaxed text-text-secondary prose-p:my-1.5 prose-p:first:mt-0 prose-p:last:mb-0">
          {children}
        </div>
      </div>
    </div>
  );
}

export const mdxComponents = {
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn(
        "font-heading text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mb-5",
        className,
      )}
      {...props}
    />
  ),
  h2: ({
    className,
    id,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      id={id}
      className={cn(
        "group font-heading text-xl sm:text-2xl font-bold tracking-tight text-text-primary mt-10 mb-4 pb-2 scroll-mt-24 flex items-center justify-between",
        className,
      )}
      {...props}
    >
      <span className="flex-1">{props.children}</span>
      {id && (
        <a
          href={`#${id}`}
          aria-label={`Link to ${props.children}`}
          className="ml-2 opacity-0 group-hover:opacity-100 text-accent hover:text-accent transition-opacity"
        >
          <Hash className="h-4 w-4" />
        </a>
      )}
    </h2>
  ),
  h3: ({
    className,
    id,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      id={id}
      className={cn(
        "font-heading text-lg font-semibold text-accent mt-8 mb-3 scroll-mt-24 flex items-center gap-2",
        className,
      )}
      {...props}
    />
  ),
  h4: ({
    className,
    id,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      id={id}
      className={cn(
        "font-heading text-base font-semibold text-text-primary mt-6 mb-2 scroll-mt-24",
        className,
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn(
        "text-[14.5px] sm:text-[15px] leading-relaxed text-text-secondary mb-4 font-normal",
        className,
      )}
      {...props}
    />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className={cn(
        "my-4 ml-6 list-disc space-y-2 text-[14.5px] sm:text-[15px] text-text-secondary marker:text-accent",
        className,
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className={cn(
        "my-4 ml-6 list-decimal space-y-2 text-[14.5px] sm:text-[15px] text-text-secondary marker:text-accent",
        className,
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className={cn("pl-1 leading-relaxed", className)} {...props} />
  ),
  blockquote: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className={cn(
        "my-6 rounded-xl border border-accent/25 bg-accent-deep/25 px-4.5 py-3.5 text-accent italic text-[14px]",
        className,
      )}
      {...props}
    />
  ),
  hr: () => <Separator className="my-8 bg-border-subtle" />,
  a: ({
    href = "",
    className,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = href.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "font-medium text-accent underline underline-offset-4 decoration-accent/40 transition-colors hover:text-accent hover:decoration-accent inline-flex items-center gap-0.5",
            className,
          )}
          {...props}
        >
          {children}
          <ArrowUpRight className="inline h-3.5 w-3.5" />
        </a>
      );
    }
    return (
      <Link
        href={href}
        className={cn(
          "font-medium text-accent underline underline-offset-4 decoration-accent/40 transition-colors hover:text-accent hover:decoration-accent",
          className,
        )}
        {...props}
      >
        {children}
      </Link>
    );
  },
  code: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLElement>) => {
    const isInline = typeof children === "string" && !children.includes("\n");
    if (isInline) {
      return (
        <code
          className={cn(
            "rounded-md border border-accent/30 bg-bg-elevated px-1.5 py-0.5 font-mono text-[12.5px] font-semibold text-accent shadow-xs",
            className,
          )}
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  pre: PreBlock,
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-x-auto rounded-xl border border-accent/25 bg-bg-base shadow-xl">
      <table
        className={cn("w-full text-left text-xs sm:text-[13px]", className)}
        {...props}
      />
    </div>
  ),
  thead: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead
      className={cn(
        "border-b border-accent/25 bg-bg-elevated text-accent uppercase tracking-wider font-semibold",
        className,
      )}
      {...props}
    />
  ),
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn("px-4 py-3.5 font-semibold text-text-primary", className)}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn(
        "border-t border-accent/10 px-4 py-3 text-text-secondary font-normal leading-relaxed",
        className,
      )}
      {...props}
    />
  ),
  Callout,
  Card: DocCard,
  CardGrid,
  Steps,
  Step,
};
