import * as K from "./diagram-kit"

// Inline SVG architecture diagrams, keyed by slug. Drawn in the site palette so
// each reads as a bespoke artifact rather than a stock image.
//
// Every diagram is composed from ./diagram-kit rather than hand-placed shapes.
// Two rules the earlier hand-drawn versions kept breaking, which the kit now
// enforces structurally:
//
//   1. Connector geometry is DERIVED from node rectangles, never typed as
//      literal coordinates. A link cannot miss its target or drift when the
//      content beside it changes.
//   2. Every floating label goes through K.Tag, which knocks a paper-coloured
//      halo out behind the glyphs. Labels in a diagram sit on connectors by
//      definition, and without the halo the line reads straight through them.
//
// Text is restricted to Latin-1 plus the punctuation ranges the self-hosted
// Google Sans Code subset actually covers. The arrows, Greek letters, combining
// circumflex and parallel bars used previously fall OUTSIDE that unicode-range
// and silently swapped to a system font mid-diagram, which is a large part of
// why the old versions looked subtly mismatched. Parallelism is drawn with
// K.ParallelMark instead of the "∥" character.

const H = 68 // primary node height
const H2 = 62 // secondary node height

/* ── MACE-PINN ──────────────────────────────────────────────────────────── */

function MacePinnDiagram() {
  const input = K.box(40, 184, 148, H)
  const fourier = K.box(244, 184, 156, H)
  const usub = K.box(436, 96, 196, H2)
  const vsub = K.box(436, 272, 196, H2)
  const uout = K.box(668, 96, 108, H2)
  const vout = K.box(668, 272, 108, H2)
  const loss = K.box(864, 166, 216, 104)
  return (
    <K.Frame
      vb="0 0 1200 500"
      label="MACE-PINN architecture: (x, y, t) inputs enter one jointly-trained block, where a 64-dimensional random Fourier embedding feeds two coupled subnetworks (a u-subnet and a v-subnet) that learn iteratively and emit the predicted fields u-hat and v-hat. Those outputs feed a gradient-norm adaptively weighted physics-informed loss, whose adaptive weights feed back into the block."
    >
      <K.Lane x={216} y={44} w={588} h={352} label="one trainable block" note="jointly optimised" accent />

      <K.Node b={input} title="(x, y, t)" sub="collocation inputs" step={1} />
      <K.Node b={fourier} title="Fourier" sub={["random features", "64-dim"]} tone="solid" step={2} />
      <K.Link from={input} to={fourier} />

      <K.Node b={usub} title="u-subnet" sub="MLP · 3x64" />
      <K.Node b={vsub} title="v-subnet" sub="MLP · 4x128" />
      <K.Link from={fourier} to={usub} />
      <K.Link from={fourier} to={vsub} />

      <K.Node b={uout} title="u-hat" sub="predicted" />
      <K.Node b={vout} title="v-hat" sub="predicted" />
      <K.Link from={usub} to={uout} />
      <K.Link from={vsub} to={vout} />

      {/* The coupling is the thesis: the two fields are solved together. */}
      <K.Link from={usub} to={vsub} dir="v" accent label="iterative coupling" />

      <K.Node b={loss} title="Physics loss" sub={["initial + residual + data", "gradient-norm weighted"]} tone="solid" step={3} />
      <K.Link from={uout} to={loss} />
      <K.Link from={vout} to={loss} />

      {/* Adaptive weights feed back into the block, routed under everything. */}
      <path
        d="M972 270 L972 440 Q972 452 960 452 L334 452 Q322 452 322 440 L322 408"
        fill="none" stroke={K.ACCENT} strokeWidth={1.4} strokeDasharray="5 5"
        markerEnd="url(#dk-tip-accent)"
      />
      <K.Tag x={648} y={442} text="adaptive weights, from running gradient norms" fill={K.ACCENT} />

      <K.Caption x={40} y={484} text="one block, two coupled fields, one weighted loss" />
    </K.Frame>
  )
}

