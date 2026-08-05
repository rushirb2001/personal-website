import type { ReactNode } from "react"

// Hand-drawn inline SVG figures for the posts, following the same convention as
// app/projects/ArchitectureDiagram.tsx: site palette, mono lettering, drawn
// rather than sourced.
//
// Inline and vector on purpose, for three reasons that all matter here:
//   - zero extra requests, so a figure can never become the LCP element or
//     compete with the fonts for bandwidth;
//   - viewBox + w-full h-auto gives an intrinsic aspect ratio, so nothing
//     reflows as the page settles (no CLS);
//   - role="img" + a full aria-label means the figure carries a text
//     equivalent, which is what a crawler and a screen reader both read.
// A stock raster would fail all three and add nothing a reader can use.

const INK = "#1a1a1a"
const ACCENT = "#1f3a5f"
const SUB = "rgba(26,26,26,0.55)"
const DIM = "rgba(26,26,26,0.62)"
const TINT = "rgba(31,58,95,0.06)"
const RULE = "rgba(26,26,26,0.14)"
const MONO = '"Google Sans Code", ui-monospace, monospace'

// Wrapper: the figure sits outside the prose measure (it needs the width) but
// keeps the caption on the text's scale.
export function Figure({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <figure className="fig">
      {/* Phones scroll the diagram sideways rather than shrinking its lettering
          past legibility; see .fig in WritingStyle. tabIndex makes the scroll
          region keyboard-reachable, which a scrollable box otherwise is not. */}
      <div className="fig-scroll" tabIndex={0} role="group" aria-label="Diagram, scrolls horizontally">
        {children}
      </div>
      <span aria-hidden className="fig-hint mono">
        scroll &rarr;
      </span>
      <figcaption className="mono">{caption}</figcaption>
    </figure>
  )
}

/* --- Post: ai-engineer-portfolio-projects ------------------------------- */

// The breadth-vs-depth argument, drawn: same total effort, but only the tall
// bars clear the line where a project becomes defensible in an interview.
export function DepthVsBreadth() {
  const thin = [0, 1, 2, 3, 4, 5, 6, 7]
  const thick = [0, 1, 2]
  return (
    <svg
      viewBox="0 0 720 250"
      className="w-full h-auto"
      role="img"
      aria-label="Two portfolios with the same total effort. On the left, eight projects of roughly one week each, none of them reaching the line marked 'defensible for ten minutes'. On the right, three projects of six to eight weeks each, all three well above that line."
      fill="none"
    >
      <g fontFamily={MONO}>
        {/* left panel */}
        <text x="8" y="20" fontSize="11" fill={DIM}>
          8 projects &middot; ~1 week each
        </text>
        {thin.map((i) => (
          <rect
            key={i}
            x={8 + i * 38}
            y={170}
            width="24"
            height="36"
            rx="3"
            fill="rgba(26,26,26,0.10)"
            stroke={RULE}
          />
        ))}
        <line x1="8" y1="206" x2="320" y2="206" stroke={RULE} strokeWidth="1" />

        {/* the bar the whole argument turns on */}
        <line x1="8" y1="120" x2="320" y2="120" stroke={ACCENT} strokeWidth="1" strokeDasharray="3 3" />
        <text x="8" y="112" fontSize="11" fill={ACCENT}>
          defensible for ten minutes
        </text>
        <text x="8" y="228" fontSize="11" fill={SUB}>
          nothing clears it
        </text>

        {/* divider */}
        <line x1="360" y1="8" x2="360" y2="240" stroke={RULE} strokeWidth="1" />

        {/* right panel */}
        <text x="400" y="20" fontSize="11" fill={DIM}>
          3 projects &middot; 6-8 weeks each
        </text>
        {thick.map((i) => (
          <rect
            key={i}
            x={400 + i * 96}
            y={62}
            width="64"
            height="144"
            rx="4"
            // Heavier than the shared TINT: the whole figure is a comparison,
            // so the two sets have to separate at a glance, not on inspection.
            fill="rgba(31,58,95,0.13)"
            stroke={ACCENT}
            strokeWidth="1.4"
          />
        ))}
        <line x1="400" y1="206" x2="712" y2="206" stroke={RULE} strokeWidth="1" />
        <line
          x1="400"
          y1="120"
          x2="712"
          y2="120"
          stroke={ACCENT}
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <text x="400" y="228" fontSize="11" fill={ACCENT}>
          all three clear it
        </text>
      </g>
    </svg>
  )
}

