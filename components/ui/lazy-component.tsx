"use client"

import type React from "react"

import { lazy, Suspense, type ComponentType } from "react"

interface LazyComponentProps {
  component: () => Promise<{ default: ComponentType<any> }>
  fallback?: React.ReactNode
  props?: Record<string, any>
}

export function LazyComponent({ component, fallback = null, props = {} }: LazyComponentProps) {
  const LazyComponent = lazy(component)

  return (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  )
}
