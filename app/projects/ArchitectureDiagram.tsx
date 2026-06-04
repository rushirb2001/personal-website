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
      viewBox="0 0 860 612"
      className="w-full h-auto"
      role="img"
      aria-label="MACE-PINN architecture: (x, y, t) inputs enter one jointly-trained block — a 64-dim random Fourier embedding feeds two coupled subnetworks (u-subnet and v-subnet) that learn iteratively and emit the predicted fields û and v̂. Those outputs feed a gradient-norm adaptively weighted physics-informed loss ℒ(û, v̂), whose adaptive weights feed back into the block."
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
        {/* One trainable block — Fourier + both subnets + outputs, jointly optimized */}
        <rect x="158" y="80" width="486" height="446" rx="10" fill={tint} stroke={ACCENT} strokeWidth="1.2" />
        <text x="401" y="106" textAnchor="middle" fontSize="12" fill={ACCENT}>one trainable block</text>
        <text x="401" y="121" textAnchor="middle" fontSize="9.5" fill={SUB}>Fourier + u/v subnets + outputs · jointly optimized</text>

        {/* Input */}
        <rect x="20" y="256" width="104" height="78" rx="7" stroke={INK} strokeWidth="1.5" />
        <text x="72" y="297" textAnchor="middle" fontSize="17" fill={INK}>(x, y, t)</text>
        <text x="72" y="316" textAnchor="middle" fontSize="11" fill={SUB}>inputs</text>

        {/* Fourier embedding */}
        <rect x="180" y="256" width="116" height="92" rx="7" fill={tint} stroke={ACCENT} strokeWidth="1.6" />
        <text x="238" y="296" textAnchor="middle" fontSize="16" fill={ACCENT}>Fourier</text>
        <text x="238" y="316" textAnchor="middle" fontSize="10.5" fill={SUB}>random features</text>
        <text x="238" y="331" textAnchor="middle" fontSize="10.5" fill={SUB}>64-dim</text>

        {/* u-subnet — predicts the field u (not a conv U-Net; an MLP) */}
        <rect x="336" y="130" width="180" height="76" rx="7" stroke={INK} strokeWidth="1.5" />
        <text x="426" y="165" textAnchor="middle" fontSize="15" fill={INK}>u-subnet</text>
        <text x="426" y="186" textAnchor="middle" fontSize="11.5" fill={DIM}>MLP · 3×64 → û</text>

        {/* v-subnet — predicts the field v */}
        <rect x="336" y="398" width="180" height="76" rx="7" stroke={INK} strokeWidth="1.5" />
        <text x="426" y="433" textAnchor="middle" fontSize="15" fill={INK}>v-subnet</text>
        <text x="426" y="454" textAnchor="middle" fontSize="11.5" fill={DIM}>MLP · 4×128 → v̂</text>

        {/* Output fields û, v̂ */}
        <rect x="540" y="144" width="58" height="48" rx="7" fill={tint} stroke={ACCENT} strokeWidth="1.5" />
        <text x="569" y="167" textAnchor="middle" fontSize="16" fill={ACCENT}>û</text>
        <text x="569" y="183" textAnchor="middle" fontSize="9" fill={SUB}>pred. u</text>
        <rect x="540" y="412" width="58" height="48" rx="7" fill={tint} stroke={ACCENT} strokeWidth="1.5" />
        <text x="569" y="435" textAnchor="middle" fontSize="16" fill={ACCENT}>v̂</text>
        <text x="569" y="451" textAnchor="middle" fontSize="9" fill={SUB}>pred. v</text>

        {/* Loss — explicitly a function of the predicted fields */}
        <rect x="694" y="244" width="152" height="120" rx="7" fill={tint} stroke={ACCENT} strokeWidth="1.6" />
        <text x="770" y="275" textAnchor="middle" fontSize="14" fill={ACCENT}>ℒ(û, v̂)</text>
        <text x="770" y="297" textAnchor="middle" fontSize="10.5" fill={ACCENT}>= λ_ic·ℒ_ic</text>
        <text x="770" y="313" textAnchor="middle" fontSize="10.5" fill={ACCENT}>+ λ_res·ℒ_res</text>
        <text x="770" y="329" textAnchor="middle" fontSize="10.5" fill={ACCENT}>+ λ_data·ℒ_data</text>

        {/* Flow arrows */}
        <line x1="124" y1="295" x2="176" y2="298" stroke={INK} strokeWidth="1.5" markerEnd="url(#arrow)" />
        <path d="M296 274 C 318 214, 322 180, 334 168" stroke={INK} strokeWidth="1.5" markerEnd="url(#arrow)" />
        <path d="M296 330 C 318 390, 322 424, 334 436" stroke={INK} strokeWidth="1.5" markerEnd="url(#arrow)" />
        <line x1="516" y1="168" x2="538" y2="168" stroke={INK} strokeWidth="1.5" markerEnd="url(#arrow)" />
        <line x1="516" y1="436" x2="538" y2="436" stroke={INK} strokeWidth="1.5" markerEnd="url(#arrow)" />

        {/* Iterative coupling between the two subnets (cyclic) */}
        <path d="M404 206 L404 396" stroke={ACCENT} strokeWidth="1.4" markerEnd="url(#arrow-accent)" />
        <path d="M452 396 L452 206" stroke={ACCENT} strokeWidth="1.4" markerEnd="url(#arrow-accent)" />
        <text x="487" y="298" textAnchor="middle" fontSize="10" fill={ACCENT}>iterative</text>
        <text x="487" y="311" textAnchor="middle" fontSize="10" fill={ACCENT}>coupling</text>

        {/* Outputs → loss */}
        <path d="M598 166 C 648 186, 670 244, 692 276" stroke={INK} strokeWidth="1.5" markerEnd="url(#arrow)" />
        <path d="M598 438 C 648 418, 670 360, 692 330" stroke={INK} strokeWidth="1.5" markerEnd="url(#arrow)" />

        {/* Gradient-norm adaptive λ feedback — routed below the block */}
        <path
          d="M770 364 L770 564 Q770 576 758 576 L250 576 Q238 576 238 564 L238 530"
          stroke={ACCENT}
          strokeWidth="1.4"
          strokeDasharray="5 5"
          markerEnd="url(#arrow-accent)"
        />
        <text x="430" y="596" textAnchor="middle" fontSize="11" fill={ACCENT}>
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