// Role to project mapping: the same table the post argues in prose, but
// scannable in one pass.
const ROLE_ROWS = [
  { role: "FDE", screen: "works in a customer's mess", a: "approval-gated agent", b: "data integration service" },
  { role: "AI/ML", screen: "knows whether it works", a: "retrieval + eval harness", b: "drift-monitored retraining" },
  { role: "Data", screen: "correct at volume", a: "streaming pipeline", b: "tested warehouse + API" },
]

export function RoleMap() {
  return (
    <svg
      viewBox="0 0 720 236"
      className="w-full h-auto"
      role="img"
      aria-label="Three roles and the projects that signal for each. Forward-Deployed Engineer is screened for working inside a customer's constraints, matched to an approval-gated agent and a customer data integration service. AI/ML Engineer is screened for knowing whether the system works, matched to a retrieval system with an eval harness and a drift-monitored retraining pipeline. Data Engineer is screened for correctness at volume, matched to a streaming pipeline and a tested warehouse model with an API."
      fill="none"
    >
      <g fontFamily={MONO}>
        <text x="8" y="18" fontSize="10" fill={SUB} letterSpacing="1.6">
          ROLE
        </text>
        <text x="132" y="18" fontSize="10" fill={SUB} letterSpacing="1.6">
          SCREENED FOR
        </text>
        <text x="378" y="18" fontSize="10" fill={SUB} letterSpacing="1.6">
          PROJECTS THAT PROVE IT
        </text>
        <line x1="8" y1="30" x2="712" y2="30" stroke={RULE} />

        {ROLE_ROWS.map((r, i) => {
          const y = 52 + i * 62
          return (
            <g key={r.role}>
              <text x="8" y={y + 16} fontSize="14" fill={ACCENT}>
                {r.role}
              </text>
              <text x="132" y={y + 16} fontSize="12" fill={DIM}>
                {r.screen}
              </text>
              <rect x="378" y={y} width="156" height="26" rx="13" fill={TINT} stroke={ACCENT} strokeWidth="1" />
              <text x="456" y={y + 17} fontSize="11" fill={ACCENT} textAnchor="middle">
                {r.a}
              </text>
              <rect x="546" y={y} width="166" height="26" rx="13" fill={TINT} stroke={ACCENT} strokeWidth="1" />
              <text x="629" y={y + 17} fontSize="11" fill={ACCENT} textAnchor="middle">
                {r.b}
              </text>
              {i !== ROLE_ROWS.length - 1 && (
                <line x1="8" y1={y + 44} x2="712" y2={y + 44} stroke={RULE} />
              )}
            </g>
          )
        })}
      </g>
    </svg>
  )
}

/* --- Post: rag-eval-harness-interview ----------------------------------- */

