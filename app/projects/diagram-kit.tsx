// Drawing kit for the architecture diagrams.
//
// The previous diagrams were technically accurate but visually flat: every node
// was the same hairline rectangle, every connector an ad-hoc bézier with
// hand-typed control points, and nothing grouped. Two consequences, both of
// which showed up on screen — no reading order (everything competed equally for
// attention) and recurring label/edge collisions, because absolute coordinates
// drift the moment any content changes.
//
// This kit fixes both. Visually it adds elevation, a real type hierarchy, and
// tinted lanes so a group reads as one thing. Structurally it computes edge
// geometry from node rectangles instead of trusting hand-placed points, so a
// connector cannot miss its target.

export const INK = "#1a1a1a"
export const ACCENT = "#1f3a5f"
export const SUB = "rgba(26,26,26,0.55)"
export const RULE = "rgba(26,26,26,0.14)"
export const TINT = "rgba(31,58,95,0.055)"
export const CARD = "#fffdfa"
export const MONO = '"Google Sans Code", ui-monospace, "SFMono-Regular", Menlo, monospace'

/** A placed node. Every connector is derived from these, never from literals. */
export type Box = { x: number; y: number; w: number; h: number }

export const cx = (b: Box) => b.x + b.w / 2
export const cy = (b: Box) => b.y + b.h / 2
export const right = (b: Box) => ({ x: b.x + b.w, y: cy(b) })
export const left = (b: Box) => ({ x: b.x, y: cy(b) })
export const top = (b: Box) => ({ x: cx(b), y: b.y })
export const bottom = (b: Box) => ({ x: cx(b), y: b.y + b.h })

export function box(x: number, y: number, w: number, h: number): Box {
  return { x, y, w, h }
}

/** Stack n boxes of height h down a column, centred on `midY`, with `gap`. */
export function column(x: number, w: number, h: number, midY: number, n: number, gap: number): Box[] {
  const total = n * h + (n - 1) * gap
  const y0 = midY - total / 2
  return Array.from({ length: n }, (_, i) => box(x, y0 + i * (h + gap), w, h))
}

export function Defs() {
  return (
    <defs>
      {/* Elevation. Subtle enough to read as paper rather than as a UI card,
          strong enough that nodes sit above the grain instead of in it. */}
      <filter id="dk-lift" x="-30%" y="-30%" width="160%" height="180%">
        <feDropShadow dx="0" dy="1.5" stdDeviation="2.2" floodColor="#1a1a1a" floodOpacity="0.13" />
      </filter>
      <marker id="dk-tip" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
        <path d="M0.5,1 L9,5 L0.5,9" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </marker>
      <marker id="dk-tip-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
        <path d="M0.5,1 L9,5 L0.5,9" fill="none" stroke={ACCENT} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </marker>
    </defs>
  )
}

export function Frame({ vb, label, children }: { vb: string; label: string; children: React.ReactNode }) {
  return (
    <svg viewBox={vb} className="w-full h-auto" role="img" aria-label={label} fill="none">
      <Defs />
      <g fontFamily={MONO}>{children}</g>
    </svg>
  )
}

/** A tinted band grouping related nodes, with a small-caps lane label. */
export function Lane({
  x, y, w, h, label, note, accent = false,
}: Box & { label?: string; note?: string; accent?: boolean }) {
  return (
    <g>
      <rect
        x={x} y={y} width={w} height={h} rx={12}
        fill={accent ? TINT : "rgba(26,26,26,0.028)"}
        stroke={accent ? "rgba(31,58,95,0.28)" : RULE}
        strokeWidth={1}
      />
      {/* Labels ride ABOVE the band, not inside it. Inside, they compete for
          space with the first row of nodes and with their step badges, which is
          exactly the collision that kept recurring. */}
      {label && (
        <text
          x={x + 2} y={y - 10} fontSize="11" letterSpacing="1.6"
          fill={accent ? ACCENT : SUB}
          stroke="#f4f1ec" strokeWidth={3.5} paintOrder="stroke" strokeLinejoin="round"
        >
          {label.toUpperCase()}
        </text>
      )}
      {note && <Tag x={x + w - 2} y={y - 10} text={note} anchor="end" />}
    </g>
  )
}

/**
 * A node. `tone` drives the whole treatment rather than a pile of flags:
 *   solid   the primary spine, accent-filled, the thing your eye lands on
 *   card    an ordinary participant
 *   ghost   auxiliary / external, quieter and dashed
 */
export function Node({
  b, title, sub, tone = "card", step,
}: {
  b: Box
  title: string
  sub?: string | string[]
  tone?: "solid" | "card" | "ghost"
  /** Small numeral on the spine, so the reading order is explicit. */
  step?: number
}) {
  const subs = sub == null ? [] : Array.isArray(sub) ? sub : [sub]
  const solid = tone === "solid"
  const ghost = tone === "ghost"
  const titleFill = solid ? ACCENT : INK
  // Optical centring: the title sits above its subs, so the block is centred as
  // a unit rather than the title being centred and the subs hanging below it.
  const blockH = 17 + subs.length * 15
  const titleY = cy(b) - blockH / 2 + 13

  return (
    <g>
      <rect
        x={b.x} y={b.y} width={b.w} height={b.h} rx={9}
        fill={ghost ? "none" : solid ? TINT : CARD}
        stroke={solid ? ACCENT : ghost ? RULE : "rgba(26,26,26,0.28)"}
        strokeWidth={solid ? 1.5 : 1.2}
        strokeDasharray={ghost ? "4 4" : undefined}
        filter={ghost ? undefined : "url(#dk-lift)"}
      />
      <text x={cx(b)} y={titleY} textAnchor="middle" fontSize="15.5" fill={titleFill}>
        {title}
      </text>
      {subs.map((s, i) => (
        <text key={i} x={cx(b)} y={titleY + 17 + i * 15} textAnchor="middle" fontSize="11.5" fill={SUB}>
          {s}
        </text>
      ))}
      {step != null && (
        // Above the box, not inside it: the title is centred, so an inset badge
        // collides with it on any node whose title fills the width.
        <g>
          <circle cx={cx(b)} cy={b.y - 13} r={10.5} fill={ACCENT} />
          <text x={cx(b)} y={b.y - 9.5} textAnchor="middle" fontSize="11" fill="#f4f1ec">
            {step}
          </text>
        </g>
      )}
    </g>
  )
}

