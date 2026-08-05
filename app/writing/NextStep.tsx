import Link from "next/link"
import { Head, Row, Spacer } from "./Prose"

// The one link into /playbook that every post ends on. Kept as a component so
// the wording of the offer lives in one place and the internal link never
// drifts out of sync with the product.
//
// It closes the article as a real section rather than a floating card, so it
// sits on the same grid as everything above it. The `line` is per-post on
// purpose: a generic "buy my thing" block at the foot of four different
// articles is the thing readers learn to skip.
export function NextStep({ line }: { line: string }) {
  return (
    <section>
      <Head title="The long version" />
      <Row label="Playbook">
        <div className="next-step">
          <p className="display font-light text-[16px] xs:text-[18px] leading-[1.55] ink">{line}</p>
          <div className="mt-5">
            <Link href="/playbook" className="accent-link accent display text-[15px] xs:text-[16px]">
              Zero to Hired: the AI-engineer portfolio playbook{" "}
              <span aria-hidden>&rarr;</span>
            </Link>
          </div>
        </div>
      </Row>
      <Spacer />
    </section>
  )
}