// The point of the post in one picture: the pipeline everyone builds, and the
// two measurement taps almost nobody adds.
export function EvalHarness() {
  const box = (x: number, y: number, w: number, label: string, accent = false) => (
    <g key={label}>
      <rect
        x={x}
        y={y}
        width={w}
        height="42"
        rx="6"
        fill={accent ? TINT : "none"}
        stroke={accent ? ACCENT : INK}
        strokeWidth={accent ? 1.4 : 1.2}
      />
      <text
        x={x + w / 2}
        y={y + 26}
        fontSize="12"
        fill={accent ? ACCENT : INK}
        textAnchor="middle"
      >
        {label}
      </text>
    </g>
  )

  return (
    <svg
      viewBox="0 0 720 290"
      className="w-full h-auto"
      role="img"
      aria-label="A RAG pipeline with its evaluation taps. A query flows through retrieve, then rerank, then generate, to an answer. Retrieval is tapped for recall at k and MRR; generation is tapped for faithfulness, scored by a validated LLM judge. Both measurements feed a CI regression gate that fails the build when recall at 5 drops more than the threshold. The pipeline alone is what most candidates build; the two taps and the gate are what make it defensible."
      fill="none"
    >
      <defs>
        <marker id="w-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill={INK} />
        </marker>
        <marker id="w-arrow-accent" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill={ACCENT} />
        </marker>
      </defs>

      <g fontFamily={MONO}>
        <text x="8" y="18" fontSize="10" fill={SUB} letterSpacing="1.6">
          THE PART EVERYONE BUILDS
        </text>

        {box(8, 34, 96, "query")}
        {box(140, 34, 110, "retrieve")}
        {box(286, 34, 110, "rerank")}
        {box(432, 34, 118, "generate")}
        {box(586, 34, 126, "answer")}

        {[104, 250, 396, 550].map((x) => (
          <line key={x} x1={x} y1="55" x2={x + 30} y2="55" stroke={INK} strokeWidth="1.2" markerEnd="url(#w-arrow)" />
        ))}

        {/* taps */}
        <line x1="195" y1="76" x2="195" y2="126" stroke={ACCENT} strokeWidth="1.2" strokeDasharray="3 3" markerEnd="url(#w-arrow-accent)" />
        <line x1="491" y1="76" x2="491" y2="126" stroke={ACCENT} strokeWidth="1.2" strokeDasharray="3 3" markerEnd="url(#w-arrow-accent)" />

        <rect x="110" y="128" width="172" height="56" rx="6" fill={TINT} stroke={ACCENT} strokeWidth="1.4" />
        <text x="196" y="150" fontSize="12" fill={ACCENT} textAnchor="middle">
          recall@k &middot; MRR
        </text>
        <text x="196" y="168" fontSize="10.5" fill={SUB} textAnchor="middle">
          labelled question set
        </text>

        <rect x="406" y="128" width="172" height="56" rx="6" fill={TINT} stroke={ACCENT} strokeWidth="1.4" />
        <text x="492" y="150" fontSize="12" fill={ACCENT} textAnchor="middle">
          faithfulness
        </text>
        <text x="492" y="168" fontSize="10.5" fill={SUB} textAnchor="middle">
          judge, agreement reported
        </text>

        <line x1="196" y1="184" x2="196" y2="228" stroke={ACCENT} strokeWidth="1.2" markerEnd="url(#w-arrow-accent)" />
        <line x1="492" y1="184" x2="492" y2="228" stroke={ACCENT} strokeWidth="1.2" markerEnd="url(#w-arrow-accent)" />

        <rect x="110" y="230" width="468" height="46" rx="6" fill={TINT} stroke={ACCENT} strokeWidth="1.6" />
        <text x="344" y="250" fontSize="12" fill={ACCENT} textAnchor="middle">
          CI regression gate
        </text>
        <text x="344" y="267" fontSize="10.5" fill={SUB} textAnchor="middle">
          fails the build when recall@5 drops past the threshold
        </text>

        <text x="600" y="150" fontSize="10" fill={SUB} letterSpacing="1.6">
          THE PART
        </text>
        <text x="600" y="164" fontSize="10" fill={SUB} letterSpacing="1.6">
          THAT HIRES
        </text>
        <line x1="596" y1="132" x2="596" y2="252" stroke={ACCENT} strokeWidth="1.5" />
      </g>
    </svg>
  )
}

/* --- Post: private-repo-credible-to-recruiters -------------------------- */

const CROSSES = [
  "architecture diagram",
  "design doc + rejected options",
  "numbers, with the method",
  "demo on synthetic data",
  "case study page",
  "access note",
]
const STAYS = ["source", "customer data", "credentials", "internal metrics"]