/**
 * Orthogonal connector between two boxes, with rounded corners. Engineered
 * rather than sketched, and — because it is derived from the rectangles — it
 * cannot drift off its target when a node moves or its text changes.
 */
export function Link({
  from, to, dir = "h", accent = false, dashed = false, label, labelSide = "above", gap = 0,
}: {
  from: Box
  to: Box
  /** h: leaves the right edge, enters the left. v: leaves the bottom, enters the top. */
  dir?: "h" | "v"
  accent?: boolean
  dashed?: boolean
  label?: string
  labelSide?: "above" | "below"
  /** Extra inset so the tip stops short of the target's edge. */
  gap?: number
}) {
  const r = 10
  let d: string
  let lx: number
  let ly: number

  if (dir === "h") {
    const a = right(from)
    const b = left(to)
    const bx = b.x - gap
    if (Math.abs(a.y - b.y) < 1.5) {
      d = `M${a.x} ${a.y} L${bx} ${b.y}`
    } else {
      const mid = (a.x + bx) / 2
      const s = b.y > a.y ? 1 : -1
      d =
        `M${a.x} ${a.y} L${mid - r} ${a.y}` +
        ` Q${mid} ${a.y} ${mid} ${a.y + s * r}` +
        ` L${mid} ${b.y - s * r}` +
        ` Q${mid} ${b.y} ${mid + r} ${b.y}` +
        ` L${bx} ${b.y}`
    }
    lx = (a.x + bx) / 2
    ly = (a.y + b.y) / 2 + (labelSide === "above" ? -9 : 15)
  } else {
    const a = bottom(from)
    const b = top(to)
    const by = b.y - gap
    if (Math.abs(a.x - b.x) < 1.5) {
      d = `M${a.x} ${a.y} L${b.x} ${by}`
    } else {
      const mid = (a.y + by) / 2
      const s = b.x > a.x ? 1 : -1
      d =
        `M${a.x} ${a.y} L${a.x} ${mid - r}` +
        ` Q${a.x} ${mid} ${a.x + s * r} ${mid}` +
        ` L${b.x - s * r} ${mid}` +
        ` Q${b.x} ${mid} ${b.x} ${mid + r}` +
        ` L${b.x} ${by}`
    }
    // A vertical link elbows horizontally at exactly this midpoint, so putting
    // the label there draws the line straight through the text. Sit it clear of
    // the run instead; the halo handles whatever it still crosses.
    lx = (a.x + b.x) / 2
    ly = (a.y + by) / 2 - 9
  }

  const stroke = accent ? ACCENT : INK
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeDasharray={dashed ? "4 5" : undefined}
        markerEnd={`url(#${accent ? "dk-tip-accent" : "dk-tip"})`}
      />
      {label && <Tag x={lx} y={ly} text={label} fill={accent ? ACCENT : SUB} />}
    </g>
  )
}

/**
 * Text with a paper-coloured halo knocked out behind the glyphs.
 *
 * Non-negotiable for anything drawn near a connector: a label sitting on a line
 * is unreadable, and in a diagram the label is usually placed on a line by
 * definition. paint-order:stroke draws a fat paper stroke first and the ink fill
 * over it, so the line is cut away exactly around the letterforms rather than
 * behind a boxy rectangle.
 */
export function Tag({
  x, y, text, fill = SUB, anchor = "middle", size = 11.5,
}: {
  x: number
  y: number
  text: string
  fill?: string
  anchor?: "start" | "middle" | "end"
  size?: number
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={size}
      fill={fill}
      stroke="#f4f1ec"
      strokeWidth={3.5}
      paintOrder="stroke"
      strokeLinejoin="round"
    >
      {text}
    </text>
  )
}

/** A caption pinned under the frame, for the one-line "what this shows". */
export function Caption({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <text x={x} y={y} fontSize="11" letterSpacing="1.4" fill={SUB}>
      {text.toUpperCase()}
    </text>
  )
}

/**
 * Two short parallel bars. Replaces the literal "∥" character, which is outside
 * the unicode-range of the self-hosted Google Sans Code subset and was silently
 * falling back to a system font mid-diagram.
 */
export function ParallelMark({ x, y, accent = false }: { x: number; y: number; accent?: boolean }) {
  const c = accent ? ACCENT : SUB
  return (
    <g stroke={c} strokeWidth={1.4} strokeLinecap="round">
      <line x1={x} y1={y - 5} x2={x} y2={y + 5} />
      <line x1={x + 4.5} y1={y - 5} x2={x + 4.5} y2={y + 5} />
    </g>
  )
}
