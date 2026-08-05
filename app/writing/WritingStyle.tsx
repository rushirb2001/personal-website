// Design tokens for /writing, injected per the repo's established pattern (see
// the <style> block in app/HomePage.tsx and TOKENS in ProjectModal).
//
// The token block below is the same one PlaybookStyle ships, verbatim, so the
// two routes cannot drift. Everything after the divider is the only genuinely
// new thing here: a prose scale, because no other route runs long-form body
// copy. That scale is built out of the site's existing idioms rather than a
// generic article stylesheet: paragraphs use the playbook's argument-paragraph
// treatment, lists use its .proof-list marker, and subheads open with the
// hairline accent rule the landing page uses for education highlights.
export function WritingStyle() {
  return (
    <style>{`
      /* scroll-padding-top clears the sticky section heads when a link or the
         keyboard jumps into the middle of an article. */
      html { scrollbar-gutter: stable; scroll-padding-top: 64px; }
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

      .grain {
        background-image: radial-gradient(rgba(26,26,26,0.055) 1px, transparent 1px);
        background-size: 22px 22px;
      }

      /* Cross-link out of the cluster, same chip as the landing page's footer
         (see .footer-cta in app/HomePage.tsx) so the one commercial link on the
         site looks identical wherever it appears. A tinted outline rather than
         a filled pill: the site keeps exactly one filled control, .cta-buy on
         /playbook itself. */
      .footer-cta {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 4px 10px; border-radius: 6px;
        color: #1f3a5f;
        background-color: rgba(31,58,95,0.07);
        border: 1px solid rgba(31,58,95,0.28);
        text-transform: uppercase; letter-spacing: 0.12em; font-size: 11px;
        white-space: nowrap;
        transition: background-color 200ms ease, border-color 200ms ease;
      }
      @media (hover: hover) {
        .footer-cta:hover {
          background-color: rgba(31,58,95,0.13);
          border-color: rgba(31,58,95,0.5);
        }
      }

      /* ---- Prose ------------------------------------------------------ */

      /* Paragraphs are the playbook's argument-paragraph treatment: display
         font at 16/18px on a 70ch measure, not a 1.7-leaded blog column. */
      .prose > * + * { margin-top: 1.15em; }
      .prose p {
        font-family: "Google Sans", ui-sans-serif, system-ui, sans-serif;
        font-weight: 300;
        font-size: 16px;
        line-height: 1.62;
        color: #1a1a1a;
        max-width: 70ch;
      }
      @media (min-width: 475px) { .prose p { font-size: 18px; } }

      /* Subheads open with the short accent rule the landing page uses to mark
         education highlights, so they read as the same vocabulary as a section
         head one level up rather than as bold text. */
      .prose h3 {
        font-family: "Google Sans", ui-sans-serif, system-ui, sans-serif;
        font-weight: 500;
        font-size: 17px;
        letter-spacing: -0.01em;
        line-height: 1.35;
        margin-top: 2.1em;
      }
      @media (min-width: 475px) { .prose h3 { font-size: 18px; } }
      .prose h3::before {
        content: ""; display: block; width: 28px; height: 1px;
        background-color: #1f3a5f; margin-bottom: 11px;
      }

      /* Lists are .proof-list: a navy hairline marker, a display term, and a
         mono note under it. A leading <strong> is promoted to the term line,
         which keeps the posts written as ordinary markup. */
      .prose ul, .prose ol { list-style: none; margin: 22px 0 0; padding: 0; }
      .prose li {
        position: relative;
        padding-left: 18px;
        font-family: "Google Sans Code", ui-monospace, "SFMono-Regular", "Menlo", monospace;
        font-variation-settings: "MONO" 1;
        font-size: 14px;
        line-height: 1.62;
        color: #1a1a1a;
        max-width: 68ch;
      }
      @media (min-width: 475px) { .prose li { font-size: 15px; } }
      .prose li + li { margin-top: 14px; }
      .prose ul > li::before {
        content: ""; position: absolute; left: 0; top: 0.72em; width: 9px;
        border-top: 1px solid #1f3a5f;
      }
      .prose ol { counter-reset: prose-ol; }
      .prose ol > li { counter-increment: prose-ol; }
      .prose ol > li::before {
        content: counter(prose-ol);
        position: absolute; left: 0; top: 0.1em;
        font-family: "Google Sans Code", ui-monospace, monospace;
        font-size: 0.78em; color: #1f3a5f;
      }
      .prose li > strong:first-child {
        display: block;
        font-family: "Google Sans", ui-sans-serif, system-ui, sans-serif;
        font-size: 15px;
        font-weight: 500;
        letter-spacing: -0.01em;
        margin-bottom: 3px;
      }

      .prose strong { font-weight: 700; }
      .prose em { font-style: italic; }
      .prose a { color: #1f3a5f; }
      .prose code {
        font-family: "Google Sans Code", ui-monospace, monospace;
        font-size: 0.88em;
        background: rgba(31,58,95,0.06);
        padding: 0.1em 0.34em;
        border-radius: 3px;
      }

      /* The one pulled-out claim per section. Same left accent bar as the
         playbook's emphasis blocks. */
      .prose .callout {
        border-left: 2px solid #1f3a5f;
        padding: 0.1rem 0 0.1rem 1.1rem;
        font-size: 18px;
        line-height: 1.5;
        max-width: 62ch;
      }
      @media (min-width: 475px) { .prose .callout { font-size: 20px; } }

      /* Terminal block, matched to the playbook's .repo-tree window. */
      .prose .snippet {
        max-width: 620px; border-radius: 8px; overflow: hidden;
        border: 1px solid rgba(26,26,26,0.12); background: #fff;
        box-shadow: 0 8px 24px -12px rgba(26,26,26,0.18);
      }
      .prose .snippet pre {
        margin: 0; padding: 16px 18px;
        font-family: "Google Sans Code", ui-monospace, monospace;
        font-size: 12.5px; line-height: 1.75;
        color: rgba(26,26,26,0.82);
        overflow-x: auto;
      }

      /* Figures. The SVG carries its own viewBox, so w-full h-auto gives it an
         intrinsic aspect ratio and nothing reflows as the page settles. The
         figure breaks the 70ch prose measure because a diagram needs the width;
         the caption stays on the text scale. */
      .prose .fig { margin: 26px 0 0; }
      /* Below ~640px the 720-unit viewBox would scale the diagram's 11px
         lettering down to about 6px. Rather than shrink it into illegibility,
         the figure scrolls sideways inside its own wrapper, the same treatment
         the playbook gives its wide pricing table. The min-width is the point
         where the smallest label still reads at ~10px. */
      .prose .fig .fig-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
      .prose .fig svg { display: block; min-width: 600px; }
      @media (min-width: 700px) { .prose .fig svg { min-width: 0; } }
      .prose .fig .fig-hint { display: block; margin-top: 7px; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(26,26,26,0.62); }
      @media (min-width: 700px) { .prose .fig .fig-hint { display: none; } }
      .prose .fig figcaption {
        margin-top: 10px; padding-top: 9px;
        border-top: 1px solid rgba(26,26,26,0.12);
        font-size: 11.5px; line-height: 1.55;
        color: rgba(26,26,26,0.62);
        max-width: 64ch;
      }

      /* Closing card into /playbook. Reads as a card, never as a paragraph. */
      .next-step {
        border: 1px solid rgba(26,26,26,0.12);
        border-radius: 10px;
        padding: 20px 22px;
        background: rgba(31,58,95,0.04);
        max-width: 70ch;
      }
    `}</style>
  )
}
