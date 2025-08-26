"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm font-medium leading-none text-gray-800 select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 group-data-[disabled=true]:text-gray-500 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-disabled:text-gray-500",
        className
      )}
      {...props}
    />
  )
}

export { Label }
