"use client"

import { useState, useEffect } from "react"

export function LastAccessed() {
  const [timestamp, setTimestamp] = useState("")
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    // Set initial timestamp
    updateTimestamp()

    // Update timestamp every minute
    const interval = setInterval(updateTimestamp, 60000)

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  function updateTimestamp() {
    const now = new Date()
    const formattedDate = now.toISOString().split("T")[0]
    const hours = String(now.getHours()).padStart(2, "0")
    const minutes = String(now.getMinutes()).padStart(2, "0")
    const seconds = String(now.getSeconds()).padStart(2, "0")
    const formattedTime = `${hours}:${minutes}:${seconds}`

    setTimestamp(`${formattedDate} ${formattedTime}`)
  }

  // Don't show on mobile to save space
  if (isMobile) return null

  return (
    null
  )
}