/* ── Samhita ────────────────────────────────────────────────────────────── */

function SamhitaDiagram() {
  const pdfs = K.box(40, 208, 176, 80)
  const chip = (x: number, y: number) => K.box(x, y, 108, 46)
  const parse = chip(272, 180)
  const recover = chip(392, 180)
  const structure = chip(512, 180)
  const clean = chip(272, 286)
  const enhance = chip(392, 286)
  const annotate = chip(512, 286)
  const taxonomy = K.box(676, 34, 208, 60)
  const kg = K.box(676, 138, 208, 76)
  const emb = K.box(676, 268, 208, 76)
  const vexp = K.box(952, 158, 176, H)
  const sha = K.box(952, 262, 176, H)
  const r2 = K.box(676, 458, 160, H)
  const live = K.box(856, 458, 160, H)
  const apps = K.box(1036, 458, 160, H)
  return (
    <K.Frame
      vb="0 0 1210 600"
      label="Samhita data backbone: textbook PDFs with metadata are ingested in parallel into a hybrid extraction pipeline (parse, recover, structure, then clean, enhance and annotate in parallel), which is adaptive rather than static parsing. It builds a taxonomy-structured knowledge graph and dense embeddings, bundled into an immutable SHA-256 content-hashed versioned export that publishes to Cloudflare R2 and feeds live retrieval and the client apps."
    >
      <K.Lane x={248} y={122} w={396} h={252} label="hybrid pipeline" note="adaptive, not static" accent />
      <K.Lane x={928} y={122} w={224} h={252} label="immutable export" />

      {/* Stacked cards: any book, fed in parallel. */}
      <rect x={58} y={192} width={176} height={80} rx={9} fill="#f4f1ec" stroke={K.RULE} strokeWidth={1.2} />
      <rect x={49} y={200} width={176} height={80} rx={9} fill="#f4f1ec" stroke={K.RULE} strokeWidth={1.2} />
      <K.Node b={pdfs} title="Textbook PDFs" sub={["any book", "+ metadata"]} step={1} />
      <K.ParallelMark x={112} y={312} accent />
      <K.Tag x={138} y={316} text="parallel ingest" anchor="start" fill={K.ACCENT} />

      <K.Node b={parse} title="Parse" />
      <K.Node b={recover} title="Recover" />
      <K.Node b={structure} title="Structure" />
      <K.Link from={parse} to={recover} />
      <K.Link from={recover} to={structure} />
      <K.Node b={clean} title="Clean" />
      <K.Node b={enhance} title="Enhance" />
      <K.Node b={annotate} title="Annotate" />
      <K.ParallelMark x={382} y={309} />
      <K.ParallelMark x={502} y={309} />
      <K.Link from={pdfs} to={parse} />
      <K.Link from={structure} to={clean} dir="v" accent />

      <K.Node b={taxonomy} title="Taxonomy" sub="17 domains" tone="ghost" />
      <K.Link from={taxonomy} to={kg} dir="v" label="structures" />
      <K.Node b={kg} title="Knowledge graph" sub="71,621 nodes" step={2} />
      <K.Node b={emb} title="Dense embeddings" sub="52,871 vectors" />
      <K.Link from={structure} to={kg} />
      <K.Link from={annotate} to={emb} />

      <K.Node b={vexp} title="Versioned export" sub="bundle manifest" tone="solid" step={3} />
      <K.Node b={sha} title="SHA-256" sub="content-hash" />
      <K.Link from={kg} to={vexp} />
      <K.Link from={emb} to={sha} />
      <K.Link from={vexp} to={sha} dir="v" />

      <K.Node b={r2} title="Cloudflare R2" sub="primary store" tone="solid" />
      <K.Node b={live} title="Live retrieval" sub="vector + graph" tone="ghost" />
      <K.Node b={apps} title="Client apps" sub="web · iOS" tone="ghost" />
      <K.Link from={sha} to={r2} dir="v" accent label="publish" />
      <K.Link from={sha} to={live} dir="v" dashed />
      <K.Link from={sha} to={apps} dir="v" dashed />

      <K.Caption x={40} y={578} text="immutable, content-hashed, versioned on every run" />
    </K.Frame>
  )
}

