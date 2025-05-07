"use client"

import type React from "react"
import { useState, useEffect, useRef, memo } from "react"
import { useNavigation } from "@/contexts/navigation-context"
import { Terminal, X, HelpCircle, NotebookTabsIcon as TabIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/contexts/theme-context"
import { TERMINAL_COMMANDS } from "@/lib/constants"
import { NAV_ITEMS } from "@/lib/constants"

// Use React.memo to prevent unnecessary re-renders
const TerminalFooter = memo(function TerminalFooter() {
  const [isActive, setIsActive] = useState(false)
  const [input, setInput] = useState("")
  const [showHelpModal, setShowHelpModal] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { navigateTo } = useNavigation()
  const themeContext = useTheme()
  const [isMobile, setIsMobile] = useState(false)
  const [currentSuggestion, setCurrentSuggestion] = useState<string>("")
  const [isTyping, setIsTyping] = useState(false)
  const [targetText, setTargetText] = useState("")
  const [displayedText, setDisplayedText] = useState("")
  const typingSpeedRef = useRef(30) // milliseconds per character
  const completedTextRef = useRef("") // Store the completed text for form submission

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
  }, [isActive])

  // Add new effect for typing animation in the input field
  useEffect(() => {
    if (!isTyping || displayedText === targetText) return

    let currentIndex = displayedText.length
    let typingInterval: NodeJS.Timeout

    const typeNextChar = () => {
      if (currentIndex < targetText.length) {
        setDisplayedText(targetText.substring(0, currentIndex + 1))
        currentIndex++
      } else {
        // Typing complete
        clearInterval(typingInterval)
        setIsTyping(false)
        // Ensure we set the full target text at the end
        setDisplayedText(targetText)
        setInput(targetText)
        completedTextRef.current = targetText // Store the completed text
        // Clear suggestion after typing
        setCurrentSuggestion("")
      }
    }

    typingInterval = setInterval(typeNextChar, typingSpeedRef.current)

    return () => {
      clearInterval(typingInterval)
    }
  }, [isTyping, displayedText, targetText])

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

  // Function to start typing animation
  const startTypingAnimation = (suggestion: string) => {
    // Only animate the part that's being autocompleted
    if (suggestion.startsWith(input) && input.length < suggestion.length) {
      setIsTyping(true)
      setTargetText(suggestion)
      setDisplayedText(input)
      completedTextRef.current = suggestion // Store the suggestion for form submission
      setCurrentSuggestion("")
    } else {
      // If the suggestion doesn't extend the current input, just set it directly
      setInput(suggestion)
      completedTextRef.current = suggestion // Store the suggestion for form submission
      setCurrentSuggestion("")
    }
  }

  // Generate suggestions based on input
  const generateSuggestion = (value: string) => {
    if (!value.trim()) {
      setCurrentSuggestion("")
      return
    }

    const lowerValue = value.toLowerCase()

    // Check if input starts with "run "
    if (lowerValue.startsWith(`${TERMINAL_COMMANDS.run} `)) {
      const pageQuery = lowerValue.substring(4).trim()
      if (!pageQuery) {
        setCurrentSuggestion("")
        return
      }

      // Find the first matching nav item
      const matchingPage = NAV_ITEMS.find(
        (item) =>
          item.name.toLowerCase().startsWith(pageQuery) || item.path.substring(1).toLowerCase().startsWith(pageQuery),
      )

      if (matchingPage) {
        const suggestion = `${TERMINAL_COMMANDS.run} ${matchingPage.path.substring(1) || "home"}`
        if (suggestion.toLowerCase() !== lowerValue) {
          setCurrentSuggestion(suggestion)
        } else {
          setCurrentSuggestion("")
        }
      } else {
        setCurrentSuggestion("")
      }
    } else {
      // Suggest commands
      const commands = [
        TERMINAL_COMMANDS.help,
        TERMINAL_COMMANDS.darkMode,
        TERMINAL_COMMANDS.lightMode,
        `${TERMINAL_COMMANDS.run}`,
      ]

      const matchingCommand = commands.find((cmd) => cmd.startsWith(lowerValue) && cmd !== lowerValue)
      setCurrentSuggestion(matchingCommand || "")
    }
  }

  // Update the handleInputChange function
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    // If we're currently in a typing animation, cancel it
    if (isTyping) {
      setIsTyping(false)
      setTargetText("")
    }
    setInput(newValue)
    completedTextRef.current = newValue // Update the completed text reference
    generateSuggestion(newValue)
  }

  // Update keyboard navigation to use typing animation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Tab to accept suggestion
    if (e.key === "Tab" && currentSuggestion) {
      e.preventDefault()
      startTypingAnimation(currentSuggestion)
    }

    // Escape to clear suggestion
    if (e.key === "Escape") {
      setCurrentSuggestion("")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // If we're currently in a typing animation, complete it immediately
    if (isTyping) {
      setIsTyping(false)
      setInput(targetText)
      setDisplayedText(targetText)
    }

    // Use the completed text (from tab completion) or current input
    const commandToRun = completedTextRef.current || input

    if (!commandToRun.trim()) return

    const command = commandToRun.trim().toLowerCase()
    setInput("") // Clear input immediately
    completedTextRef.current = "" // Clear completed text reference
    setCurrentSuggestion("") // Clear suggestion

    // Process commands
    if (command === TERMINAL_COMMANDS.help) {
      setShowHelpModal(true)
    } else if (command === TERMINAL_COMMANDS.darkMode) {
      setThemeFallback("dark")
    } else if (command === TERMINAL_COMMANDS.lightMode) {
      setThemeFallback("light")
    } else if (command.startsWith(`${TERMINAL_COMMANDS.run} `)) {
      const page = command.substring(4).trim()

      const handleNavigation = (path: string) => {
        // Add a slight delay before navigation
        setTimeout(() => {
          try {
            navigateTo(path)
          } catch (error) {
            console.error("Navigation error:", error)
          }
        }, 800)
      }

      // Find the matching nav item
      const navItem = NAV_ITEMS.find(
        (item) => item.name.toLowerCase() === page.toUpperCase() || item.path.substring(1) === page,
      )

      if (navItem) {
        handleNavigation(navItem.path)
      } else if (page === "home") {
        handleNavigation("/")
      } else if (page === "updates") {
        // Add specific handling for updates page
        handleNavigation("/updates")
      }
    }
  }

  return (
    <>
      <div className="flex items-center">
        <div className="flex items-center w-full">
          <form onSubmit={handleSubmit} className="flex items-center w-full">
            <Terminal className="h-4 w-4 mr-2 text-primary/50 flex-shrink-0" />
            <div className="relative flex-grow flex items-center overflow-visible">
              <input
                ref={inputRef}
                type="text"
                value={isTyping ? displayedText : input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-none outline-none font-sf-mono text-xs text-primary truncate pr-16 md:pr-24"
                placeholder=""
                autoCapitalize="none"
                autoComplete="off"
                onFocus={() => setIsActive(true)}
                onBlur={() => {
                  setIsActive(false)
                  // Clear suggestion when input loses focus
                  setTimeout(() => setCurrentSuggestion(""), 200)
                }}
              />

              {/* Inline suggestion */}
              {currentSuggestion && !isTyping && (
                <div className="absolute inset-0 pointer-events-none flex items-center">
                  <div className="invisible">{input}</div>
                  <div className="flex items-center">
                    <span className="font-sf-mono text-xs text-primary/30">
                      {currentSuggestion.substring(input.length)}
                    </span>
                    <TabIcon className="h-3 w-3 ml-1 text-primary/30" />
                  </div>
                </div>
              )}

              {!isActive && !input && !isTyping && (
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
                        <span className="text-primary/50">run updates</span> - navigate to system updates
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
