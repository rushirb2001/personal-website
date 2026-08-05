// Design tokens for /writing, injected per the repo's established pattern (see
// the <style> block in app/HomePage.tsx and TOKENS in ProjectModal). Same
// palette and same type vocabulary as the rest of the site; the only new thing
// here is a prose scale, because no other route runs long-form body copy.
export function WritingStyle() {
  return (
    <style>{`
      html { scrollbar-gutter: stable; scroll-padding-top: 72px; }
      .paper { background-color: #f4f1ec; color: #1a1a1a; }
      .ink { color: #1a1a1a; }
      .muted { color: rgba(26,26,26,0.62); }
      .faint { color: rgba(26,26,26,0.62); }
      .rule { border-color: rgba(26,26,26,0.12); }
      .accent { color: #1f3a5f; }
      .accent-line { background-color: #1f3a5f; }
      .display { font-family: "Google Sans", ui-sans-serif, system-ui, sans-serif; font-optical-sizing: auto; }
      .mono { font-family: "Google Sans Code", ui-monospace, "SFMono-Regular", "Menlo", monospace; font-variation-settings: "MONO" 1; }
      .small-caps { text-transform: uppercase; letter-spacing: 0.18em; font-size: 10px; }

      .accent-link { position: relative; transition: color 200ms ease; }
      .accent-link::after {
        content: ""; position: absolute; left: 0; right: 0; bottom: -2px; height: 1px;
        background-color: #1f3a5f; transform-origin: left; transform: scaleX(0.35);
        transition: transform 250ms ease;
      }
      @media (hover: hover) {
        .accent-link:hover { color: #1f3a5f; }
        .accent-link:hover::after { transform: scaleX(1); }
      }

      /* Dotted paper grain, matched to the landing page. */
      .grain {
        background-image: radial-gradient(rgba(26,26,26,0.055) 1px, transparent 1px);
        background-size: 22px 22px;
      }

      /* ---- Prose ------------------------------------------------------
         One measure (~68ch) for everything, so headings, paragraphs and
         lists share a left edge and the column reads as a single object. */
      .prose { max-width: 68ch; }
      .prose > * + * { margin-top: 1.15em; }

      .prose p {
        font-family: "Google Sans", ui-sans-serif, system-ui, sans-serif;
        font-weight: 300;
        font-size: 17px;
        line-height: 1.68;
        color: #1a1a1a;
      }
      @media (min-width: 475px) { .prose p { font-size: 18px; } }

      .prose h2 {
        font-family: "Google Sans", ui-sans-serif, system-ui, sans-serif;
        font-weight: 300;
        letter-spacing: -0.015em;
        line-height: 1.2;
        font-size: 24px;
        margin-top: 2.4em;
        padding-top: 1.1rem;
        border-top: 1px solid rgba(26,26,26,0.12);
      }
      @media (min-width: 475px) { .prose h2 { font-size: 28px; } }

      .prose h3 {
        font-family: "Google Sans", ui-sans-serif, system-ui, sans-serif;
        font-weight: 400;
        font-size: 18px;
        line-height: 1.3;
        margin-top: 1.9em;
      }
      @media (min-width: 475px) { .prose h3 { font-size: 19px; } }

      .prose ul, .prose ol { padding-left: 0; }
      .prose li {
        position: relative;
        padding-left: 1.35rem;
        font-family: "Google Sans", ui-sans-serif, system-ui, sans-serif;
        font-weight: 300;
        font-size: 16px;
        line-height: 1.62;
      }
      @media (min-width: 475px) { .prose li { font-size: 17px; } }
      .prose li + li { margin-top: 0.6em; }
      /* Same hairline dash the landing page uses for education highlights,
         rather than a bullet glyph that would not match anything else here. */
      .prose ul > li::before {
        content: ""; position: absolute; left: 0; top: 0.82em;
        width: 0.6rem; height: 1px; background-color: #1f3a5f;
      }
      .prose ol { counter-reset: prose-ol; }
      .prose ol > li { counter-increment: prose-ol; }
      .prose ol > li::before {
        content: counter(prose-ol) ".";
        position: absolute; left: 0; top: 0.06em;
        font-family: "Google Sans Code", ui-monospace, monospace;
        font-size: 0.78em; color: #1f3a5f;
      }

      .prose strong { font-weight: 700; }
      .prose em { font-style: italic; }
      .prose a { color: #1f3a5f; text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 1px; text-decoration-color: rgba(31,58,95,0.4); }
      @media (hover: hover) { .prose a:hover { text-decoration-color: #1f3a5f; } }

      .prose code {
        font-family: "Google Sans Code", ui-monospace, monospace;
        font-size: 0.86em;
        background: rgba(31,58,95,0.06);
        padding: 0.12em 0.36em;
        border-radius: 3px;
      }

      /* A pulled-out claim: the one thing to remember from a section. */
      .prose .callout {
        border-left: 2px solid #1f3a5f;
        padding: 0.1rem 0 0.1rem 1.1rem;
        font-family: "Google Sans", ui-sans-serif, system-ui, sans-serif;
        font-weight: 300;
        font-size: 18px;
        line-height: 1.55;
        color: #1a1a1a;
      }
      @media (min-width: 475px) { .prose .callout { font-size: 20px; } }

      /* Terminal-ish block, matching the playbook's repo-tree treatment. */
      .prose .snippet {
        border: 1px solid rgba(26,26,26,0.12);
        border-radius: 8px;
        background: #fff;
        padding: 14px 16px;
        overflow-x: auto;
      }
      .prose .snippet pre {
        margin: 0;
        font-family: "Google Sans Code", ui-monospace, monospace;
        font-size: 12.5px;
        line-height: 1.7;
        color: rgba(26,26,26,0.82);
      }

      /* Closing card that sends the reader to the playbook. Distinct from a
         paragraph so it never reads as part of the argument. */
      .next-step {
        border: 1px solid rgba(26,26,26,0.12);
        border-radius: 10px;
        padding: 20px 22px;
        background: rgba(31,58,95,0.04);
      }
    `}</style>
  )
}