/* ── HybridFlow ─────────────────────────────────────────────────────────── */

function HybridFlowDiagram() {
  const exp = K.box(96, 40, 176, 56)
  const load = K.box(312, 40, 190, 56)
  const stores = K.column(452, 262, H, 322, 3, 28)
  const spine = (x: number, w: number) => K.box(x, 288, w, H)
  const agent = spine(40, 148)
  const api = spine(216, 190)
  const asm = spine(770, 196)
  const out = spine(1002, 152)
  return (
    <K.Frame
      vb="0 0 1200 515"
      label="HybridFlow retrieval backend: an agent calls the HybridFlowAPI (15 agentic tools, LangChain/MCP). Its query engine runs hybrid retrieval across three stores (a Qdrant vector index, a Neo4j knowledge graph, and a SQLite metadata store), expanding vector hits through the graph, then assembles structured context (hierarchy, figures, tables, cross-references) returned to the agent. A loader transactionally ingests Samhita exports with content-hash change detection."
    >
      <K.Lane x={430} y={156} w={306} h={312} label="hybrid stores" note="one query · three indexes" accent />

      <K.Node b={exp} title="Samhita export" sub="v2 JSON" tone="ghost" />
      <K.Node b={load} title="Loader" sub="validate · content-hash" tone="ghost" />
      <K.Link from={exp} to={load} dashed />
      <K.Link from={load} to={stores[0]} dir="v" dashed label="upsert · all 3" />

      <K.Node b={agent} title="LLM agent" sub="invoke_tool()" step={1} />
      <K.Node b={api} title="HybridFlowAPI" sub={["15 agentic tools", "LangChain / MCP"]} tone="solid" step={2} />
      <K.Link from={agent} to={api} />

      <K.Node b={stores[0]} title="Qdrant" sub="53K vec · 768-dim BioLORD" />
      <K.Node b={stores[1]} title="Neo4j graph" sub="73K nodes · 4-level" />
      <K.Node b={stores[2]} title="SQLite" sub="220 chapters · versions" />
      <K.Link from={api} to={stores[0]} />
      <K.Link from={api} to={stores[1]} />
      <K.Link from={api} to={stores[2]} />
      <K.Link from={stores[0]} to={stores[1]} dir="v" accent label="expand" />

      <K.Node b={asm} title="Context assembly" sub={["hierarchy · figures", "tables · cross-refs"]} tone="solid" step={3} />
      <K.Link from={stores[0]} to={asm} />
      <K.Link from={stores[1]} to={asm} />
      <K.Link from={stores[2]} to={asm} />
      <K.Node b={out} title="Cited context" sub="structured · to agent" step={4} />
      <K.Link from={asm} to={out} accent />

      <K.Caption x={40} y={498} text="a vector hit expands through the graph before context is assembled" />
    </K.Frame>
  )
}

/* ── sushrutalgs.ai BFF ─────────────────────────────────────────────────── */