/** A small stage chip used inside a pipeline container. */
function PipeChip({ x, y, w, title }: { x: number; y: number; w: number; title: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={34} rx={6} fill="#faf8f4" stroke={INK} strokeWidth={1.3} />
      <text x={x + w / 2} y={y + 22} textAnchor="middle" fontSize="12" fill={INK}>
        {title}
      </text>
    </g>
  )
}

// ── Per-project diagrams ────────────────────────────────────────────────────

function SamhitaDiagram() {
  const tint = TINT
  const cardStroke = "rgba(26,26,26,0.4)"
  return (
    <Frame
      vb="0 0 1140 400"
      label="Samhita data backbone: any textbook PDFs with metadata are ingested in parallel into a hybrid (parallel + sequential) extraction pipeline — parse, recover, structure, clean, enhance, annotate — smarter than static parsing. It builds a taxonomy-structured knowledge graph and dense embeddings, bundled into an immutable SHA-256 content-hashed versioned export that publishes primarily to Cloudflare R2 and feeds live retrieval and client apps."
    >
      {/* Parallel, textbook-agnostic ingest — stacked cards = any book, fed in parallel */}
      <rect x={42} y={170} width={142} height={66} rx={7} fill="#f4f1ec" stroke={cardStroke} strokeWidth={1.2} />
      <rect x={33} y={179} width={142} height={66} rx={7} fill="#f4f1ec" stroke={cardStroke} strokeWidth={1.3} />
      <rect x={24} y={188} width={142} height={66} rx={7} fill="#f4f1ec" stroke={INK} strokeWidth={1.5} />
      <text x={95} y={216} textAnchor="middle" fontSize="13" fill={INK}>Textbook PDFs</text>
      <text x={95} y={234} textAnchor="middle" fontSize="9.5" fill={SUB}>any book · + metadata</text>
      <text x={95} y={274} textAnchor="middle" fontSize="9.5" fill={ACCENT}>∥ parallel ingest</text>
      <path d="M166 221 L208 221" stroke={INK} strokeWidth="1.5" markerEnd="url(#arrow)" />

      {/* Hybrid pipeline — sequential spine + parallel enrichment, not static parsing */}
      <rect x={210} y={118} width={304} height={200} rx={10} fill={tint} stroke={ACCENT} strokeWidth={1.2} />
      <text x={362} y={146} textAnchor="middle" fontSize="13" fill={ACCENT}>Hybrid pipeline</text>
      <text x={362} y={163} textAnchor="middle" fontSize="9.5" fill={SUB}>parallel + sequential · adaptive, not static</text>

      {/* sequential spine */}
      <PipeChip x={226} y={184} w={86} title="Parse" />
      <PipeChip x={320} y={184} w={86} title="Recover" />
      <PipeChip x={414} y={184} w={86} title="Structure" />
      <path d="M312 201 L319 201" stroke={ACCENT} strokeWidth="1.3" markerEnd="url(#arrow-accent)" />
      <path d="M406 201 L413 201" stroke={ACCENT} strokeWidth="1.3" markerEnd="url(#arrow-accent)" />

      {/* into parallel enrichment */}
      <path d="M457 218 C 457 236, 400 244, 366 250" stroke={ACCENT} strokeWidth="1.3" markerEnd="url(#arrow-accent)" />
      <PipeChip x={226} y={252} w={86} title="Clean" />
      <PipeChip x={320} y={252} w={86} title="Enhance" />
      <PipeChip x={414} y={252} w={86} title="Annotate" />
      <text x={313} y={273} textAnchor="middle" fontSize="11" fill={SUB}>∥</text>
      <text x={407} y={273} textAnchor="middle" fontSize="11" fill={SUB}>∥</text>

      {/* pipeline → outputs */}
      <path d="M514 210 C 540 190, 552 174, 574 164" stroke={INK} strokeWidth="1.5" markerEnd="url(#arrow)" />
      <path d="M514 268 C 540 280, 552 286, 574 270" stroke={INK} strokeWidth="1.5" markerEnd="url(#arrow)" />

      {/* Taxonomy plugs into the knowledge graph — not a separate artifact */}
      <Node x={608} y={60} w={128} h={44} title="Taxonomy" sub="17 domains" />
      <path d="M672 104 L672 124" stroke={INK} strokeWidth="1.4" markerEnd="url(#arrow)" />
      <text x={684} y={119} textAnchor="start" fontSize="9" fill={SUB}>plugs in</text>

      {/* Outputs */}
      <Node x={576} y={126} w={192} h={76} title="Knowledge graph" sub="71,621 nodes" />
      <Node x={576} y={236} w={192} h={68} title="Dense embeddings" sub="52,871 vectors" />

      {/* Bundle → export */}
      <path d="M768 162 C 786 172, 794 180, 806 190" stroke={INK} strokeWidth="1.4" markerEnd="url(#arrow)" />
      <path d="M768 268 C 786 250, 794 216, 806 200" stroke={INK} strokeWidth="1.4" markerEnd="url(#arrow)" />

      {/* Immutable export — dotted group: bundle + separate SHA-256 versioning module */}
      <rect x={794} y={148} width={176} height={162} rx={10} fill="none" stroke={ACCENT} strokeWidth={1.3} strokeDasharray="3 4" />
      <text x={882} y={142} textAnchor="middle" fontSize="10" fill={ACCENT}>immutable export</text>
      <Node x={810} y={164} w={144} h={56} title="Versioned export" sub="bundle manifest" accent />
      <path d="M882 220 L882 232" stroke={INK} strokeWidth="1.4" markerEnd="url(#arrow)" />
      <Node x={810} y={234} w={144} h={58} title="SHA-256" sub="content-hash" />

      {/* Fan-out — Cloudflare R2 primary (solid), downstream consumers dashed */}
      <path d="M970 196 C 986 178, 992 174, 998 172" stroke={ACCENT} strokeWidth="1.5" markerEnd="url(#arrow-accent)" />
      <path d="M970 228 L996 250" stroke={ACCENT} strokeWidth="1.3" strokeDasharray="4 4" markerEnd="url(#arrow-accent)" />
      <path d="M970 262 C 986 290, 992 312, 998 326" stroke={ACCENT} strokeWidth="1.3" strokeDasharray="4 4" markerEnd="url(#arrow-accent)" />
      <Node x={1000} y={140} w={128} h={64} title="Cloudflare R2" sub="primary store" accent />
      <Node x={1000} y={222} w={128} h={58} title="Live retrieval" sub="vector + graph" />
      <Node x={1000} y={300} w={128} h={58} title="Client apps" sub="web · iOS" />
    </Frame>
  )
}

