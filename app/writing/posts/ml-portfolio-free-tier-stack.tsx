import Link from "next/link"
import type { PostMeta } from "../posts-data"
import { Lede, Section } from "../Prose"
import { Figure, FreeTierStack } from "../Figure"
import { NextStep } from "../NextStep"

export const meta: PostMeta = {
  slug: "ml-portfolio-free-tier-stack",
  title: "Building an ML portfolio on $0: the free-tier stack, and where it breaks",
  description:
    "Inference, GPU time, Postgres and a permanent server, all on free tiers. What each one actually gives you in 2026, and the limit you will hit first.",
  standfirst:
    "You do not need a budget to build a portfolio. You do need to know which free tier fails first, because designing around the wrong one wastes weeks.",
  published: "2026-08-04",
  readingTime: "10 min",
  topics: ["Free tier", "Infrastructure", "Portfolio"],
}

export default function Post() {
  return (
    <>
      <Lede label="The excuse">
        <p>
          &ldquo;I cannot afford the compute&rdquo; is the most common reason people give for
          not having a portfolio, and it is almost never the real constraint. Between hosted
          inference, notebook GPUs, managed Postgres and a permanent free VM, you can build and
          run every project described in{" "}
          <Link href="/writing/ai-engineer-portfolio-projects">
            the roles-to-projects breakdown
          </Link>{" "}
          without paying anything.
        </p>

        <p>
          What does cost you is picking the wrong tier for the workload and discovering the
          limit in week four. So this is organised by the limit, not by the marketing.
        </p>

        <Figure caption="The whole stack, and the wall each layer runs into first. Every quota here moves, sometimes silently: treat it as the shape of the tier, then check the provider.">
          <FreeTierStack />
        </Figure>

        <p className="callout">
          Every quota below moves, sometimes without an announcement. Treat these as the shape
          of each tier, then check the provider before you design around a number.
        </p>
      </Lede>

      <Section title="Inference" label="Hosted APIs">
        <p>
          Self-hosting a model is the most common early mistake. It burns your GPU allowance on
          serving rather than on the one thing you genuinely need a GPU for, and &ldquo;I ran a
          7B model on a T4&rdquo; is not a hiring signal in 2026. Nobody is impressed that you
          can run inference; they want to know what you built on top of it.
        </p>

        <h3>Groq</h3>
        <p>
          A free API tier with unusually low latency, which makes it the right default for
          anything interactive: agents, chat surfaces, anything where a user is waiting.{" "}
          <strong>Breaks at:</strong> requests and tokens per minute. Fine for a demo and for
          your eval runs; not fine if you plan to batch a hundred thousand documents through it
          in one afternoon. Design your eval harness to checkpoint and resume.
        </p>

        <h3>Gemini API</h3>
        <p>
          A free tier covering both generation and embeddings, which matters more than it
          sounds: embedding a corpus is usually the first thing that would have cost you money.{" "}
          <strong>Breaks at:</strong> daily request caps, and free-tier usage generally being
          available for product improvement, so do not push anything sensitive through it. For a
          portfolio project on public data, that is a non-issue.
        </p>
      </Section>

      <Section title="GPU" label="Training only">
        <p>
          Colab&rsquo;s free tier gives you an NVIDIA T4 with 16 GB of VRAM. Sessions run up to
          roughly twelve hours, and the weekly GPU allowance is dynamic rather than published,
          observed by various trackers in the region of fifteen to thirty hours a week and lower
          during peak demand. Some days you will not get a GPU at all.
        </p>

        <p>
          <strong>Breaks at:</strong> session death. This is the failure that costs people a
          week, and the fix is entirely in how you write the training loop.
        </p>

        <ul>
          <li>
            Checkpoint every epoch to Drive or object storage, and make resume the default path,
            not an emergency one.
          </li>
          <li>
            Never keep your dataset only in the session filesystem. It goes away with the
            runtime.
          </li>
          <li>
            Log metrics to something external (Weights and Biases has a free personal tier), or
            a disconnect takes your results with it.
          </li>
          <li>
            Fit within 16 GB by design: LoRA or QLoRA rather than full fine-tuning, gradient
            accumulation rather than a large batch, mixed precision on by default.
          </li>
        </ul>

        <p>
          With those four in place, a T4 is enough for every fine-tune a portfolio project
          realistically needs.
        </p>
      </Section>

      <Section title="Database" label="Supabase">
        <p>
          Managed Postgres with auth, plus <code>pgvector</code>, on a free tier. The vector
          support is the reason it beats a bare Postgres container for AI work: your embeddings
          and your relational data live in one place, and you get to write the join.
        </p>

        <p>
          <strong>Breaks at:</strong> two things. A modest storage ceiling, which is generous
          for text and immediately tight if you store raw files (put those in object storage and
          keep only the reference). And inactivity: free projects pause after about a week
          without traffic. A recruiter opening your demo two weeks after you sent the link finds
          a dead app, which is worse than not having sent it. Either keep a small scheduled ping
          against it, or state on the case-study page that the demo takes a moment to wake.
        </p>
      </Section>

      <Section title="The server" label="Oracle, with a caveat">
        <p>
          Oracle&rsquo;s Always Free tier is the only mainstream option that gives you a
          genuinely permanent ARM VM rather than a trial credit, which makes it the natural home
          for anything that has to stay up: a scheduled pipeline, a webhook receiver, a demo
          API.
        </p>

        <p className="callout">
          In June 2026 Oracle halved the Always Free Ampere A1 allowance from 4 OCPUs and 24 GB
          to 2 OCPUs and 12 GB, with no announcement. Plenty of guides still quote the old
          figures.
        </p>

        <p>
          Two cores and 12 GB is still a real server and still more than most portfolio projects
          need, but if you planned a workload around 24 GB you should replan now rather than at
          deploy time.
        </p>

        <p>
          <strong>Also breaks at:</strong> capacity. A1 instances are frequently unavailable in
          the busiest regions, sometimes for days. Pick a quieter home region when you create
          the tenancy, because changing it later is painful.
        </p>
      </Section>

      <Section title="The rest" label="Often forgotten">
        <ul>
          <li>
            <strong>CI</strong> GitHub Actions is free for public repos. This is the cheapest
            credibility on the list, and the one most often skipped.
          </li>
          <li>
            <strong>Frontend hosting</strong> A hobby tier is enough for a demo and a case-study
            page. This site runs on one.
          </li>
          <li>
            <strong>Object storage</strong> For datasets and checkpoints, so nothing important
            lives inside a Colab session.
          </li>
          <li>
            <strong>Experiment tracking</strong> A free personal tier is plenty, and having runs
            you can link to is itself an artefact.
          </li>
        </ul>
      </Section>

      <Section title="The ceiling" label="What $0 cannot do">
        <p>Being straight about the limit, because designing past it wastes months:</p>

        <ul>
          <li>Pre-training anything. Fine-tuning yes, pre-training no.</li>
          <li>
            Serving real traffic. Free tiers are for a demo a handful of people open, not for
            users.
          </li>
          <li>
            Genuinely large-scale data work. You can demonstrate a pipeline that would scale, on
            a sampled dataset, with the scaling argument written down. That is the honest
            version and it interviews well.
          </li>
          <li>Anything with a real uptime requirement.</li>
        </ul>

        <p>
          None of those are needed to prove competence. What is needed is a system that runs, a
          measurement that shows it works, and a write-up that survives questioning. That fits
          inside $0 comfortably.
        </p>

        <p>
          If the project you build this way ends up in a private repo, the{" "}
          <Link href="/writing/private-repo-credible-to-recruiters">
            artefacts that keep it credible
          </Link>{" "}
          are a separate problem worth solving early.
        </p>
      </Section>

      <NextStep line="The playbook's stack guide goes tier by tier with the current limits and the workaround for each one, and every one of its sixteen project specs is scoped to run inside them." />
    </>
  )
}