function SushrutalgsBffDiagram() {
  const clients = K.column(40, 168, H2, 250, 2, 24)
  const chip = (x: number) => K.box(x, 226, 100, 50)
  const cors = chip(276)
  const jwt = chip(388)
  const quota = chip(500)
  const xform = chip(612)
  const fwd = chip(724)
  const backend = K.box(896, 166, 212, 76)
  const supa = K.box(388, 374, 224, 80)
  return (
    <K.Frame
      vb="0 0 1200 520"
      label="sushrutalgs.ai BFF: the web (Next.js) and iOS (SwiftUI) clients call one Cloudflare Worker gateway. The request flows through a five-stage pipeline inside the Worker: CORS and origin check, Supabase JWT verify, a plan-based atomic daily quota debit via a Supabase RPC, a user_context body transform, and forward to the hybrid-flow FastAPI backend with two-factor upstream auth. Verify and quota make auxiliary calls down to Supabase, and the backend's SSE stream is piped back to the clients byte for byte. The 33 KiB gzipped Worker adds about 14 ms p50 at the edge with zero errors through 200 concurrent."
    >
      <K.Lane x={252} y={90} w={608} h={196} label="BFF · Cloudflare Worker" note="Hono · 33 KiB gzip · ~14 ms p50" accent />

      <K.Node b={clients[0]} title="Web" sub="Next.js · cookie" step={1} />
      <K.Node b={clients[1]} title="iOS" sub="SwiftUI · Bearer" />

      <K.Node b={cors} title="CORS" />
      <K.Node b={jwt} title="verify" />
      <K.Node b={quota} title="quota" />
      <K.Node b={xform} title="transform" />
      <K.Node b={fwd} title="forward" />
      <K.Link from={clients[0]} to={cors} />
      <K.Link from={clients[1]} to={cors} />
      <K.Link from={cors} to={jwt} />
      <K.Link from={jwt} to={quota} />
      <K.Link from={quota} to={xform} />
      <K.Link from={xform} to={fwd} />

      <K.Node b={backend} title="hybrid-flow" sub={["FastAPI backend", "never sees user_id"]} step={2} />
      <K.Link from={fwd} to={backend} accent label="2-factor auth" />

      <K.Node b={supa} title="Supabase" sub={["JWKS verify · cache >99.9%", "atomic quota · 200/day"]} tone="ghost" />
      <K.Link from={jwt} to={supa} dir="v" dashed />
      <K.Link from={quota} to={supa} dir="v" dashed />
      <K.Tag x={500} y={354} text="JWKS · quota RPC" anchor="end" />

      {/* SSE piped back to both clients, routed under everything. */}
      <path
        d="M1002 242 L1002 478 Q1002 490 990 490 L136 490 Q124 490 124 478 L124 264"
        fill="none" stroke={K.ACCENT} strokeWidth={1.4} strokeDasharray="5 5"
        markerEnd="url(#dk-tip-accent)"
      />
      <K.Tag x={563} y={480} text="SSE pass-through · byte for byte · no retry on paid streams" fill={K.ACCENT} />

      <K.Caption x={40} y={516} text="one gateway, five stages, the stream never buffered" />
    </K.Frame>
  )
}

/* ── sushrutalgs.ai web ─────────────────────────────────────────────────── */

function SushrutalgsWebDiagram() {
  const browser = K.box(40, 250, 156, H)
  const mods = K.column(268, 276, H2, 284, 3, 22)
  const bff = K.box(648, 250, 196, H)
  const ai = K.box(896, 250, 196, H)
  const supa = K.box(268, 470, 200, H2)
  const figs = K.box(492, 470, 156, H2)
  const tbls = K.box(672, 470, 156, H2)
  return (
    <K.Frame
      vb="0 0 1200 580"
      label="sushrutalgs.ai web app: a Next.js client owns the chat experience, with a chat-service that parses an 8-frame SSE stream, a conversation-store holding a forkable chat tree, and a BFF client. It calls the Cloudflare Worker BFF (verify JWT, debit quota) which forwards to the HybridFlow FastAPI backend, and the answer streams back over SSE. Supabase provides email-OTP auth and Postgres conversation storage, and auth-gated proxy routes serve figures and tables from two Cloudflare R2 buckets."
    >
      <K.Lane x={244} y={148} w={324} h={272} label="Next.js app" note="owns the chat experience" accent />

      <K.Node b={browser} title="Browser" sub="web client" step={1} />
      <K.Node b={mods[0]} title="chat-service" sub="8-frame SSE parser" />
      <K.Node b={mods[1]} title="conversation-store" sub="chat tree · fork" />
      <K.Node b={mods[2]} title="BFF client" sub="auth · refresh-on-401" tone="solid" />
      <K.Link from={browser} to={mods[1]} />

      <K.Node b={bff} title="BFF" sub={["Cloudflare Worker", "verify JWT · quota"]} step={2} />
      <K.Node b={ai} title="AI backend" sub={["HybridFlow", "FastAPI · RAG"]} step={3} />
      <K.Link from={mods[2]} to={bff} />
      <K.Link from={bff} to={ai} />

      {/* SSE home, over the top so it never crosses the request path. */}
      <path
        d="M746 250 L746 108 Q746 96 734 96 L310 96 Q298 96 298 108 L298 174"
        fill="none" stroke={K.ACCENT} strokeWidth={1.4}
        markerEnd="url(#dk-tip-accent)"
      />
      <K.Tag x={522} y={90} text="SSE: thinking, metadata, text, done" fill={K.ACCENT} />

      <K.Node b={supa} title="Supabase" sub="email OTP · Postgres" tone="ghost" />
      <K.Node b={figs} title="R2 · figures" sub="WebP" tone="ghost" />
      <K.Node b={tbls} title="R2 · tables" sub="JSON" tone="ghost" />
      <K.Link from={mods[2]} to={supa} dir="v" dashed />
      <K.Link from={mods[2]} to={figs} dir="v" dashed />
      <K.Link from={mods[2]} to={tbls} dir="v" dashed label="auth-gated proxy" />

      <K.Caption x={40} y={562} text="the client owns the tree; the worker owns auth and quota" />
    </K.Frame>
  )
}

