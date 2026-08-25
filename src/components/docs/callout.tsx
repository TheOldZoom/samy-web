import React from "react";
import { Info, Lightbulb, AlertTriangle, AlertOctagon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalloutProps {
  type?: "info" | "tip" | "warning" | "danger" | "success";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const calloutStyles = {
  info: {
    container: "border-blue-500/30 bg-blue-950/90 text-blue-100 shadow-[0_0_20px_rgba(59,130,246,0.08)]",
    badge: "bg-blue-500/20 text-blue-300 border-blue-400/30 shadow-[0_0_12px_rgba(59,130,246,0.2)]",
    icon: Info,
    titleColor: "text-blue-200 font-semibold",
    bodyColor: "text-blue-100/90",
  },
  tip: {
    container: "border-accent/30 bg-accent-deep/90 text-accent shadow-[0_0_20px_rgba(168,85,247,0.08)]",
    badge: "bg-accent/20 text-accent border-accent/30 shadow-[0_0_12px_rgba(168,85,247,0.2)]",
    icon: Lightbulb,
    titleColor: "text-accent font-semibold",
    bodyColor: "text-accent/90",
  },
  warning: {
    container: "border-amber-500/30 bg-amber-950/90 text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.08)]",
    badge: "bg-amber-500/20 text-amber-300 border-amber-400/30 shadow-[0_0_12px_rgba(245,158,11,0.2)]",
    icon: AlertTriangle,
    titleColor: "text-amber-200 font-semibold",
    bodyColor: "text-amber-100/90",
  },
  danger: {
    container: "border-red-500/30 bg-red-950/90 text-red-100 shadow-[0_0_20px_rgba(239,68,68,0.08)]",
    badge: "bg-red-500/20 text-red-300 border-red-400/30 shadow-[0_0_12px_rgba(239,68,68,0.2)]",
    icon: AlertOctagon,
    titleColor: "text-red-200 font-semibold",
    bodyColor: "text-red-100/90",
  },
  success: {
    container: "border-emerald-500/30 bg-emerald-950/90 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.08)]",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]",
    icon: Sparkles,
    titleColor: "text-emerald-200 font-semibold",
    bodyColor: "text-emerald-100/90",
  },
};

export function Callout({
  type = "info",
  title,
  children,
  className,
}: CalloutProps) {
  const style = calloutStyles[type] || calloutStyles.info;
  const Icon = style.icon;

  return (
    <div
      className={cn(
        "my-6 flex gap-3.5 rounded-xl border p-4 text-sm leading-relaxed transition-all",
        style.container,
        className
      )}
    >
      <div className="mt-0.5 shrink-0">
        <div
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-lg border",
            style.badge
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="flex-1 space-y-1 overflow-hidden">
        {title && (
          <div className={cn("text-[14px] tracking-tight", style.titleColor)}>
            {title}
          </div>
        )}
        <div
          className={cn(
            "text-[13.5px] leading-relaxed prose-p:my-1 prose-p:first:mt-0 prose-p:last:mb-0",
            style.bodyColor
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
