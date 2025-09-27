import { TerminalFooter } from "@/components/ui/terminal-footer"

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background border-t border-primary/10 z-60">
      <div className="w-full px-3 md:px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="w-full mb-4 md:mb-0 md:w-[70%]">
            <TerminalFooter />
          </div>
          <div className="w-full md:w-[30%] flex justify-end">
            <p className="font-sf-mono text-xs text-primary/50">© {new Date().getFullYear()} Rushir Bhavsar</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
