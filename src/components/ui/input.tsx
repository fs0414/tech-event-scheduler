import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full min-w-0 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-xs transition-all duration-200 outline-none",
        "placeholder:text-gray-500",
        "focus:border-primary focus:ring-2 focus:ring-primary/20",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-gray-800",
        "selection:bg-primary selection:text-white",
        className
      )}
      {...props}
    />
  )
}

export { Input }
