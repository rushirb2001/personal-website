// Inline SVG architecture diagrams, keyed by slug. Hand-drawn to match the
// site palette (cream #f4f1ec, ink #1a1a1a, accent #1f3a5f) so it reads as a
// real, bespoke artifact rather than a stock image.

const INK = "#1a1a1a"
const ACCENT = "#1f3a5f"
const SUB = "rgba(26,26,26,0.55)"
const DIM = "rgba(26,26,26,0.62)"
const TINT = "rgba(31,58,95,0.05)"

function MacePinnDiagram() {
  const tint = "rgba(31,58,95,0.05)"
  return (
    <svg
      viewBox="0 0 760 588"
      className="w-full h-auto"
      role="img"
      aria-label="MACE-PINN architecture: (x, y, t) inputs pass through a 64-dimensional random Fourier embedding into two parallel subnetworks (U-Net and V-Net), whose outputs feed a gradient-norm adaptively weighted physics-informed loss."
      fill="none"
    >
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill={INK} />
        </marker>
        <marker id="arrow-accent" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill={ACCENT} />
        </marker>
      </defs>

      <g fontFamily='"Google Sans Code", ui-monospace, monospace'>
        {/* Input */}
        <rect x="16" y="244" width="108" height="72" rx="7" stroke={INK} strokeWidth="1.5" />
        <text x="70" y="284" textAnchor="middle" fontSize="18" fill={INK}>(x, y, t)</text>
        <text x="70" y="303" textAnchor="middle" fontSize="11" fill={SUB}>inputs</text>

        {/* Fourier embedding */}
        <rect x="160" y="232" width="132" height="96" rx="7" fill={tint} stroke={ACCENT} strokeWidth="1.6" />
        <text x="226" y="272" textAnchor="middle" fontSize="16" fill={ACCENT}>Fourier</text>
        <text x="226" y="292" textAnchor="middle" fontSize="11" fill={SUB}>random features</text>
        <text x="226" y="308" textAnchor="middle" fontSize="11" fill={SUB}>64-dim</text>

        {/* U-Net */}
        <rect x="344" y="96" width="200" height="78" rx="7" stroke={INK} strokeWidth="1.5" />
        <text x="444" y="131" textAnchor="middle" fontSize="16" fill={INK}>U-Net</text>
        <text x="444" y="152" textAnchor="middle" fontSize="12.5" fill={DIM}>3 × 64 → 1   (û)</text>

        {/* V-Net */}
        <rect x="344" y="386" width="200" height="78" rx="7" stroke={INK} strokeWidth="1.5" />
        <text x="444" y="421" textAnchor="middle" fontSize="16" fill={INK}>V-Net</text>
        <text x="444" y="442" textAnchor="middle" fontSize="12.5" fill={DIM}>4 × 128 → 1   (v̂)</text>

        {/* Loss */}
        <rect x="582" y="228" width="162" height="104" rx="7" fill={tint} stroke={ACCENT} strokeWidth="1.6" />
        <text x="663" y="266" textAnchor="middle" fontSize="13.5" fill={ACCENT}>ℒ = λ_ic·ℒ_ic</text>
        <text x="663" y="286" textAnchor="middle" fontSize="13.5" fill={ACCENT}>+ λ_res·ℒ_res</text>
        <text x="663" y="306" textAnchor="middle" fontSize="13.5" fill={ACCENT}>+ λ_data·ℒ_data</text>

        {/* Flow arrows */}
        <line x1="124" y1="280" x2="156" y2="280" stroke={INK} strokeWidth="1.5" markerEnd="url(#arrow)" />
        <path d="M292 256 C 318 198, 324 150, 340 135" stroke={INK} strokeWidth="1.5" markerEnd="url(#arrow)" />
        <path d="M292 304 C 318 362, 324 410, 340 425" stroke={INK} strokeWidth="1.5" markerEnd="url(#arrow)" />
        <path d="M544 135 C 570 192, 576 236, 578 262" stroke={INK} strokeWidth="1.5" markerEnd="url(#arrow)" />
        <path d="M544 425 C 570 368, 576 324, 578 298" stroke={INK} strokeWidth="1.5" markerEnd="url(#arrow)" />

        {/* Gradient-norm adaptive weighting feedback — orthogonal loop routed
            well below the nets so it never crosses the V-Net box */}
        <path
          d="M663 332 L663 512 Q663 524 651 524 L238 524 Q226 524 226 512 L226 330"
          stroke={ACCENT}
          strokeWidth="1.4"
          strokeDasharray="5 5"
          markerEnd="url(#arrow-accent)"
        />
        <text x="444" y="556" textAnchor="middle" fontSize="11.5" fill={ACCENT}>
          gradient-norm adaptive λ  (EMA of ‖∇‖)
        </text>
      </g>
    </svg>
  )
}

