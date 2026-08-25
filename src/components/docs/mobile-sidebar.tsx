"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  BookOpen,
  ChevronRight,
  ChevronDown,
  Folder,
  Shield,
  Sparkles,
  Wrench,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { NavSection, SearchDocItem } from "@/types/docs";
import { cn } from "@/lib/utils";
import { DocsSearch } from "./search-dialog";

interface MobileSidebarProps {
  sections: NavSection[];
  searchIndex: SearchDocItem[];
}

const sectionIcons = {
  Overview: BookOpen,
  "Getting Started": Sparkles,
  Commands: Shield,
  Configuration: Wrench,
};

export function DocsMobileNav({ sections, searchIndex }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({});

  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const toggleSection = (title: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <div className="flex w-full items-center justify-between gap-3 border-b border-border-subtle/70 bg-bg-base/70 px-4 py-3 backdrop-blur-2xl md:hidden">
      <div className="min-w-0 flex-1">
        <DocsSearch searchIndex={searchIndex} />
      </div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex shrink-0 items-center gap-2 rounded-xl border border-border-subtle bg-accent-deep/40 px-3.5 py-2 text-xs font-semibold text-accent shadow-sm transition-colors hover:border-accent/40 hover:bg-accent-deep/50 hover:text-text-primary"
      >
        <Menu className="h-4 w-4" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className={cn(
            "!fixed !inset-0 !left-0 !top-0",
            "!h-screen !h-dvh !w-screen !max-w-none",
            "!translate-x-0 !translate-y-0",
            "!rounded-none !border-0 !p-0",
            "!bg-bg-base",
            "overflow-hidden",
            "gap-0",
          )}
        >
          <div className="flex h-full min-h-0 w-full flex-col">
            <DialogHeader className="shrink-0 border-b border-border-subtle px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <img
                    src="/samy.jpg"
                    alt="Samy"
                    className="h-8 w-8 shrink-0 rounded-lg object-cover"
                  />

                  <div className="min-w-0">
                    <DialogTitle className="truncate text-sm font-bold text-text-primary">
                      Documentation
                    </DialogTitle>

                    <p className="text-[11px] text-text-muted">
                      Samy Bot Guides
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close documentation menu"
                  className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-bg-card hover:text-text-primary"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </DialogHeader>

            <div className="shrink-0 px-5 py-4">
              <DocsSearch searchIndex={searchIndex} />
            </div>

            <nav className="min-h-0 flex-1 overflow-y-auto px-5 pb-6">
              <div className="space-y-5">
                {sections.map((section) => {
                  const isCollapsed = collapsedSections[section.title] ?? false;

                  const Icon =
                    sectionIcons[section.title as keyof typeof sectionIcons] ??
                    Folder;

                  return (
                    <div key={section.title}>
                      <button
                        type="button"
                        onClick={() => toggleSection(section.title)}
                        aria-expanded={!isCollapsed}
                        className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-text-secondary transition-colors hover:bg-bg-card"
                      >
                        <span className="flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-md border border-border-subtle bg-accent-deep/40 text-accent">
                            <Icon className="h-3 w-3" />
                          </span>

                          <span>{section.title}</span>
                        </span>

                        {isCollapsed ? (
                          <ChevronRight className="h-3.5 w-3.5 text-text-muted" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5 text-text-muted" />
                        )}
                      </button>

                      {!isCollapsed && (
                        <div className="mt-1.5 ml-2 space-y-1 border-l border-border-subtle pl-2">
                          {section.items.map((item) => {
                            const isActive =
                              pathname === item.href ||
                              (pathname === "/docs" &&
                                item.href === "/docs/introduction");

                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                  "flex items-center rounded-lg px-3 py-2 text-[13px] transition-colors",
                                  isActive
                                    ? "bg-accent/20 font-semibold text-accent"
                                    : "text-text-muted hover:bg-bg-card hover:text-text-primary",
                                )}
                              >
                                {item.title}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </nav>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
