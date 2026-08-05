import Link from "next/link"
import type { PostMeta } from "../posts-data"
import { NextStep } from "../NextStep"

export const meta: PostMeta = {
  slug: "private-repo-credible-to-recruiters",
  title: "How to make a private repo credible to a recruiter who cannot see the code",
  description:
    "Your best work is often under an NDA or a startup you have not launched. Six artefacts that make a private project verifiable without ever exposing the source.",
  standfirst:
    "Work you cannot show is not the same as work you cannot prove. The trick is to move the evidence out of the source and into artefacts a reader can check.",
  published: "2026-08-04",
  readingTime: "8 min",
  topics: ["Portfolio", "Hiring", "Case studies"],
}

export default function Post() {
  return (
    <>
      <p>
        The strongest project on your resume is frequently the one you cannot link. It belongs
        to an employer, sits under an NDA, or is a startup you have not launched yet. The usual
        advice, &ldquo;just make it public&rdquo;, is not advice, and the usual fallback,
        writing a paragraph on your resume and hoping, converts badly. An unverifiable claim in
        a competitive pile is treated as a decorative one.
      </p>

      <p>
        The way out is not to leak anything. It is to notice that a reader was never going to
        read your source anyway. Recruiters do not read code, and most hiring managers read
        very little of it before the interview. What they read is the surrounding evidence. If
        you build that evidence deliberately, a private project can land almost as hard as a
        public one.
      </p>

      <p className="callout">
        Nobody was going to read the code. They were going to read the README, look at the
        diagram, check the numbers, and decide whether to ask you about it.
      </p>

      <h2>Six artefacts that survive an NDA</h2>

      <h3>1. A case study page you control</h3>
      <p>
        One page per project, on your own domain, with a stable URL you can paste into an
        application. Problem, constraints, architecture, decisions, outcome. Not a
        landing page and not a pitch: it should read like an internal write-up that happens to
        be public.
      </p>
      <p>
        This site does exactly that. The{" "}
        <Link href="/">case studies linked from the projects section</Link> are built so that a
        reader who cannot see the repo still leaves with a specific, checkable picture of what
        was built.
      </p>

      <h3>2. An architecture diagram</h3>
      <p>
        The highest-value artefact per minute spent. A diagram shows system thinking, and
        system thinking is the thing seniority is judged on. It also leaks nothing: boxes and
        arrows describe a shape, not an implementation.
      </p>
      <p>
        Draw the real one, including the parts that are ugly. A diagram with a queue in it
        because there genuinely was a backpressure problem is far more convincing than a clean
        three-box picture that could describe anything.
      </p>

      <h3>3. A design document with the rejected options</h3>
      <p>
        Two pages. What you chose, what you rejected, and what measurement decided it. The
        rejected options are the load-bearing part: anyone can justify a decision after the
        fact, but naming the alternative you tried and the number that killed it is only
        possible if you actually did the work.
      </p>
      <p>
        Design docs are usually safe to publish with light redaction, because the reasoning is
        general even when the system is not. Swap customer names for roles, round the volumes,
        and it is publishable.
      </p>

      <h3>4. Numbers with a stated method</h3>
      <p>
        &ldquo;Reduced latency by 60%&rdquo; is worth nothing. &ldquo;p95 fell from 840 ms to
        310 ms after replacing the per-request model load with a warm pool, measured over 10k
        requests at 50 rps&rdquo; is worth a lot, and it discloses nothing proprietary.
      </p>
      <p>
        The rule I hold myself to: publish only numbers you can defend for ten minutes. In a
        private project, the method statement <em>is</em> the proof, because there is no repo to
        fall back on.
      </p>

      <h3>5. A demo that shows behaviour, not access</h3>
      <p>
        A ninety-second screen recording against seeded, synthetic data. Show one full path
        through the system including a failure case, because a demo where nothing goes wrong
        looks staged. Synthetic data sidesteps the confidentiality problem entirely.
      </p>
      <p>
        If even the interface is sensitive, record a CLI or the API responses. Behaviour is the
        point; polish is not.
      </p>

      <h3>6. An explicit, unapologetic access note</h3>
      <p>
        State plainly that the repo is private, why (one clause: employer-owned, NDA,
        unlaunched), and what you will do instead: a walkthrough on a call, or read access
        granted on request where that is permitted.
      </p>
      <p>
        Do not hide it and do not apologise for it. A candidate who says &ldquo;this is under
        NDA, here is a diagram, a design doc and a demo, and I will walk you through the code
        live&rdquo; reads as someone who handles confidential work correctly. That is itself a
        hiring signal, especially for anything customer-facing.
      </p>

      <h2>What to extract while you still can</h2>

      <p>
        If the project is at a current employer, decide early what leaves with you. Almost
        always safe:
      </p>

      <ul>
        <li>The architecture at the level of boxes and arrows.</li>
        <li>The decisions and their tradeoffs, with customer specifics stripped.</li>
        <li>Performance characteristics as ratios or rounded figures.</li>
        <li>The failure modes you hit and how you handled them.</li>
        <li>Anything genuinely general that you can rebuild from scratch on your own time.</li>
      </ul>

      <p>
        Never: source, credentials, customer names or data, internal metrics that are not
        public, or anything your employment agreement covers. When it is ambiguous, ask your
        manager. A written &ldquo;yes, that framing is fine&rdquo; costs one message and
        removes the risk.
      </p>

      <h2>Keep one thing public</h2>

      <p>
        A portfolio where every project is private strains credulity no matter how good the
        write-ups are. Keep at least one repo open, ideally the one with the most visible
        engineering discipline: real commit history, tests, CI, a benchmark output. It does not
        need to be your most impressive system. It needs to make the private claims plausible
        by showing how you work when someone can watch.
      </p>

      <p>
        On this site that role is played by a couple of public repos alongside the private case
        studies, on purpose. The public ones are not the most interesting work; they are the
        proof that the write-ups describe something real.
      </p>

      <p>
        For the wider question of{" "}
        <Link href="/writing/ai-engineer-portfolio-projects">
          which projects are worth building in the first place
        </Link>
        , start there instead.
      </p>

      <NextStep line="The playbook covers this end to end: the case-study template, the design-doc skeleton, and a repo skeleton with the README and CI already written, so a private project still has something to point at." />
    </>
  )
}