// ── Shared diagram primitives ───────────────────────────────────────────────

function DiagramDefs() {
  return (
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill={INK} />
      </marker>
      <marker id="arrow-accent" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill={ACCENT} />
      </marker>
    </defs>
  )
}

function Frame({ vb, label, children }: { vb: string; label: string; children: React.ReactNode }) {
  return (
    <svg viewBox={vb} className="w-full h-auto" role="img" aria-label={label} fill="none">
      <DiagramDefs />
      <g fontFamily='"Google Sans Code", ui-monospace, monospace'>{children}</g>
    </svg>
  )
}

function Node({
  x,
  y,
  w,
  h,
  title,
  sub,
  accent = false,
}: {
  x: number
  y: number
  w: number
  h: number
  title: string
  sub?: string | string[]
  accent?: boolean
}) {
  const subs = sub == null ? [] : Array.isArray(sub) ? sub : [sub]
  const cx = x + w / 2
  const titleY = y + h / 2 + 5 - subs.length * 7
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="7"
        fill={accent ? TINT : "none"}
        stroke={accent ? ACCENT : INK}
        strokeWidth={accent ? 1.6 : 1.5}
      />
      <text x={cx} y={titleY} textAnchor="middle" fontSize="13.5" fill={accent ? ACCENT : INK}>
        {title}
      </text>
      {subs.map((s, i) => (
        <text key={i} x={cx} y={titleY + 16 + i * 13.5} textAnchor="middle" fontSize="9.5" fill={SUB}>
          {s}
        </text>
      ))}
    </g>
  )
}

function Arrow({ d, accent = false, dashed = false }: { d: string; accent?: boolean; dashed?: boolean }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={accent ? ACCENT : INK}
      strokeWidth="1.4"
      strokeDasharray={dashed ? "4 4" : undefined}
      markerEnd={dashed ? undefined : `url(#${accent ? "arrow-accent" : "arrow"})`}
    />
  )
}

// ── Per-project diagrams ────────────────────────────────────────────────────

function SamhitaDiagram() {
  return (
    <Frame
      vb="0 0 760 524"
      label="Samhita pipeline: textbook PDFs are parsed and recovered, then built into a knowledge graph, BioLORD embeddings, and a taxonomy, content-hashed into a versioned export published to Cloudflare R2."
    >
      <Node x={290} y={16} w={180} h={58} title="Textbook PDFs" sub="3 books, 220 chapters" />
      <Arrow d="M380 74 L380 104" />
      <Node x={285} y={106} w={190} h={62} title="Parse + recovery" sub={["Adobe JSON", "6-phase pipeline"]} accent />
      <Arrow d="M345 168 C 250 196, 160 202, 132 226" />
      <Arrow d="M380 168 L380 226" />
      <Arrow d="M415 168 C 510 196, 600 202, 628 226" />
      <Node x={30} y={228} w={200} h={64} title="Knowledge graph" sub="71,621 nodes" />
      <Node x={280} y={228} w={200} h={64} title="BioLORD embeddings" sub="52,871 vectors" />
      <Node x={530} y={228} w={200} h={64} title="Taxonomy" sub="17 domains" />
      <Arrow d="M130 292 C 158 322, 250 332, 332 356" />
      <Arrow d="M380 292 L380 356" />
      <Arrow d="M630 292 C 602 322, 510 332, 428 356" />
      <Node x={285} y={356} w={190} h={62} title="Versioned export" sub="SHA-256 content hash" accent />
      <Arrow d="M380 418 L380 446" accent />
      <Node x={300} y={446} w={160} h={56} title="Cloudflare R2" />
    </Frame>
  )
}

