"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useActionState } from "react"
import { sendEmailWithEmailJS, type FormState } from "@/actions/send-email-emailjs"
import { Send } from "lucide-react"

interface ContactFormModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ContactFormModal({ isOpen, onClose }: ContactFormModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Initialize form state
  const initialState: FormState = { errors: {} }
  const [state, dispatch] = useActionState(sendEmailWithEmailJS, initialState)

  // Reset form after successful submission
  useEffect(() => {
    console.log("Form submission state:", state)
    if (state?.success) {
      setName("")
      setEmail("")
      setMessage("")
      setIsSubmitted(true)

      // Auto-close after successful submission
      const timer = setTimeout(() => {
        onClose()
        setIsSubmitted(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [state, onClose])

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  // Handle form input changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 md:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-[95%] md:max-w-md bg-background dark:bg-eerie-black border border-primary/30 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-3 md:p-4 border-b border-primary/20">
              <div className="text-xs md:text-sm font-sf-mono">COMPOSE EMAIL </div>
              <button onClick={onClose} className="text-primary/70 hover:text-primary font-sf-mono text-xs">
                [ CLOSE ]
              </button>
            </div>

            {isSubmitted ? (
              /* Success message */
              <div className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <Send className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-lg font-medium mb-2">MESSAGE TRANSMITTED</h3>
                <p className="text-sm text-primary/70 mb-4">Your communication has been successfully received.</p>
                <div className="text-xs font-sf-mono text-primary/50 animate-mechanical-pulse">
                  CLOSING TRANSMISSION IN 3 SECONDS
                </div>
              </div>
            ) : (
              /* Form */
              <form
                action={async (formData) => {
                  setIsSubmitting(true)
                  console.log("Form submission started")
                  try {
                    // With useActionState, dispatch updates the state but doesn't return it
                    await dispatch(formData)
                    console.log("Form submission completed")
                    // We don't need to check result.errors here as state will be updated automatically
                  } catch (error) {
                    console.error("Error during form submission:", error)
                  } finally {
                    setIsSubmitting(false)
                  }
                }}
                className="p-3 md:p-4"
              >
                <div className="space-y-3 md:space-y-4 relative">
                  {isSubmitting && (
                    <div className="absolute inset-0 bg-background/80 dark:bg-eerie-black/80 backdrop-blur-sm z-10 flex items-center justify-center">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 border-2 border-primary/20 border-t-primary/60 rounded-full animate-spin"></div>
                        <p className="text-xs font-sf-mono mt-2 animate-mechanical-pulse">SENDING...</p>
                      </div>
                    </div>
                  )}
                  <div className="space-y-1 md:space-y-2">
                    <label htmlFor="name" className="text-[10px] md:text-xs font-sf-mono flex items-center">
                      <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary/50 mr-1 md:mr-2"></span>
                      YOUR NAME
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={name}
                      onChange={handleNameChange}
                      className="w-full bg-transparent border border-primary/20 p-1.5 md:p-2 text-xs md:text-sm focus:outline-none focus:border-primary/50 font-sf-mono tracking-wider"
                    />
                    {state?.errors?.name && (
                      <p className="text-[10px] text-red-500 font-sf-mono mt-1">{state.errors.name[0]}</p>
                    )}
                  </div>

                  <div className="space-y-1 md:space-y-2">
                    <label htmlFor="email" className="text-[10px] md:text-xs font-sf-mono flex items-center">
                      <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary/50 mr-1 md:mr-2"></span>
                      YOUR EMAIL ADDRESS  
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      className="w-full bg-transparent border border-primary/20 p-1.5 md:p-2 text-xs md:text-sm focus:outline-none focus:border-primary/50 font-sf-mono tracking-wider"
                    />
                    {state?.errors?.email && (
                      <p className="text-[10px] text-red-500 font-sf-mono mt-1">{state.errors.email[0]}</p>
                    )}
                  </div>

                  <div className="space-y-1 md:space-y-2">
                    <label htmlFor="message" className="text-[10px] md:text-xs font-sf-mono flex items-center">
                      <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary/50 mr-1 md:mr-2"></span>
                      YOUR MESSAGE FOR ME  
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      value={message}
                      onChange={handleMessageChange}
                      className="w-full bg-transparent border border-primary/20 p-1.5 md:p-2 text-xs md:text-sm focus:outline-none focus:border-primary/50 font-sf-mono tracking-wider"
                    ></textarea>
                    {state?.errors?.message && (
                      <p className="text-[10px] text-red-500 font-sf-mono mt-1">{state.errors.message[0]}</p>
                    )}
                  </div>

                  {state?.errors?._form && (
                    <div className="p-2 bg-red-500/10 border border-red-500/30 rounded">
                      <p className="text-[10px] text-red-500 font-sf-mono flex items-center">
                        <span className="w-1.5 h-1.5 bg-red-500 mr-1.5 rounded-full"></span>
                        {state.errors._form[0]}
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="rounded-none bg-transparent border border-primary/20 text-primary hover:bg-primary/5 font-sf-mono text-xs w-full group h-8 md:h-10 relative"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <span className="w-4 h-4 border-2 border-primary/20 border-t-primary/60 rounded-full animate-spin mr-2"></span>
                        SENDING...
                      </span>
                    ) : (
                      <span className="group-hover:scale-110 transition-transform duration-200 flex items-center justify-center">
                        SEND MESSAGE
                        <Send className="ml-2 h-3 w-3" />
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