function HybridFlowDiagram() {
  return (
    <Frame
      vb="0 0 1150 420"
      label="HybridFlow retrieval backend: an agent calls the HybridFlowAPI (15 agentic tools, LangChain/MCP). Its query engine runs hybrid retrieval across three stores — a Qdrant vector index, a Neo4j knowledge graph, and a SQLite metadata store — expanding vector hits through the graph, then assembles structured context (hierarchy, figures, tables, cross-references) returned to the agent. A loader transactionally ingests Samhita exports with content-hash change detection."
    >
      {/* Ingest lane — Samhita export written into the stores */}
      <Node x={372} y={28} w={148} h={50} title="Samhita export" sub="v2 JSON" />
      <Arrow d="M520 53 L558 53" />
      <Node x={560} y={28} w={184} h={50} title="Loader" sub="validate · content-hash" accent />
      <path d="M652 78 L652 124" stroke={ACCENT} strokeWidth="1.4" strokeDasharray="4 4" markerEnd="url(#arrow-accent)" />
      <text x={668} y={104} textAnchor="start" fontSize="9" fill={SUB}>upsert · all 3</text>

      {/* Three stores — the hybrid backend */}
      <Node x={560} y={128} w={184} h={64} title="Qdrant" sub="53K vec · 768-dim BioLORD" />
      <Node x={560} y={220} w={184} h={64} title="Neo4j graph" sub="73K nodes · 4-level" />
      <Node x={560} y={312} w={184} h={64} title="SQLite" sub="220 chapters · versions" />
      {/* a vector hit expands through the graph */}
      <path d="M652 192 L652 218" stroke={ACCENT} strokeWidth="1.3" markerEnd="url(#arrow-accent)" />
      <text x={672} y={210} textAnchor="start" fontSize="9" fill={ACCENT}>expand</text>

      {/* Query lane */}
      <Node x={24} y={224} w={118} h={64} title="LLM agent" sub="invoke_tool()" />
      <Arrow d="M142 256 L170 256" />
      <Node x={172} y={210} w={166} h={92} title="HybridFlowAPI" sub={["15 agentic tools", "LangChain / MCP"]} accent />
      <Arrow d="M338 256 L366 256" />
      <Node x={368} y={224} w={150} h={64} title="Query engine" sub="hybrid retrieval" accent />
      <Arrow d="M518 240 C 535 200, 545 176, 558 162" />
      <Arrow d="M518 256 L558 252" />
      <Arrow d="M518 272 C 535 312, 545 336, 558 344" />

      {/* Context assembly → structured result */}
      <Arrow d="M744 160 C 762 200, 772 226, 790 244" />
      <Arrow d="M744 252 L790 256" />
      <Arrow d="M744 344 C 762 312, 772 288, 790 268" />
      <Node x={792} y={210} w={162} h={92} title="Context assembly" sub={["hierarchy · figures", "tables · cross-refs"]} accent />
      <Arrow d="M954 256 L994 256" accent />
      <Node x={996} y={224} w={130} h={64} title="Cited context" sub="structured · to agent" />
    </Frame>
  )
}

