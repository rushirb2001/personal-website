import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Page not found",
  // A 404 should never be indexed, and Next does not add this on its own.
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    // Previously styled with `font-sf-mono`, which is not defined anywhere in
    // globals.css, so this page rendered in the browser default sans and looked
    // like a different site. Uses the editorial tokens like everything else now.
    <main
      className="min-h-[100svh] flex items-center justify-center px-6"
      style={{ backgroundColor: "#f4f1ec", color: "#1a1a1a" }}
    >
      <style>{`
        .nf-mono { font-family: "Google Sans Code", ui-monospace, "SFMono-Regular", "Menlo", monospace; }
        .nf-display { font-family: "Google Sans", ui-sans-serif, system-ui, sans-serif; }
        .nf-link { position: relative; color: #1f3a5f; transition: color 200ms ease; }
        .nf-link::after {
          content: ""; position: absolute; left: 0; right: 0; bottom: -2px; height: 1px;
          background-color: #1f3a5f; transform-origin: left; transform: scaleX(0.35);
          transition: transform 250ms ease;
        }
        @media (hover: hover) { .nf-link:hover::after { transform: scaleX(1); } }
      `}</style>

      <div className="max-w-[42ch] w-full">
        <p
          className="nf-mono uppercase mb-4"
          style={{ letterSpacing: "0.18em", fontSize: 10, color: "#1f3a5f" }}
        >
          404
        </p>
        <h1 className="nf-display font-light tracking-tight leading-[1.15] text-[26px] xs:text-[32px]">
          This page does not exist<span style={{ color: "#1f3a5f" }}>.</span>
        </h1>
        <p
          className="nf-mono mt-4 leading-relaxed text-[13px]"
          style={{ color: "rgba(26,26,26,0.62)" }}
        >
          Nothing here. Probably never was.
        </p>

        <ul className="nf-mono mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[13px]">
          <li>
            <Link href="/" className="nf-link">
              the portfolio
            </Link>
          </li>
          <li>
            <Link href="/writing" className="nf-link">
              writing
            </Link>
          </li>
          <li>
            <Link href="/playbook" className="nf-link">
              the playbook
            </Link>
          </li>
        </ul>
      </div>
    </main>
  )
}
