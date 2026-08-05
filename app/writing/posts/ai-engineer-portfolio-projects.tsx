import Link from "next/link"
import type { PostMeta } from "../posts-data"
import { Lede, Section } from "../Prose"
import { DepthVsBreadth, Figure, RoleMap } from "../Figure"
import { NextStep } from "../NextStep"

export const meta: PostMeta = {
  slug: "ai-engineer-portfolio-projects",
  title: "The AI engineer portfolio projects that actually get you hired",
  seoTitle: "AI engineer portfolio projects that get you hired",
  description:
    "Most AI portfolios fail for the same three reasons. What hiring managers look for in 2026, and how to pick two or three projects that survive an interview.",
  standfirst:
    "Two projects you can defend for ten minutes beat eight you can only describe. Here is what separates a portfolio that gets a callback from one that gets skimmed.",
  published: "2026-08-04",
  readingTime: "9 min",
  topics: ["Portfolio", "Hiring", "AI engineering"],
}

export default function Post() {
  return (
    <>
      <Lede label="The pile">
        <p>
          Every AI engineering candidate has the same eight repos. A Titanic notebook. A
          sentiment classifier on the IMDB set. A chatbot wrapping an OpenAI call. A
          &ldquo;RAG app&rdquo; that loads three PDFs into Chroma and never gets evaluated. The
          problem is not that these are bad projects. It is that they are{" "}
          <em>indistinguishable</em>, and a recruiter looking at forty portfolios in an
          afternoon is not reading code. They are pattern-matching for reasons to stop reading.
        </p>

        <p>
          I have been on the other side of this while building{" "}
          <Link href="/">the work on this site</Link>, and the failure mode is consistent. It is
          almost never a lack of ability. It is that nothing in the repo{" "}
          <strong>proves</strong> the ability.
        </p>

        <p className="callout">
          A portfolio is not a list of things you built. It is a set of claims, and every claim
          needs something committed to the repo that backs it.
        </p>
      </Lede>

      <Section title="The problem" label="Three reasons">
        <p>
          Portfolios get skipped for the same three reasons, in roughly this order.
        </p>

        <h3>1. Nothing proves it ran</h3>
        <p>
          The single most common gap. There is a <code>model.pkl</code> and a notebook with
          outputs cleared, and no way for a reader to tell whether the numbers in the README
          were measured or remembered. No tests, no CI, no committed benchmark output, no
          screenshots of a running service.
        </p>
        <p>
          The fix is unglamorous and takes an afternoon: a GitHub Actions workflow that runs
          your test suite on every push, and a benchmark script whose output you commit as a
          file. Now the green check next to your latest commit is doing the arguing for you.
        </p>

        <h3>2. Breadth instead of depth</h3>
        <p>
          Eight shallow projects read as eight abandoned projects. They also produce an
          interview you cannot win: the interviewer picks one, asks &ldquo;why did you chunk at
          512 tokens?&rdquo;, and there is no answer because the number came from a tutorial.
        </p>
        <p>
          Two or three projects, each with a design document explaining what you tried and
          rejected, gives you something to talk about for the full hour. Depth is also the only
          thing that is expensive to fake, which is exactly why it signals.
        </p>

        <Figure caption="Same total effort, spent two ways. The line is the only thing an interview measures: whether you can hold a project up for ten minutes of questions.">
          <DepthVsBreadth />
        </Figure>

        <h3>3. The projects do not match the job</h3>
        <p>
          A diffusion-model reimplementation is impressive and completely irrelevant to a
          Forward-Deployed Engineer role, where the actual job is integrating a model into
          someone else&rsquo;s messy systems under a deadline. Candidates routinely build for
          the job title they find exciting rather than the one they are applying to.
        </p>
      </Section>

      <Section title="By role" label="What they screen">
        <p>
          These three titles get treated as interchangeable and are not. The distinction matters
          because it changes which project is worth six weeks of your evenings.
        </p>

        <Figure caption="The mapping in one pass. Pick the row that matches the job posting, then build across, not down.">
          <RoleMap />
        </Figure>

        <h3>Forward-Deployed Engineer</h3>
        <p>
          Screening for: can you make a model useful inside a customer&rsquo;s constraints. The
          signal is integration work, graceful degradation, and knowing when a human has to
          approve something.
        </p>
        <ul>
          <li>
            An approval-gated agent: it drafts an action, a human confirms, it executes, and
            every step is logged and reversible.
          </li>
          <li>
            A customer data integration service that ingests three genuinely different schemas
            and reconciles them, with the reconciliation failures surfaced rather than swallowed.
          </li>
        </ul>

        <h3>AI/ML Engineer</h3>
        <p>
          Screening for: do you know whether your system works. In 2026 the honest
          differentiator is evaluation, not model choice, because everyone has access to the
          same models.
        </p>
        <ul>
          <li>
            A retrieval system with a real eval harness: a labelled question set, retrieval
            metrics separated from generation metrics, and a regression gate in CI.
          </li>
          <li>
            A retraining pipeline with drift detection, where the interesting artefact is the
            decision rule for when to retrain, not the training loop.
          </li>
        </ul>

        <h3>Data Engineer</h3>
        <p>
          Screening for: correctness at volume, and what you do when the upstream data is wrong.
        </p>
        <ul>
          <li>
            A streaming pipeline with explicit late-arrival and duplicate handling, plus a
            backfill path.
          </li>
          <li>
            A warehouse model with tested transformations and an API on top, where the tests
            assert business invariants and not just row counts.
          </li>
        </ul>
      </Section>

      <Section title="The repo" label="Five things">
        <p>
          Independent of domain, these are what a reader is actually scanning for in the ninety
          seconds they give you.
        </p>

        <ol>
          <li>
            <strong>A README written for someone who will never run the code.</strong> What it
            does, one architecture diagram, the headline numbers, how to run it. Not a wall of
            setup instructions.
          </li>
          <li>
            <strong>A design document.</strong> Two pages: what you chose, what you rejected,
            and the measurement that decided it. This is the single highest-signal file in most
            repos, and almost nobody writes one.
          </li>
          <li>
            <strong>Tests and a green CI badge.</strong> Even a thin suite. The point is the
            evidence that it runs, on a machine that is not yours.
          </li>
          <li>
            <strong>Numbers with provenance.</strong> &ldquo;p99 0.11 ms&rdquo; means nothing
            alone; &ldquo;p99 0.11 ms, benchmark output committed at{" "}
            <code>bench/results/2026-05-serving.txt</code>&rdquo; means everything.
          </li>
          <li>
            <strong>Commit history that looks like work.</strong> Forty commits over six weeks
            with real messages reads as a project. One commit named <code>final version</code>{" "}
            reads as a download.
          </li>
        </ol>

        <p className="callout">
          Publish only numbers you can defend for ten minutes. One hard question you cannot
          answer undoes every number that came before it.
        </p>
      </Section>

      <Section title="Choosing" label="How to pick">
        <p>
          Work backwards from the job posting, not forwards from your interests. Pull five real
          postings for the role you want, list every responsibility that appears in three or
          more of them, and choose projects that produce evidence for the top two. That list is
          usually shorter and more boring than expected: deployment, evaluation, data quality,
          and being able to explain a tradeoff.
        </p>

        <p>
          Then give each project a scope you can finish. A project abandoned at 70% is worth
          less than nothing, because the repo is public and the abandonment is visible. Six to
          eight weeks per project, two or three projects, is a realistic six months.
        </p>

        <p>
          None of this requires paid compute. Free tiers cover inference, GPU time for
          fine-tuning, a Postgres instance and a permanent ARM VM, which is enough for every
          project listed above. I wrote up{" "}
          <Link href="/writing/ml-portfolio-free-tier-stack">
            the exact stack and where each tier breaks
          </Link>{" "}
          separately.
        </p>

        <p>
          And if the repo has to stay private, that is workable too, but it needs a deliberate
          substitute for the code a reader cannot see. That is{" "}
          <Link href="/writing/private-repo-credible-to-recruiters">its own problem</Link>.
        </p>
      </Section>

      <NextStep line="Sixteen project specs, chosen by target role, each with a week-by-week build plan, the interview questions it prepares you to answer, and the resume bullets it produces when it ships." />
    </>
  )
}
