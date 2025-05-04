"use client"

import type React from "react"
import { useState, useEffect, useRef, memo } from "react"
import { useNavigation } from "@/contexts/navigation-context"
import { Terminal, X, HelpCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/contexts/theme-context"
import { TERMINAL_COMMANDS } from "@/lib/constants"
import { NAV_ITEMS } from "@/lib/constants"

type CommandResponse = {
  text: string
  isTyping: boolean
}

// Use React.memo to prevent unnecessary re-renders
const TerminalFooter = memo(function TerminalFooter() {
  const [isActive, setIsActive] = useState(false)
  const [input, setInput] = useState("")
  const [response, setResponse] = useState<CommandResponse | null>(null)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { navigateTo } = useNavigation()
  const [notification, setNotification] = useState<string | null>(null)
  const themeContext = useTheme()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  // Fallback function if context is not available
  const setThemeFallback = (theme: "light" | "dark") => {
    if (themeContext && themeContext.setTheme) {
      themeContext.setTheme(theme)
    } else {
      // Direct DOM manipulation as fallback
      if (theme === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
      localStorage.setItem("theme", theme)
    }
  }

  // Focus input when terminal is activated
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isActive, response])

  // Typewriter effect for response
  useEffect(() => {
    if (!response || !response.isTyping) return

    const text = response.text
    let currentIndex = 0
    let currentText = ""
    let typingInterval: NodeJS.Timeout

    const typeNextChar = () => {
      if (currentIndex < text.length) {
        currentText += text[currentIndex]
        currentIndex++

        // Update with a new object to avoid reference issues
        setResponse({
          text: currentText,
          isTyping: currentIndex < text.length,
        })
      } else {
        // Typing complete
        clearInterval(typingInterval)

        // Auto-clear response after delay (shorter timeout)
        const clearTimeout = setTimeout(() => {
          setResponse(null)
        }, 1200)

        return () => clearTimeout(clearTimeout)
      }
    }

    typingInterval = setInterval(typeNextChar, 30)

    return () => {
      clearInterval(typingInterval)
    }
  }, [response])

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showHelpModal) {
        setShowHelpModal(false)
      }
    }

    window.addEventListener("keydown", handleEscKey)
    return () => window.removeEventListener("keydown", handleEscKey)
  }, [showHelpModal])

  // Add blinking cursor animation
  useEffect(() => {
    if (isActive || input) return

    const cursorInterval = setInterval(() => {
      const cursor = document.querySelector(".terminal-cursor")
      if (cursor) {
        cursor.classList.toggle("opacity-0")
      }
    }, 500)

    return () => clearInterval(cursorInterval)
  }, [isActive, input])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    const command = input.trim().toLowerCase()
    setInput("") // Clear input immediately

    // Process commands
    if (command === TERMINAL_COMMANDS.help) {
      setShowHelpModal(true)
      setNotification(`Ran command: ${command}`)
      setTimeout(() => setNotification(null), 2000)
    } else if (command === TERMINAL_COMMANDS.darkMode) {
      setThemeFallback("dark")
      setResponse({
        text: "status: dark mode activated",
        isTyping: true,
      })
      setNotification(`Ran command: ${command}`)
      setTimeout(() => setNotification(null), 2000)
    } else if (command === TERMINAL_COMMANDS.lightMode) {
      setThemeFallback("light")
      setResponse({
        text: "status: light mode activated",
        isTyping: true,
      })
      setNotification(`Ran command: ${command}`)
      setTimeout(() => setNotification(null), 2000)
    } else if (command.startsWith(`${TERMINAL_COMMANDS.run} `)) {
      const page = command.substring(4).trim()

      const handleNavigation = (path: string) => {
        // Add a slight delay before navigation
        setTimeout(() => {
          try {
            // Clear the response right before navigation
            setResponse(null)
            navigateTo(path)
          } catch (error) {
            console.error("Navigation error:", error)
            setResponse({
              text: `error: navigation failed to ${path}`,
              isTyping: true,
            })
          }
        }, 800)
      }

      // Find the matching nav item
      const navItem = NAV_ITEMS.find(
        (item) => item.name.toLowerCase() === page.toUpperCase() || item.path.substring(1) === page,
      )

      if (navItem) {
        setResponse({
          text: `status: transmission initiated to ${navItem.path}`,
          isTyping: true,
        })
        setNotification(`Ran command: ${command}`)
        setTimeout(() => setNotification(null), 2000)
        handleNavigation(navItem.path)
      } else if (page === "home") {
        setResponse({
          text: `status: transmission initiated to /`,
          isTyping: true,
        })
        setNotification(`Ran command: ${command}`)
        setTimeout(() => setNotification(null), 2000)
        handleNavigation("/")
      } else {
        setResponse({
          text: `error: unknown destination '${page}'`,
          isTyping: true,
        })
        setNotification(`Ran command: ${command}`)
        setTimeout(() => setNotification(null), 2000)
      }
    } else {
      setResponse({
        text: `error: unknown command '${command}'`,
        isTyping: true,
      })
      setNotification(`Ran command: ${command}`)
      setTimeout(() => setNotification(null), 2000)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  return (
    <>
      <div className="flex items-center">
        {notification && (
          <div className="absolute -top-6 left-2 md:left-6 text-xs font-sf-mono bg-background dark:bg-eerie-black border border-primary/20 px-2 py-0.5 rounded-sm shadow-sm animate-in fade-in slide-in-from-bottom-2 z-70">
            {notification}
          </div>
        )}
        <div className="flex items-center w-full">
          <form onSubmit={handleSubmit} className="flex items-center w-full">
            <Terminal className="h-4 w-4 mr-2 text-primary/50 flex-shrink-0" />
            <div className="relative flex-grow flex items-center overflow-visible">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleInputChange}
                className="w-full bg-transparent border-none outline-none font-sf-mono text-xs text-primary truncate pr-16 md:pr-24"
                placeholder=""
                autoCapitalize="none"
                autoComplete="off"
                onFocus={() => setIsActive(true)}
                onBlur={() => setIsActive(false)}
              />
              {!isActive && !input && (
                <div className="absolute inset-0 pointer-events-none flex items-center">
                  <span className="font-sf-mono text-xs text-primary/50 flex items-center whitespace-nowrap truncate">
                    {isMobile ? "help" : 'type "help" to start'}
                  </span>
                </div>
              )}
              <div className="absolute right-0 top-0 bottom-0 flex items-center pointer-events-none">
                <span className="text-xs font-sf-mono text-primary/40 mr-1">[terminal]</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-black dark:bg-white animate-[blink_0.5s_ease-in-out_infinite]"></span>
              </div>
            </div>
          </form>
          {response && (
            <div className="absolute -top-6 left-2 md:left-6 text-xs font-sf-mono bg-background dark:bg-eerie-black border border-primary/20 px-2 py-0.5 rounded-sm shadow-sm animate-in fade-in slide-in-from-bottom-2 z-70">
              {response.text}
              {response.isTyping && <span className="animate-[blink_0.5s_ease-in-out_infinite]">_</span>}
            </div>
          )}
          <div className="h-4 border-r border-primary/20 mx-2 md:mx-4 hidden md:block"></div>
        </div>
      </div>

      {/* Help Modal */}
      <AnimatePresence>
        {showHelpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setShowHelpModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md bg-background dark:bg-eerie-black border border-primary/30 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b border-primary/20">
                <div className="flex items-center">
                  <HelpCircle className="h-4 w-4 mr-2 text-primary/70" />
                  <h3 className="text-sm font-sf-mono">Available Commands</h3>
                </div>
                <button onClick={() => setShowHelpModal(false)} className="text-primary/70 hover:text-primary">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-4">
                <div className="space-y-3 font-sf-mono text-xs">
                  <div>
                    <div className="text-primary/70 mb-1">Navigation:</div>
                    <div className="ml-4">
                      <div>
                        <span className="text-primary/50">run about</span> - navigate to about page
                      </div>
                      <div>
                        <span className="text-primary/50">run skills</span> - navigate to skills page
                      </div>
                      <div>
                        <span className="text-primary/50">run experience</span> - navigate to experience page
                      </div>
                      <div>
                        <span className="text-primary/50">run education</span> - navigate to education page
                      </div>
                      <div>
                        <span className="text-primary/50">run publications</span> - navigate to publications page
                      </div>
                      <div>
                        <span className="text-primary/50">run contact</span> - navigate to contact page
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-primary/70 mb-1">Theme:</div>
                    <div className="ml-4">
                      <div>
                        <span className="text-primary/50">innie</span> - switch to dark mode
                      </div>
                      <div>
                        <span className="text-primary/50">outie</span> - switch to light mode
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-primary/70 mb-1">Help:</div>
                    <div className="ml-4">
                      <div>
                        <span className="text-primary/50">help</span> - display this help message
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-primary/20 p-3 text-xs font-sf-mono text-primary/50 text-center">
                SYSTEM CONSOLE - COMMAND REFERENCE
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
})

export { TerminalFooter }
