"use client";

import React, { useEffect, useState } from "react";
import type { TocItem } from "@/types/docs";
import { cn } from "@/lib/utils";
import { ArrowUp, AlignLeft } from "lucide-react";

interface TocProps {
  toc: TocItem[];
}

export function TableOfContents({ toc }: TocProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!toc.length) return;

    const headingElements = toc
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      {
        rootMargin: "0px 0px -65% 0px",
        threshold: 0.1,
      }
    );

    for (const el of headingElements) {
      observer.observe(el);
    }

    return () => {
      for (const el of headingElements) {
        observer.unobserve(el);
      }
    };
  }, [toc]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-elevated p-4.5 shadow-xl space-y-4">
      <div className="flex items-center gap-2 pb-2.5 border-b border-border-subtle">
        <AlignLeft className="h-3.5 w-3.5 text-accent" />
        <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
          On this page
        </span>
      </div>

      {toc && toc.length > 0 ? (
        <ul className="space-y-1 text-xs">
          {toc.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li
                key={item.id}
                className={cn(
                  "transition-colors",
                  item.level === 3 ? "pl-3.5 text-[11.5px]" : "pl-0 font-medium"
                )}
              >
                <a
                  href={`#${item.id}`}
                  className={cn(
                    "block rounded-md px-2 py-1.5 transition-all",
                    isActive
                      ? "bg-accent/15 text-accent font-semibold shadow-[0_0_12px_rgba(168,85,247,0.15)]"
                      : "text-text-muted hover:bg-bg-card hover:text-text-secondary"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    const target = document.getElementById(item.id);
                    if (target) {
                      const topOffset = 90;
                      const elementPosition = target.getBoundingClientRect().top;
                      const offsetPosition =
                        elementPosition + window.pageYOffset - topOffset;
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth",
                      });
                      history.pushState(null, "", `#${item.id}`);
                      setActiveId(item.id);
                    }
                  }}
                >
                  {item.title}
                </a>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-xs text-text-muted italic">Overview & guide summary</p>
      )}

      <div className="pt-3 border-t border-border-subtle">
        <button
          type="button"
          onClick={scrollToTop}
          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-text-muted transition-colors hover:bg-bg-card hover:text-text-secondary"
        >
          <ArrowUp className="h-3.5 w-3.5 text-accent" />
          <span>Back to top</span>
        </button>
      </div>
    </div>
  );
}
