"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, ArrowRight, CornerDownLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { SearchDocItem } from "@/types/docs";
import { cn } from "@/lib/utils";

interface SearchDialogProps {
  searchIndex: SearchDocItem[];
}

export function DocsSearch({ searchIndex }: SearchDialogProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return searchIndex.slice(0, 5);

    const q = query.toLowerCase().trim();
    return searchIndex
      .filter((item) => {
        const inTitle = item.title.toLowerCase().includes(q);
        const inDesc = item.description.toLowerCase().includes(q);
        const inSection = item.section.toLowerCase().includes(q);
        const inHeadings = item.headings.some((h) =>
          h.toLowerCase().includes(q),
        );
        return inTitle || inDesc || inSection || inHeadings;
      })
      .slice(0, 8);
  }, [query, searchIndex]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  const handleSelect = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex].href);
      }
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex h-10 w-full items-center justify-between rounded-xl border border-purple-500/20 bg-[#120a22]/90 px-3 text-xs text-zinc-300 shadow-sm backdrop-blur-md transition-all hover:border-purple-400/50 hover:bg-[#190d30] hover:text-white"
      >
        <span className="flex items-center gap-2.5">
          <Search className="h-3.5 w-3.5 text-purple-400 transition-colors group-hover:text-purple-300" />
          <span className="font-normal">Search documentation...</span>
        </span>
        <kbd className="pointer-events-none hidden rounded-md border border-purple-500/30 bg-purple-950/40 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-purple-300 sm:inline-block">
          ⌘K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl overflow-hidden p-0 border-purple-500/25 bg-[#0d071c]/95 backdrop-blur-2xl shadow-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Search Documentation</DialogTitle>
          </DialogHeader>

          <div className="flex items-center border-b border-purple-500/20 px-4 py-3 bg-[#130a26]/70">
            <Search className="mr-3 h-4 w-4 shrink-0 text-purple-400" />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search guides, commands, features, and topics..."
              className="h-9 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-zinc-500 text-zinc-100"
              autoFocus
            />
          </div>

          <div className="max-h-80 overflow-y-auto p-2">
            {results.length === 0 ? (
              <div className="py-10 text-center text-xs text-zinc-400">
                No documentation found matching &ldquo;
                <span className="text-purple-300">{query}</span>&rdquo;
              </div>
            ) : (
              <div className="space-y-1">
                {results.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.href}
                      onClick={() => handleSelect(item.href)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={cn(
                        "flex cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 text-xs transition-all",
                        isSelected
                          ? "bg-purple-500/20 border border-purple-400/30 text-white shadow-[0_0_16px_rgba(168,85,247,0.12)]"
                          : "border border-transparent text-zinc-300 hover:bg-white/[0.04]",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border",
                            isSelected
                              ? "border-purple-400/40 bg-purple-500/30 text-purple-200"
                              : "border-purple-500/20 bg-purple-950/30 text-purple-400",
                          )}
                        >
                          <FileText className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-zinc-100">
                              {item.title}
                            </span>
                            <span className="rounded-md border border-purple-500/20 bg-purple-950/40 px-1.5 py-0.5 text-[10px] font-medium text-purple-300">
                              {item.section}
                            </span>
                          </div>
                          {item.description && (
                            <p className="mt-1 line-clamp-1 text-[11.5px] text-zinc-400">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {isSelected && (
                          <span className="flex items-center gap-1 rounded bg-purple-500/20 px-1.5 py-0.5 text-[10px] text-purple-200">
                            <span>Select</span>
                            <CornerDownLeft className="h-2.5 w-2.5" />
                          </span>
                        )}
                        <ArrowRight
                          className={cn(
                            "h-3.5 w-3.5 transition-transform",
                            isSelected
                              ? "translate-x-0.5 text-purple-300"
                              : "opacity-0",
                          )}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-purple-500/15 bg-[#090514]/80 px-4 py-2.5 text-[11px] text-zinc-400">
            <span>Documentation Search</span>
            <div className="flex items-center gap-2">
              <span>
                Use{" "}
                <kbd className="rounded border border-purple-500/20 bg-purple-950/40 px-1 py-0.5 font-mono text-[10px] text-purple-300">
                  ↑
                </kbd>{" "}
                <kbd className="rounded border border-purple-500/20 bg-purple-950/40 px-1 py-0.5 font-mono text-[10px] text-purple-300">
                  ↓
                </kbd>{" "}
                to navigate
              </span>
              <span>•</span>
              <span>
                <kbd className="rounded border border-purple-500/20 bg-purple-950/40 px-1 py-0.5 font-mono text-[10px] text-purple-300">
                  ESC
                </kbd>{" "}
                to close
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
