"use client"

import type React from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { LastAccessed } from "@/components/ui/last-accessed"
import { TransitionOverlay } from "@/components/transitions/transition-overlay"
import { NavigationProvider } from "@/contexts/navigation-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { useEffect, useState } from "react"
import { ClientOnly } from "@/components/ui/client-only"
import { CustomCursor } from "@/components/ui/custom-cursor"
import { TouchFeedback } from "@/components/ui/touch-feedback"
import { motion, AnimatePresence } from "framer-motion"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMounted, setIsMounted] = useState(false)
  const [isTransitionReady, setIsTransitionReady] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [isInitialRender, setIsInitialRender] = useState(true)

  useEffect(() => {
    setIsMounted(true)

    // Check if this is a touch device
    const checkTouch = () => {
      setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0)
    }

    checkTouch()

    // Preload SF fonts
    const sfProFont = document.createElement("link")
    sfProFont.rel = "preload"
    sfProFont.href = "https://fonts.cdnfonts.com/css/sf-pro-display"
    sfProFont.as = "style"
    document.head.appendChild(sfProFont)

    const sfMonoFont = document.createElement("link")
    sfMonoFont.rel = "preload"
    sfMonoFont.href = "https://fonts.cdnfonts.com/css/sf-mono"
    sfMonoFont.as = "style"
    document.head.appendChild(sfMonoFont)

    // Mark initial render complete after a short delay
    const initialRenderTimer = setTimeout(() => {
      setIsInitialRender(false)
    }, 300)

    return () => clearTimeout(initialRenderTimer)
  }, [])

  useEffect(() => {
    if (isMounted) {
      // Short delay to ensure everything is properly initialized
      const timer = setTimeout(() => {
        setIsTransitionReady(true)
      }, 200)

      return () => clearTimeout(timer)
    }
  }, [isMounted])

  // Animation variants for header and footer
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
        delay: 0.1,
      },
    },
  }

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
        delay: 0.2,
      },
    },
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/sf-pro-display" />
        <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/sf-mono" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
        {/* EmailJS Script */}
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
        <script type="text/javascript">
          {`
            (function() {
              try {
                emailjs.init("vCNvTU_mqabgUgPcO");
              } catch (e) {
                console.error("Error initializing EmailJS:", e);
              }
            })();
          `}
        </script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'light';
                  document.documentElement.classList.toggle('dark', theme === 'dark');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sf-pro bg-background text-foreground transition-colors duration-200">
        <ThemeProvider>
          <NavigationProvider isReady={isTransitionReady}>
            <div className="flex flex-col min-h-screen overflow-hidden">
              {/* Only render client-side components after mounting */}
              <ClientOnly>
                {!isTouchDevice && <CustomCursor />}
                <TouchFeedback />
                <LastAccessed />
              </ClientOnly>

              <AnimatePresence mode="wait">
                {isMounted && (
                  <>
                    <motion.div
                      key="header"
                      initial={isInitialRender ? "hidden" : "visible"}
                      animate="visible"
                      variants={headerVariants}
                    >
                      <Header />
                    </motion.div>

                    <motion.main
                      className="flex-1 pt-16 pb-16 overflow-y-auto relative"
                      key="main-content"
                      initial={isInitialRender ? "hidden" : "visible"}
                      animate="visible"
                      variants={contentVariants}
                    >
                      {children}
                      <TransitionOverlay />
                    </motion.main>

                    <motion.div
                      key="footer"
                      initial={isInitialRender ? "hidden" : "visible"}
                      animate="visible"
                      variants={footerVariants}
                    >
                      <Footer />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </NavigationProvider>
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}
