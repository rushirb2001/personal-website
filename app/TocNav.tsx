"use client"

import { useEffect, useState } from "react"

const SECTIONS = [
  { id: "experience", label: "Experience", short: "Exp" },
  { id: "projects", label: "Projects", short: "Proj" },
  { id: "education", label: "Education", short: "Edu" },
  { id: "contact", label: "Contact", short: "Hi" },
]

type Props = {
  active: string | null
  onSelect: (id: string) => void
  onHome: () => void
}

export function TocNav({ active, onSelect, onHome }: Props) {
  const [elevated, setElevated] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const update = () => {
      const y = window.scrollY
      setVisible(y > 80)
      setElevated(y > 240)
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])

  const handleSelect = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    onSelect(id)
  }

  const handleHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    onHome()
  }

  return (
    <nav
      aria-label="Page sections"
      aria-hidden={!visible}
      className={`sticky top-0 z-50 transition-[transform,box-shadow] duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{
        backgroundColor: "#f4f1ec",
        borderBottom: "1px solid rgba(26,26,26,0.16)",
        boxShadow: elevated && visible ? "0 6px 24px -10px rgba(0,0,0,0.18)" : "none",
      }}
    >
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-12 h-14 flex items-center justify-between gap-2 sm:gap-4">
        <a
          href="/"
          onClick={handleHome}
          className="mono uppercase tracking-[0.15em] muted hover:text-[#1a1a1a] transition-colors flex items-center gap-2 sm:gap-2.5 shrink-0 text-[13px] sm:text-[16px]"
        >
          <span
            aria-hidden
            className={`inline-block text-lg leading-none transition-transform duration-500 ease-out ${
              elevated ? "rotate-180" : "rotate-0"
            }`}
          >
            ↓
          </span>
          <span className="hidden sm:inline">Rushir Bhavsar</span>
          <span className="sm:hidden">Rushir</span>
        </a>
        <ul className="flex items-center gap-0.5 sm:gap-2 mono text-[12px] sm:text-[14px]">
          {SECTIONS.map((s) => {
            const isActive = active === s.id
            return (
              <li key={s.id} className="shrink-0">
                <a
                  href={`#${s.id}`}
                  onClick={(e) => handleSelect(e, s.id)}
                  aria-current={isActive ? "true" : undefined}
                  aria-label={s.label}
                  className={`group flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-sm transition-all duration-200 ${
                    isActive ? "ink" : "muted hover:text-[#1a1a1a]"
                  }`}
                  style={{
                    backgroundColor: isActive ? "rgba(31,58,95,0.10)" : "transparent",
                  }}
                >
                  {isActive && (
                    <span aria-hidden className="accent font-medium leading-none">
                      +
                    </span>
                  )}
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{s.short}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
