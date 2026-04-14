import * as React from "react"

import { cn } from "@/lib/utils"

export const Code = React.forwardRef<HTMLPreElement, React.HTMLAttributes<HTMLPreElement>>(
  ({ className, ...props }, ref) => {
    return (
      <pre
        className={cn("relative rounded bg-muted px-3 py-2 font-mono text-sm font-semibold", className)}
        ref={ref}
        {...props}
      />
    )
  },
)
Code.displayName = "Code"