function SushrutalgsBffDiagram() {
  return (
    <Frame
      vb="0 0 1060 440"
      label="SushrutaLGS BFF: the web (Next.js) and iOS (SwiftUI) clients call one Cloudflare Worker gateway. The request flows through a five-stage pipeline inside the Worker — CORS / origin check, Supabase JWT verify, a plan-based atomic daily quota debit via a Supabase RPC, a user_context body transform, and forward to the hybrid-flow FastAPI backend with two-factor upstream auth. Verify and quota make auxiliary calls down to Supabase; the backend's SSE stream is piped back to the clients byte-for-byte. The 33 KiB gzipped Worker adds ~14 ms p50 at the edge with zero errors through 200 concurrent."
    >
      {/* Clients — both auth shapes accepted (cookie / Bearer) */}
      <Node x={30} y={164} w={150} h={56} title="Web" sub="Next.js · cookie" />
      <Node x={30} y={220} w={150} h={56} title="iOS" sub="SwiftUI · Bearer" />
      <Arrow d="M180 192 C 210 200, 226 216, 248 219" />
      <Arrow d="M180 248 C 210 240, 226 224, 248 221" />

      {/* The BFF Worker — request flows through 5 stages */}
      <rect x={250} y={150} width={460} height={102} rx={10} fill={TINT} stroke={ACCENT} strokeWidth={1.2} />
      <text x={480} y={172} textAnchor="middle" fontSize="13" fill={ACCENT}>BFF · Cloudflare Worker</text>
      <text x={480} y={188} textAnchor="middle" fontSize="9.5" fill={SUB}>Hono · 33 KiB gzip · ~14 ms p50 edge overhead</text>
      <PipeChip x={266} y={203} w={76} title="CORS" />
      <PipeChip x={354} y={203} w={76} title="verify JWT" />
      <PipeChip x={442} y={203} w={76} title="quota" />
      <PipeChip x={530} y={203} w={76} title="transform" />
      <PipeChip x={618} y={203} w={76} title="forward" />
      <path d="M342 220 L353 220" stroke={ACCENT} strokeWidth="1.3" markerEnd="url(#arrow-accent)" />
      <path d="M430 220 L441 220" stroke={ACCENT} strokeWidth="1.3" markerEnd="url(#arrow-accent)" />
      <path d="M518 220 L529 220" stroke={ACCENT} strokeWidth="1.3" markerEnd="url(#arrow-accent)" />
      <path d="M606 220 L617 220" stroke={ACCENT} strokeWidth="1.3" markerEnd="url(#arrow-accent)" />

      {/* Worker → backend, two-factor upstream auth */}
      <Arrow d="M710 220 L838 220" accent />
      <text x={774} y={206} textAnchor="middle" fontSize="9" fill={ACCENT}>X-API-Key +</text>
      <text x={774} y={217} textAnchor="middle" fontSize="9" fill={ACCENT}>CF-Access (2-factor)</text>
      <Node x={840} y={185} w={200} h={70} title="hybrid-flow" sub={["FastAPI backend", "never sees user_id"]} />

      {/* Auxiliary calls down to Supabase — dashed, from the verify and quota chips */}
      <path d="M392 237 L392 344" stroke={ACCENT} strokeWidth="1.3" strokeDasharray="4 4" markerEnd="url(#arrow-accent)" />
      <text x={372} y={298} textAnchor="end" fontSize="9" fill={SUB}>JWKS</text>
      <path d="M480 237 L480 344" stroke={ACCENT} strokeWidth="1.3" strokeDasharray="4 4" markerEnd="url(#arrow-accent)" />
      <text x={500} y={298} textAnchor="start" fontSize="9" fill={SUB}>quota RPC</text>
      <Node
        x={346}
        y={346}
        w={180}
        h={64}
        title="Supabase"
        sub={["JWKS verify · cache >99.9%", "atomic quota · 200/day"]}
      />

      {/* SSE stream piped back to the clients, byte-for-byte — routed along the bottom */}
      <path
        d="M940 255 L940 416 Q940 428 928 428 L118 428 Q106 428 106 416 L106 280"
        stroke={ACCENT}
        strokeWidth="1.3"
        strokeDasharray="5 5"
        markerEnd="url(#arrow-accent)"
      />
      <text x={523} y={424} textAnchor="middle" fontSize="10" fill={ACCENT}>SSE pass-through · byte-for-byte · no retry on paid streams</text>
    </Frame>
  )
}

