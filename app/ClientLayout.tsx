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
import { motion } from "framer-motion"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { IntroLoader } from "@/components/ui/intro-loader"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMounted, setIsMounted] = useState(false)
  const [isTransitionReady, setIsTransitionReady] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [contentReady, setContentReady] = useState(false)

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

  const handleIntroComplete = () => {
    setShowIntro(false)
    setTimeout(() => {
      setContentReady(true)
    }, 100)
  }

  // Animation variants for header and footer
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
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
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
        delay: 0.15,
      },
    },
  }

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
        delay: 0.1,
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
                  var root = document.documentElement;
                  root.classList.remove('light', 'dark');
                  root.classList.add(theme);
                  root.style.colorScheme = theme;
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sf-pro bg-background text-foreground theme-transition">
        <ThemeProvider>
          <NavigationProvider isReady={isTransitionReady}>
            {showIntro && isMounted && <IntroLoader onLoadComplete={handleIntroComplete} />}

            <div
              className="flex flex-col min-h-screen overflow-hidden"
              style={{ visibility: showIntro ? "hidden" : "visible" }}
            >
              {/* Only render client-side components after mounting */}
              <ClientOnly>
                {!isTouchDevice && <CustomCursor />}
                <TouchFeedback />
                <LastAccessed />
              </ClientOnly>

              {!showIntro && (
                <>
                  <motion.div
                    key="header"
                    initial="hidden"
                    animate={contentReady ? "visible" : "hidden"}
                    variants={headerVariants}
                  >
                    <Header />
                  </motion.div>

                  <motion.main
                    className="flex-1 pt-16 pb-16 overflow-y-auto relative theme-transition"
                    key="main-content"
                    initial="hidden"
                    animate={contentReady ? "visible" : "hidden"}
                    variants={contentVariants}
                  >
                    {children}
                    <TransitionOverlay />
                  </motion.main>

                  <motion.div
                    key="footer"
                    initial="hidden"
                    animate={contentReady ? "visible" : "hidden"}
                    variants={footerVariants}
                  >
                    <Footer />
                  </motion.div>
                </>
              )}
            </div>
          </NavigationProvider>
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}