/* ── sushrutalgs.ai iOS ─────────────────────────────────────────────────── */

function SushrutalgsIosDiagram() {
  const device = K.box(40, 252, 152, 76)
  const services = K.box(268, 150, 332, 56)
  const router = K.box(268, 240, 156, 66)
  const chattree = K.box(444, 240, 156, 66)
  const caches = K.box(268, 330, 156, 66)
  const bffclient = K.box(444, 330, 156, 66)
  const bff = K.box(690, 194, 190, 76)
  const ai = K.box(936, 194, 190, 76)
  const supa = K.box(690, 356, 190, 80)
  const other = K.box(936, 356, 190, 80)
  return (
    <K.Frame
      vb="0 0 1200 560"
      label="sushrutalgs.ai iOS app: an iPhone and iPad SwiftUI client built Model-View with no ViewModels. Observable services drive a typed Router, a tree-forking ChatTree ported one-to-one from web, a BFFClient that streams chat over SSE, and on-device Keychain and JSON caches for an offline-tolerant cold start. The app calls the Cloudflare Worker BFF which forwards to the HybridFlow AI backend, and the SSE response streams back as thinking, metadata, text, error and done frames. Supabase provides auth by email OTP, Google and Apple, plus a Realtime channel that hands a live stream off to the user's other devices."
    >
      <K.Lane x={244} y={112} w={380} h={308} label="SwiftUI app" note="iOS 26 · no ViewModels" accent />

      {/* Two stacked cards: iPhone and iPad share one shell. */}
      <rect x={52} y={240} width={152} height={76} rx={9} fill="#f4f1ec" stroke={K.RULE} strokeWidth={1.2} />
      <K.Node b={device} title="iPhone / iPad" sub="one SwiftUI shell" step={1} />

      <K.Node b={services} title="Observable services" sub="7 · injected via Environment" tone="solid" />
      <K.Node b={router} title="Router" sub="typed routes" />
      <K.Node b={chattree} title="ChatTree" sub="1:1 with web" />
      <K.Node b={caches} title="Caches" sub="Keychain · JSON" />
      <K.Node b={bffclient} title="BFFClient" sub="SSE · refresh-on-401" tone="solid" />
      <K.Link from={device} to={router} />
      <K.Link from={services} to={router} dir="v" />
      <K.Link from={services} to={chattree} dir="v" />

      <K.Node b={bff} title="BFF" sub={["Cloudflare Worker", "verify JWT · quota"]} step={2} />
      <K.Node b={ai} title="AI backend" sub={["HybridFlow", "FastAPI · RAG"]} step={3} />
      <K.Link from={bffclient} to={bff} label="/v1/query" />
      <K.Link from={bff} to={ai} />

      <K.Node b={supa} title="Supabase" sub={["OTP · Google · Apple", "Realtime · PostgREST"]} tone="ghost" />
      <K.Node b={other} title="Other device" sub="live stream handoff" tone="ghost" />
      <K.Link from={bffclient} to={supa} dashed label="auth · publish" />
      <K.Link from={supa} to={other} dashed accent />

      <K.Caption x={40} y={542} text="one shell, two form factors, a stream that follows the user" />
    </K.Frame>
  )
}