function SushrutalgsWebDiagram() {
  return (
    <Frame
      vb="0 0 1010 432"
      label="SushrutaLGS web app: a Next.js client owns the chat experience — a chat-service that parses an 8-frame SSE stream, a conversation-store holding a forkable chat tree, and a BFF client. It calls the Cloudflare-Worker BFF (verify JWT, debit quota) which forwards to the HybridFlow FastAPI backend; the answer streams back over SSE. Supabase provides email-OTP auth and Postgres conversation storage, and auth-gated proxy routes serve figures and tables from two Cloudflare R2 buckets."
    >
      {/* Browser → the app */}
      <Node x={24} y={176} w={116} h={60} title="Browser" sub="web client" />
      <Arrow d="M140 206 L204 206" />

      {/* Next.js app — accent container exposing its internals */}
      <rect x={206} y={92} width={296} height={250} rx={10} fill={TINT} stroke={ACCENT} strokeWidth={1.3} />
      <text x={354} y={116} textAnchor="middle" fontSize="13" fill={ACCENT}>Next.js app</text>
      <text x={354} y={131} textAnchor="middle" fontSize="9.5" fill={SUB}>owns the chat experience</text>
      <Node x={228} y={148} w={252} h={50} title="chat-service" sub="8-frame SSE parser" />
      <Node x={228} y={208} w={252} h={50} title="conversation-store" sub="chat tree · fork / branch" />
      <Node x={228} y={268} w={252} h={50} title="BFF client" sub="auth · refresh-on-401" accent />

      {/* app → BFF → AI backend */}
      <path d="M480 293 C 516 268, 536 232, 556 218" stroke={INK} strokeWidth="1.5" markerEnd="url(#arrow)" />
      <Node x={558} y={184} w={178} h={62} title="BFF" sub={["Cloudflare Worker", "verify JWT · quota"]} />
      <Arrow d="M736 215 L784 215" />
      <Node x={786} y={184} w={178} h={62} title="AI backend" sub={["HybridFlow", "FastAPI · RAG"]} />

      {/* SSE stream back to the chat-service (top, navy) */}
      <path d="M620 184 C 600 112, 528 86, 450 86 L450 146" stroke={ACCENT} strokeWidth="1.4" markerEnd="url(#arrow-accent)" />
      <text x={566} y={76} textAnchor="middle" fontSize="9.5" fill={ACCENT}>SSE: thinking → metadata → text → done</text>

      {/* Storage row — auth/persistence + media (dashed, auxiliary) */}
      <Node x={206} y={362} w={172} h={56} title="Supabase" sub="email OTP · Postgres" />
      <Node x={398} y={362} w={132} h={56} title="R2 · figures" sub="WebP" />
      <Node x={548} y={362} w={132} h={56} title="R2 · tables" sub="JSON" />
      <path d="M268 342 L286 360" stroke={ACCENT} strokeWidth="1.3" strokeDasharray="4 4" markerEnd="url(#arrow-accent)" />
      <path d="M372 342 C 410 352, 440 356, 458 360" stroke={ACCENT} strokeWidth="1.3" strokeDasharray="4 4" markerEnd="url(#arrow-accent)" />
      <path d="M440 342 C 520 354, 580 356, 608 360" stroke={ACCENT} strokeWidth="1.3" strokeDasharray="4 4" markerEnd="url(#arrow-accent)" />
      <text x={500} y={336} textAnchor="middle" fontSize="9" fill={SUB}>auth-gated proxy · media</text>
    </Frame>
  )
}

