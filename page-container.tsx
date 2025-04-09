
import React from "react"
import { cn } from "@/lib/utils"

interface PageContainerProps {
  children: React.ReactNode
  className?: string
  fullWidth?: boolean
}

export function PageContainer({ 
  children, 
  className,
  fullWidth = false
}: PageContainerProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <main className={cn(
        "container mx-auto px-4 py-8",
        fullWidth ? "max-w-full" : "max-w-6xl",
        className
      )}>
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  )
}

export function PageHeader({
  title,
  description,
  className,
}: {
  title: string
  description?: string
  className?: string
}) {
  return (
    <div className={cn("mb-8", className)}>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
      {description && (
        <p className="mt-2 text-lg text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