function HybridFlowDiagram() {
  return (
    <Frame
      vb="0 0 760 560"
      label="HybridFlow retrieval: a query is planned by Claude Haiku, retrieved in parallel from Qdrant vector search and a Neo4j graph, scored by Haiku, then generated by Claude Sonnet and streamed back as a cited answer."
    >
      <Node x={300} y={14} w={160} h={52} title="Query" sub="clinical question" />
      <Arrow d="M380 66 L380 92" />
      <Node x={280} y={94} w={200} h={58} title="Claude Haiku" sub="plan + select chapters" accent />
      <Arrow d="M345 152 C 270 176, 200 184, 180 198" />
      <Arrow d="M415 152 C 490 176, 560 184, 580 198" />
      <Node x={80} y={200} w={200} h={62} title="Qdrant" sub="vector search" />
      <Node x={480} y={200} w={200} h={62} title="Neo4j" sub="knowledge graph" />
      <Arrow d="M180 262 C 200 288, 300 300, 332 312" />
      <Arrow d="M580 262 C 560 288, 460 300, 428 312" />
      <Node x={280} y={312} w={200} h={58} title="Claude Haiku" sub="score figures + tables" accent />
      <Arrow d="M380 370 L380 396" />
      <Node x={280} y={398} w={200} h={58} title="Claude Sonnet" sub="generate answer" accent />
      <Arrow d="M380 456 L380 482" accent />
      <Node x={265} y={484} w={230} h={60} title="Cited answer" sub="SSE: text, citations, figures" />
    </Frame>
  )
}

function SushrutalgsBffDiagram() {
  return (
    <Frame
      vb="0 0 760 420"
      label="SushrutaLGS BFF: the web and iOS clients call one Cloudflare Worker gateway that verifies the Supabase JWT, debits a daily quota, and forwards to the AI backend."
    >
      <Node x={170} y={24} w={170} h={58} title="Web app" sub="Next.js" />
      <Node x={420} y={24} w={170} h={58} title="iOS app" sub="SwiftUI" />
      <Arrow d="M255 82 C 290 122, 340 134, 366 166" />
      <Arrow d="M505 82 C 470 122, 420 134, 394 166" />
      <Node
        x={258}
        y={168}
        w={244}
        h={88}
        title="BFF · Cloudflare Worker"
        sub={["verify Supabase JWT", "atomic daily quota", "forward to backend"]}
        accent
      />
      <Node x={560} y={188} w={170} h={56} title="Supabase" sub="auth + quota RPC" />
      <Arrow d="M502 212 L556 212" dashed />
      <Arrow d="M380 256 L380 314" accent />
      <Node x={275} y={316} w={210} h={62} title="AI backend" sub="HybridFlow (FastAPI)" />
    </Frame>
  )
}

