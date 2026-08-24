import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-lg border border-border-subtle bg-bg-elevated/60 px-3 py-2 text-sm text-text-primary transition-all outline-none placeholder:text-text-muted focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
