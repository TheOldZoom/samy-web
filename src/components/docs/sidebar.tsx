"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  Shield,
  Wrench,
  Sparkles,
  Folder,
} from "lucide-react";
import type { NavSection, SearchDocItem } from "@/types/docs";
import { cn } from "@/lib/utils";
import { DocsSearch } from "./search-dialog";

interface SidebarProps {
  sections: NavSection[];
  searchIndex: SearchDocItem[];
}

const sectionIcons: Record<string, React.ElementType> = {
  Overview: BookOpen,
  "Getting Started": Sparkles,
  Commands: Shield,
  Configuration: Wrench,
};

export function DocsSidebar({ sections, searchIndex }: SidebarProps) {
  const pathname = usePathname();
  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({});

  const toggleSection = (title: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <aside className="w-full rounded-2xl border border-border-subtle bg-bg-elevated p-4.5 shadow-xl space-y-6">
      <div>
        <DocsSearch searchIndex={searchIndex} />
      </div>

      <nav className="space-y-6">
        {sections.map((section) => {
          const isCollapsed = !!collapsedSections[section.title];
          const Icon = sectionIcons[section.title] || Folder;

          return (
            <div key={section.title} className="space-y-1.5">
              <button
                type="button"
                onClick={() => toggleSection(section.title)}
                className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-text-secondary transition-colors hover:bg-bg-card hover:text-text-primary"
              >
                <span className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-md border border-border-subtle bg-accent-deep/40 text-accent">
                    <Icon className="h-3 w-3" />
                  </div>
                  <span>{section.title}</span>
                </span>
                {isCollapsed ? (
                  <ChevronRight className="h-3.5 w-3.5 text-text-muted" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 text-text-muted" />
                )}
              </button>

              {!isCollapsed && (
                <div className="space-y-0.5 pl-2 ml-2">
                  {section.items.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (pathname === "/docs" &&
                        item.href === "/docs/introduction");

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "group relative flex items-center justify-between rounded-lg px-3 py-1.5 text-[13px] transition-all",
                          isActive
                            ? "bg-accent/15 font-semibold text-accent"
                            : "text-text-muted hover:bg-bg-card hover:text-text-primary",
                        )}
                      >
                        <span>{item.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