export function NdaWall() {
  return (
    <svg
      viewBox="0 0 720 320"
      className="w-full h-auto"
      role="img"
      aria-label="What crosses the NDA line and what does not. Staying behind: source, customer data, credentials, and internal metrics. Crossing to the reader: an architecture diagram, a design document with the rejected options, numbers with the method stated, a demo on synthetic data, a case study page, and an explicit access note. The reader was never going to read the source anyway."
      fill="none"
    >
      <defs>
        <marker id="w-cross" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill={ACCENT} />
        </marker>
      </defs>
      <g fontFamily={MONO}>
        <text x="8" y="18" fontSize="10" fill={SUB} letterSpacing="1.6">
          STAYS BEHIND
        </text>
        <rect x="8" y="30" width="200" height="252" rx="8" fill="rgba(26,26,26,0.045)" stroke={RULE} />
        {STAYS.map((s, i) => (
          <text key={s} x="26" y={68 + i * 34} fontSize="12" fill={SUB}>
            {s}
          </text>
        ))}

        {/* the wall */}
        <line x1="252" y1="18" x2="252" y2="300" stroke={INK} strokeWidth="1.5" strokeDasharray="6 4" />
        <text x="252" y="312" fontSize="10" fill={DIM} textAnchor="middle">
          NDA
        </text>

        <text x="300" y="18" fontSize="10" fill={ACCENT} letterSpacing="1.6">
          CROSSES, AND PROVES IT ANYWAY
        </text>
        {CROSSES.map((c, i) => {
          const y = 34 + i * 42
          return (
            <g key={c}>
              <line x1="256" y1={y + 17} x2="292" y2={y + 17} stroke={ACCENT} strokeWidth="1.2" markerEnd="url(#w-cross)" />
              <rect x="300" y={y} width="412" height="34" rx="6" fill={TINT} stroke={ACCENT} strokeWidth="1.1" />
              <text x="318" y={y + 22} fontSize="12" fill={ACCENT}>
                {c}
              </text>
            </g>
          )
        })}
      </g>
    </svg>
  )
}

/* --- Post: ml-portfolio-free-tier-stack --------------------------------- */

const TIERS = [
  { layer: "Inference", who: "Groq · Gemini", breaks: "requests + tokens per minute" },
  { layer: "GPU", who: "Colab · T4, 16GB", breaks: "session death, ~15-30 GPU hrs/week" },
  { layer: "Database", who: "Supabase · pgvector", breaks: "storage, and pausing when idle" },
  { layer: "Always-on", who: "Oracle · 2 OCPU / 12GB", breaks: "halved June 2026, plus capacity" },
]

export function FreeTierStack() {
  return (
    <svg
      viewBox="0 0 720 268"
      className="w-full h-auto"
      role="img"
      aria-label="The four layers of a zero-cost ML stack and the limit each one hits first. Inference on Groq or Gemini breaks at requests and tokens per minute. GPU on Colab, a 16GB T4, breaks at session death and roughly 15 to 30 GPU hours a week. Database on Supabase with pgvector breaks at storage and at projects pausing when idle. The always-on server on Oracle, now 2 OCPUs and 12GB after a June 2026 halving, breaks at that reduced allowance and at regional capacity."
      fill="none"
    >
      <g fontFamily={MONO}>
        <text x="8" y="18" fontSize="10" fill={SUB} letterSpacing="1.6">
          LAYER
        </text>
        <text x="188" y="18" fontSize="10" fill={SUB} letterSpacing="1.6">
          FREE TIER
        </text>
        <text x="418" y="18" fontSize="10" fill={ACCENT} letterSpacing="1.6">
          BREAKS AT
        </text>
        <line x1="8" y1="30" x2="712" y2="30" stroke={RULE} />

        {TIERS.map((t, i) => {
          const y = 44 + i * 54
          return (
            <g key={t.layer}>
              <rect x="8" y={y} width="704" height="42" rx="6" fill={TINT} stroke={RULE} />
              <text x="26" y={y + 26} fontSize="13" fill={ACCENT}>
                {t.layer}
              </text>
              <text x="188" y={y + 26} fontSize="12" fill={INK}>
                {t.who}
              </text>
              <line x1="404" y1={y + 8} x2="404" y2={y + 34} stroke={RULE} />
              <text x="418" y={y + 26} fontSize="12" fill={DIM}>
                {t.breaks}
              </text>
            </g>
          )
        })}
      </g>
    </svg>
  )
}