function SushrutalgsIosDiagram() {
  const cardStroke = "rgba(26,26,26,0.4)"
  return (
    <Frame
      vb="0 0 1060 432"
      label="SushrutaLGS iOS app: an iPhone/iPad SwiftUI client built Model-View with no ViewModels. Inside the app, @Observable services drive a typed Router, a tree-forking ChatTree ported 1:1 from web, a BFFClient that streams chat over SSE, and on-device caches (Keychain + JSON disk caches) for an offline-tolerant cold start. The app calls the Cloudflare-Worker BFF which forwards to the HybridFlow AI backend; the SSE response streams back as thinking/metadata/text/error/done frames. Supabase provides auth (email OTP, Google, Apple) and a Realtime channel that hands off a live stream to the user's other devices."
    >
      {/* Device — two stacked cards: iPhone + iPad share one SwiftUI shell */}
      <rect x={34} y={172} width={120} height={62} rx={7} fill="#f4f1ec" stroke={cardStroke} strokeWidth={1.2} />
      <rect x={26} y={180} width={120} height={62} rx={7} fill="#f4f1ec" stroke={INK} strokeWidth={1.5} />
      <text x={86} y={206} textAnchor="middle" fontSize="13" fill={INK}>iPhone / iPad</text>
      <text x={86} y={223} textAnchor="middle" fontSize="9.5" fill={SUB}>one SwiftUI shell</text>
      <path d="M148 211 L186 211" stroke={INK} strokeWidth="1.5" markerEnd="url(#arrow)" />

      {/* The app — accent container holding its internals */}
      <rect x={188} y={36} width={368} height={350} rx={10} fill={TINT} stroke={ACCENT} strokeWidth={1.3} />
      <text x={372} y={62} textAnchor="middle" fontSize="13" fill={ACCENT}>SwiftUI app</text>
      <text x={372} y={79} textAnchor="middle" fontSize="9.5" fill={SUB}>iOS 26 · Model-View · no ViewModels</text>

      {/* @Observable services drive everything below */}
      <Node x={210} y={96} w={324} h={56} title="@Observable services" sub="7 · Auth · Conversation · injected via @Environment" accent />
      <path d="M285 152 L285 176" stroke={ACCENT} strokeWidth="1.3" markerEnd="url(#arrow-accent)" />
      <path d="M459 152 L459 176" stroke={ACCENT} strokeWidth="1.3" markerEnd="url(#arrow-accent)" />

      {/* Router + ChatTree row, then Caches + BFFClient (network egress, bottom-right) */}
      <Node x={210} y={178} w={150} h={64} title="Router" sub={["typed [Route]", "+ artifact panel"]} />
      <Node x={384} y={178} w={150} h={64} title="ChatTree" sub={["tree-forking", "1:1 w/ web"]} />
      <Node x={210} y={262} w={150} h={64} title="Caches" sub={["Keychain · JSON", "offline cold-start"]} />
      <Node x={384} y={262} w={150} h={64} title="BFFClient" sub={["SSE chat", "refresh-on-401"]} accent />
      <path d="M459 242 L459 260" stroke={ACCENT} strokeWidth="1.3" markerEnd="url(#arrow-accent)" />

      {/* App (BFFClient) ↔ BFF — query out (upper), SSE back (lower), no crossing */}
      <path d="M534 280 C 575 262, 612 224, 646 206" stroke={INK} strokeWidth="1.5" markerEnd="url(#arrow)" />
      <text x={592} y={232} textAnchor="middle" fontSize="9" fill={SUB}>/v1/query</text>
      <path d="M646 214 C 612 250, 575 296, 534 310" stroke={ACCENT} strokeWidth="1.4" markerEnd="url(#arrow-accent)" />
      <text x={594} y={300} textAnchor="middle" fontSize="9" fill={ACCENT}>SSE frames</text>

      {/* BFF → AI backend */}
      <Node x={648} y={150} w={172} h={68} title="BFF" sub={["Cloudflare Worker", "verify JWT · quota"]} />
      <Arrow d="M820 184 L862 184" />
      <Node x={864} y={150} w={172} h={68} title="AI backend" sub={["HybridFlow", "FastAPI · RAG"]} />

      {/* Supabase Realtime — auth + cross-device handoff (secondary) */}
      <Node x={648} y={300} w={172} h={70} title="Supabase" sub={["auth: OTP · Google · Apple", "Realtime · PostgREST"]} />
      <path d="M538 340 L644 336" stroke={ACCENT} strokeWidth="1.3" strokeDasharray="4 4" markerEnd="url(#arrow-accent)" />
      <text x={590} y={328} textAnchor="middle" fontSize="9" fill={SUB}>auth · publish</text>
      <path d="M820 340 L862 340" stroke={ACCENT} strokeWidth="1.3" strokeDasharray="4 4" markerEnd="url(#arrow-accent)" />
      <Node x={864} y={306} w={172} h={58} title="Other device" sub="live stream handoff" />
      <text x={950} y={296} textAnchor="middle" fontSize="9" fill={ACCENT}>chat-stream-‹id›</text>
    </Frame>
  )
}

