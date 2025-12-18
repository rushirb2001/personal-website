import { TerminalFooter } from "@/components/ui/terminal-footer"

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background border-t border-primary/10 z-40">
      <div className="w-full px-3 md:px-4 py-4">
        <div className="flex flex-row justify-between items-center">
          <div className="w-[80%] md:w-[70%]">
            <TerminalFooter />
          </div>
          <div className="w-[20%] md:w-[30%] flex justify-end">
            <p className="font-sf-mono text-xs text-primary/50">
              <span className="md:hidden">© 2025 RB</span>
              <span className="hidden md:inline">© {new Date().getFullYear()} Rushir Bhavsar</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
