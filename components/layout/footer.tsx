import Link from "next/link"
import { Github, Linkedin, Mail } from "lucide-react"
import { TerminalFooter } from "@/components/ui/terminal-footer"

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background border-t border-primary/10 z-60">
      <div className="w-full px-3 md:px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="w-full mb-4 md:mb-0 md:w-[70%]">
            <TerminalFooter />
          </div>
          <div className="w-full md:w-[30%] flex flex-col md:flex-row items-center justify-between">
            <p className="font-sf-mono text-xs text-primary/50 mb-3 md:mb-0">
              © {new Date().getFullYear()} Rushir Bhavsar
            </p>
            <div className="flex space-x-6">
              <Link
                href="https://linkedin.com/in/rushir-bhavsar/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary/50 hover:text-primary transition-colors"
              >
                <Linkedin className="h-4 w-4 text-blue-700" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="https://rushirbhavsar.me"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary/50 hover:text-primary transition-colors"
              >
                <Github className="h-4 w-4 text-purple-800" />
                <span className="sr-only">Website</span>
              </Link>
              <Link
                href="mailto:bhavsarrushir@gmail.com"
                className="text-primary/50 hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4 text-amber-900" />
                <span className="sr-only">Email</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