/* ── Yelp ML platform ───────────────────────────────────────────────────── */

function YelpDiagram() {
  const dataset = K.box(40, 158, 178, 84)
  const etl = K.box(276, 158, 204, 84)
  const table = K.box(538, 158, 196, 84)
  const als = K.box(796, 52, 246, 100)
  const sent = K.box(796, 232, 246, 100)
  const mlflow = K.box(830, 380, 178, 72)
  const numpy = K.box(524, 384, 200, 88)
  const api = K.box(232, 380, 236, 96)
  return (
    <K.Frame
      vb="0 0 1220 560"
      label="Yelp ML platform: the 6.99M-review Yelp Open Dataset (5.3 GB of JSON) is read by a single-pass Spark ETL into snappy Parquet at about 462K rows per second, then 5-core filtered to 4.39M interactions over 287K users and 148K items. Two models train off that table: a bias-augmented ALS recommender at RMSE 1.17 and Recall@10 of 5.5 percent, 6.2 times a popularity baseline, and a TF-IDF plus logistic regression sentiment classifier at 86.3 percent accuracy and macro-F1 0.70. MLflow tracks both runs. The sentiment model is exported to a pure-numpy artifact with 100 percent prediction parity and served by FastAPI at p99 0.11 ms and 34K predictions per second, against about 290 ms for the in-process Spark path."
    >
      {/* Stacked cards: the raw JSON dumps. */}
      <rect x={58} y={142} width={178} height={84} rx={9} fill="#f4f1ec" stroke={K.RULE} strokeWidth={1.2} />
      <rect x={49} y={150} width={178} height={84} rx={9} fill="#f4f1ec" stroke={K.RULE} strokeWidth={1.2} />
      <K.Node b={dataset} title="Yelp Open Dataset" sub={["6.99M reviews", "5.3 GB JSON"]} step={1} />

      <K.Node b={etl} title="Spark ETL" sub={["JSON to Parquet · snappy", "~462K rows/sec"]} tone="solid" step={2} />
      <K.Link from={dataset} to={etl} />
      <K.Node b={table} title="Interaction table" sub={["5-core · 4.39M edges", "287K users · 148K items"]} step={3} />
      <K.Link from={etl} to={table} accent />

      <K.Node b={als} title="ALS recommender" sub={["bias + ALS · rank 50", "RMSE 1.17 · Recall@10 5.5%", "6.2x a popularity baseline"]} />
      <K.Node b={sent} title="Sentiment classifier" sub={["TF-IDF to LogReg · 3-class", "1.4M labeled · 86.3% acc", "macro-F1 0.70 (base 0.67)"]} />
      <K.Link from={table} to={als} />
      <K.Link from={table} to={sent} />

      <K.Node b={mlflow} title="MLflow" sub={["experiment tracking", "model registry"]} tone="ghost" />
      <K.Link from={sent} to={mlflow} dir="v" dashed />

      <K.Node b={numpy} title="numpy export" sub={["vocab · idf.npy · lr.npz", "100% parity vs Spark"]} tone="ghost" />
      <K.Link from={mlflow} to={numpy} dashed />

      <K.Node b={api} title="FastAPI service" sub={["pure-numpy inference", "p99 0.11 ms · 34K pred/sec", "(Spark path ~290 ms/req)"]} tone="solid" step={4} />
      <K.Link from={numpy} to={api} accent />

      <K.Caption x={40} y={540} text="trained in Spark, served without it" />
    </K.Frame>
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