function YelpDiagram() {
  const cardStroke = "rgba(26,26,26,0.4)"
  return (
    <Frame
      vb="0 0 1150 430"
      label="Yelp ML platform: the 6.99M-review Yelp Open Dataset (5.3 GB JSON) is read by a single-pass Spark ETL into snappy Parquet at ~462K rows/sec, then 5-core filtered to 4.39M interactions over 287K users and 148K items. Two models train off that table — a bias-augmented ALS recommender (RMSE 1.17, Recall@10 5.5%, 6.2x a popularity baseline) and a TF-IDF + Logistic Regression sentiment classifier (86.3% accuracy, macro-F1 0.70). MLflow tracks both runs. The sentiment model is exported to a pure-numpy artifact with 100% prediction parity and served by FastAPI at p99 0.11 ms / 34K predictions per second, versus ~290 ms for the in-process Spark path."
    >
      {/* Raw dataset — stacked cards = the Yelp JSON dumps */}
      <rect x={40} y={186} width={150} height={64} rx={7} fill="#f4f1ec" stroke={cardStroke} strokeWidth={1.2} />
      <rect x={31} y={195} width={150} height={64} rx={7} fill="#f4f1ec" stroke={cardStroke} strokeWidth={1.3} />
      <rect x={22} y={204} width={150} height={64} rx={7} fill="#f4f1ec" stroke={INK} strokeWidth={1.5} />
      <text x={97} y={231} textAnchor="middle" fontSize="13" fill={INK}>Yelp Open Dataset</text>
      <text x={97} y={249} textAnchor="middle" fontSize="9.5" fill={SUB}>6.99M reviews · 5.3 GB JSON</text>
      <Arrow d="M172 236 L210 236" />

      {/* Spark ETL — the data core */}
      <Node
        x={212}
        y={196}
        w={186}
        h={84}
        title="Spark ETL"
        sub={["JSON → Parquet · snappy", "~462K rows/sec · single-pass"]}
        accent
      />

      {/* 5-core filtered interaction table — the shared training source */}
      <Node
        x={430}
        y={196}
        w={172}
        h={84}
        title="Interaction table"
        sub={["5-core · 4.39M edges", "287K users · 148K items"]}
      />
      <Arrow d="M398 238 L428 238" accent />

      {/* Fan-out to the two model trainers */}
      <Arrow d="M602 218 C 648 196, 690 158, 716 138" />
      <Arrow d="M602 258 C 648 280, 690 318, 716 338" />

      {/* ALS recommender — explicit (RMSE) + implicit ranking (Recall@10) */}
      <Node
        x={718}
        y={92}
        w={224}
        h={92}
        title="ALS recommender"
        sub={["μ+b_user+b_item+ALS · rank 50", "RMSE 1.17 · Recall@10 5.5%", "6.2× a popularity baseline"]}
      />

      {/* Sentiment classifier — TF-IDF → LogReg */}
      <Node
        x={718}
        y={296}
        w={224}
        h={92}
        title="Sentiment classifier"
        sub={["TF-IDF → LogReg · 3-class", "1.4M labeled · 86.3% acc", "macro-F1 0.70 (vs 0.67 base)"]}
      />

      {/* MLflow — auxiliary tracking, dashed both ways */}
      <Node x={742} y={202} w={176} h={56} title="MLflow" sub={["experiment tracking", "model registry"]} />
      <Arrow d="M830 184 L830 200" dashed />
      <Arrow d="M830 296 L830 260" dashed />

      {/* numpy export — sentiment model compiled to a portable artifact */}
      <Arrow d="M830 388 C 830 412, 700 420, 612 386" />
      <rect x={430} y={332} width={172} height={74} rx={7} fill="none" stroke={ACCENT} strokeWidth={1.3} strokeDasharray="3 4" />
      <text x={516} y={356} textAnchor="middle" fontSize="11.5" fill={ACCENT}>numpy export</text>
      <text x={516} y={373} textAnchor="middle" fontSize="9.5" fill={SUB}>vocab · idf.npy · lr.npz</text>
      <text x={516} y={388} textAnchor="middle" fontSize="9.5" fill={SUB}>100% parity vs Spark</text>

      {/* Export → FastAPI serving core */}
      <Arrow d="M430 369 L300 369" accent />

      {/* FastAPI serving — the production core */}
      <Node
        x={94}
        y={328}
        w={206}
        h={86}
        title="FastAPI service"
        sub={["pure-numpy inference path", "p99 0.11 ms · 34K pred/sec", "(Spark path ~290 ms/req)"]}
        accent
      />
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
