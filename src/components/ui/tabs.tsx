"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const Tabs = React.forwardRef<HTMLDivElement, TabsPrimitive.Root.Props>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Root
      ref={ref}
      className={cn("flex flex-col gap-4 w-full", className)}
      {...props}
    />
  )
)
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef<HTMLDivElement, TabsPrimitive.List.Props>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "inline-flex h-10 items-center justify-start rounded-lg bg-muted/50 p-1 text-muted-foreground w-fit",
        className
      )}
      {...props}
    />
  )
)
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsPrimitive.Tab.Props>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Tab
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-active:bg-background data-active:text-foreground data-active:shadow-sm",
        className
      )}
      {...props}
    />
  )
)
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<HTMLDivElement, TabsPrimitive.Panel.Props>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Panel
      ref={ref}
      className={cn(
        "mt-0 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  )
)
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
