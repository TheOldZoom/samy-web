"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";

const navLinks = [
  { label: "features", href: "#features" },
  { label: "integrations", href: "#integrations" },
  { label: "docs", href: "/docs/" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <nav className="border-b border-border-subtle/70 bg-bg-base/70 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link
            href="/"
            className="group flex items-center gap-2.5"
            onClick={() => setOpen(false)}
          >
            <img
              src="/samy.jpg"
              alt="samy"
              className="h-8 w-8 rounded-lg object-cover transition-transform duration-200 group-hover:scale-105"
            />

            <span className="text-[15px] font-semibold tracking-[-0.01em] text-text-primary">
              samy
            </span>
          </Link>

          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] font-medium text-text-muted transition-colors hover:text-text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center">
            <Link
              href="/invite"
              className="group flex items-center gap-1.5 rounded-lg  px-3.5 py-2 text-[13px] font-medium transition-all hover:opacity-90 bg-primary text-primary-foreground"
            >
              add to discord
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-bg-elevated hover:text-text-primary md:hidden"
          >
            {open ? (
              <X className="h-[18px] w-[18px]" />
            ) : (
              <Menu className="h-[18px] w-[18px]" />
            )}
          </button>
        </div>

        {open && (
          <div className="border-t border-border-subtle/70 md:hidden">
            <div className="mx-auto max-w-6xl px-5 py-4">
              <div className="flex flex-col">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="border-b border-border-subtle/50 py-3.5 text-sm font-medium text-text-secondary transition-colors last:border-0 hover:text-text-primary"
                  >
                    {link.label}
                  </Link>
                ))}

                <Link
                  href="/invite"
                  onClick={() => setOpen(false)}
                  className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
                >
                  add to discord
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
