import Link from "next/link"

// The one link into /playbook that every post ends on. Kept as a component
// rather than repeated markup so the wording of the offer stays in one place
// and the internal link never drifts out of sync with the product.
//
// The `line` is per-post on purpose: a generic "buy my thing" block at the foot
// of four different articles is the thing readers learn to skip.
export function NextStep({ line }: { line: string }) {
  return (
    <aside className="next-step mt-12">
      <p className="mono small-caps accent" style={{ marginTop: 0 }}>
        The long version
      </p>
      <p className="display font-light text-[17px] xs:text-[18px] leading-[1.55] ink mt-3">
        {line}
      </p>
      <div className="mt-4">
        <Link href="/playbook" className="accent-link accent display text-[16px]">
          Zero to Hired: the AI-engineer portfolio playbook{" "}
          <span aria-hidden>&rarr;</span>
        </Link>
      </div>
    </aside>
  )
}
