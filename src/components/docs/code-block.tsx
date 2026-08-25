"use client";

import React, { useState, useRef } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

interface PreBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  "data-language"?: string;
  "data-theme"?: string;
  rawcode?: string;
}

export function PreBlock({
  children,
  className,
  "data-language": language,
  ...props
}: PreBlockProps) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const handleCopy = async () => {
    if (!preRef.current) return;
    const codeText = preRef.current.innerText || "";
    try {
      await navigator.clipboard.writeText(codeText.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code", err);
    }
  };

  return (
    <div className="group relative my-6 overflow-hidden rounded-xl border border-accent/25 bg-bg-base shadow-xl shadow-black/40">
      <div className="flex items-center justify-between border-b border-border-subtle bg-bg-elevated px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>
          {language ? (
            <span className="ml-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-accent">
              {language}
            </span>
          ) : (
            <span className="ml-1.5 flex items-center gap-1 font-mono text-[11px] font-medium text-text-muted">
              <Terminal className="h-3 w-3 text-accent" />
              <span>Terminal</span>
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
          className="flex items-center gap-1.5 rounded-md border border-border-subtle bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent transition-all hover:border-accent/40 hover:bg-accent/20 hover:text-text-primary"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-300 font-medium text-[11px]">
                Copied!
              </span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-accent" />
              <span className="text-[11px]">Copy</span>
            </>
          )}
        </button>
      </div>

      <pre
        ref={preRef}
        className={cn(
          "overflow-x-auto p-4 text-[13.5px] leading-relaxed font-mono text-text-primary selection:bg-accent selection:text-white",
          className,
        )}
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}
