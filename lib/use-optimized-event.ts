"use client"

import type React from "react"

import { useEffect, useRef } from "react"

/**
 * A custom hook that executes a callback function when a click occurs outside of a specified element.
 * @param ref A React ref pointing to the element to monitor.
 * @param callback A function to execute when a click occurs outside the element.
 */
export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T>,
  callback: (event: MouseEvent) => void,
): void {
  const callbackRef = useRef(callback)

  // Update the callback if it changes
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callbackRef.current(event)
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside)

    // Unbind the event listener on cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ref])
}
