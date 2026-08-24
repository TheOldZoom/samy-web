"use client";

import React, { useState, useEffect } from "react";
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

const sectionIcons: Record<string, React.ElementType> = {
  Overview: BookOpen,
  "Getting Started": Sparkles,
  Commands: Shield,
  Configuration: Wrench,
};

export function DocsMobileNav({ sections, searchIndex }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({});

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
    <div className="flex w-full items-center justify-between border-b border-purple-500/15 bg-[#0e081c]/95 px-4 py-3 backdrop-blur-xl lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl border border-purple-500/20 bg-purple-950/40 px-3.5 py-2 text-xs font-semibold text-purple-200 shadow-sm transition-colors hover:border-purple-400/40 hover:bg-purple-900/40 hover:text-white"
      >
        <Menu className="h-4 w-4 text-purple-400" />
        <span>Docs Menu</span>
      </button>

      <div className="w-52">
        <DocsSearch searchIndex={searchIndex} />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="fixed inset-y-0 left-0 top-0 z-50 h-full w-[85vw] max-w-sm translate-x-0 translate-y-0 rounded-none border-r border-purple-500/20 bg-[#0c0717]/98 p-6 overflow-y-auto shadow-2xl backdrop-blur-2xl duration-200">
          <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b border-purple-500/15">
            <div className="flex items-center gap-2.5">
              <img
                src="/samy.jpg"
                alt="samy"
                className="h-7 w-7 rounded-lg object-cover"
              />
              <div>
                <DialogTitle className="text-sm font-bold text-zinc-100">
                  Documentation
                </DialogTitle>
                <p className="text-[11px] text-zinc-400">Samy Bot Guides</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1 text-zinc-400 hover:bg-white/[0.04] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </DialogHeader>

          <div className="my-4">
            <DocsSearch searchIndex={searchIndex} />
          </div>

          <nav className="space-y-6 pb-6">
            {sections.map((section) => {
              const isCollapsed = !!collapsedSections[section.title];
              const Icon = sectionIcons[section.title] || Folder;

              return (
                <div key={section.title} className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => toggleSection(section.title)}
                    className="flex w-full items-center justify-between px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-300"
                  >
                    <span className="flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-md border border-purple-500/20 bg-purple-950/40 text-purple-400">
                        <Icon className="h-3 w-3" />
                      </div>
                      <span>{section.title}</span>
                    </span>
                    {isCollapsed ? (
                      <ChevronRight className="h-3.5 w-3.5 text-zinc-500" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
                    )}
                  </button>

                  {!isCollapsed && (
                    <div className="space-y-1 pl-2 ml-2">
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
                              "flex items-center justify-between rounded-lg px-3 py-2 text-[13px] transition-all",
                              isActive
                                ? "bg-purple-500/20 font-semibold text-purple-200"
                                : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100",
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
        </DialogContent>
      </Dialog>
    </div>
  );
}