function SushrutalgsWebDiagram() {
  return (
    <Frame
      vb="0 0 760 432"
      label="SushrutaLGS web app: a Next.js client owns the chat tree and SSE streaming, backed by Supabase for auth and Postgres and Cloudflare R2 for figures and tables, calling the BFF which forwards to the AI backend."
    >
      <Node x={290} y={18} w={180} h={54} title="Browser" />
      <Arrow d="M380 72 L380 100" />
      <Node x={262} y={102} w={236} h={74} title="Next.js app" sub={["chat tree, SSE client", "auth + onboarding"]} accent />
      <Node x={20} y={116} w={170} h={56} title="Cloudflare R2" sub="figures + tables" />
      <Node x={570} y={116} w={170} h={56} title="Supabase" sub="auth + Postgres" />
      <Arrow d="M262 146 L194 145" dashed />
      <Arrow d="M498 146 L566 145" dashed />
      <Arrow d="M380 176 L380 232" />
      <Node x={280} y={234} w={200} h={56} title="BFF" sub="Cloudflare Worker" />
      <Arrow d="M380 290 L380 330" />
      <Node x={275} y={332} w={210} h={60} title="AI backend" sub="HybridFlow" />
    </Frame>
  )
}

function SushrutalgsIosDiagram() {
  return (
    <Frame
      vb="0 0 760 432"
      label="SushrutaLGS iOS app: a SwiftUI client with observable services and SSE streaming chat, using Supabase Realtime for cross-device handoff, calling the BFF which forwards to the AI backend."
    >
      <Node x={285} y={18} w={190} h={54} title="iPhone / iPad" />
      <Arrow d="M380 72 L380 100" />
      <Node x={262} y={102} w={236} h={74} title="SwiftUI app" sub={["@Observable services", "SSE chat, Router"]} accent />
      <Node x={548} y={116} w={192} h={56} title="Supabase Realtime" sub="cross-device handoff" />
      <Arrow d="M498 146 L544 145" dashed />
      <Arrow d="M380 176 L380 232" />
      <Node x={280} y={234} w={200} h={56} title="BFF" sub="Cloudflare Worker" />
      <Arrow d="M380 290 L380 330" />
      <Node x={275} y={332} w={210} h={60} title="AI backend" sub="HybridFlow" />
    </Frame>
  )
}

function YelpDiagram() {
  return (
    <Frame
      vb="0 0 760 420"
      label="Yelp ML platform: the 7M-review dataset is processed by a Spark ETL into Parquet, training an ALS recommender and a sentiment classifier tracked with MLflow, served through one FastAPI service."
    >
      <Node x={290} y={14} w={180} h={56} title="Yelp dataset" sub="7M reviews" />
      <Arrow d="M380 70 L380 96" />
      <Node x={285} y={98} w={190} h={56} title="Spark ETL" sub="JSON to Parquet" accent />
      <Node x={560} y={110} w={160} h={52} title="MLflow" sub="tracking" />
      <Arrow d="M475 134 L556 134" dashed />
      <Arrow d="M345 154 C 270 178, 200 188, 180 200" />
      <Arrow d="M415 154 C 490 178, 560 188, 580 200" />
      <Node x={80} y={202} w={200} h={62} title="ALS recommender" sub="Recall@10 5.5%" />
      <Node x={480} y={202} w={200} h={62} title="Sentiment classifier" sub="86.3% accuracy" />
      <Arrow d="M180 264 C 200 290, 300 302, 332 314" />
      <Arrow d="M580 264 C 560 290, 460 302, 428 314" />
      <Node x={280} y={314} w={200} h={58} title="FastAPI service" sub="REST + NumPy serving" accent />
    </Frame>
  )
}

const DIAGRAMS: Record<string, () => React.JSX.Element> = {
  "mace-pinn": MacePinnDiagram,
  samhita: SamhitaDiagram,
  hybridflow: HybridFlowDiagram,
  "sushrutalgs-bff": SushrutalgsBffDiagram,
  "sushrutalgs-web": SushrutalgsWebDiagram,
  "sushrutalgs-ios": SushrutalgsIosDiagram,
  "yelp-ml-platform": YelpDiagram,
}

export function ArchitectureDiagram({ slug }: { slug: string }) {
  const Diagram = DIAGRAMS[slug]
  if (!Diagram) return null
  return <Diagram />
}

export function hasBuiltinDiagram(slug: string): boolean {
  return slug in DIAGRAMS
}
