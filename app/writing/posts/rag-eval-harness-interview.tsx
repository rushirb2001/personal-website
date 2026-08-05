import Link from "next/link"
import type { PostMeta } from "../posts-data"
import { Lede, Section } from "../Prose"
import { EvalHarness, Figure } from "../Figure"
import { NextStep } from "../NextStep"

export const meta: PostMeta = {
  slug: "rag-eval-harness-interview",
  title: "RAG with an eval harness: the questions interviewers actually ask",
  description:
    "Anyone can wire an embedding model to a vector store. The interview is about evaluation. Nine questions RAG candidates get asked, and what a good answer looks like.",
  standfirst:
    "RAG is the most common project on AI engineering resumes and the one candidates are least able to defend. The gap is always evaluation.",
  published: "2026-08-04",
  readingTime: "11 min",
  topics: ["RAG", "Evaluation", "Interviews"],
}

export default function Post() {
  return (
    <>
      <Lede label="The gap">
        <p>
          Retrieval-augmented generation is the most common project on an AI engineering resume,
          and it is the one that collapses fastest under questioning. The build is genuinely
          easy: an embedding model, a vector store, a prompt template, forty lines of glue. That
          is precisely why it carries almost no signal on its own. The interviewer knows it took
          you an afternoon.
        </p>

        <p>
          What separates a RAG project that gets you hired is the part most people skip: a
          harness that can tell you whether a change made the system better or worse.
        </p>

        <p className="callout">
          Without an eval set, every change to a RAG pipeline is a vibe. With one, every change
          is an experiment. That distinction is the whole interview.
        </p>
      </Lede>

      <Section title="The harness" label="Build first">
        <p>The thing that makes this project defensible is small and takes about a day.</p>

        <Figure caption="The pipeline is the afternoon's work. The two taps hanging off it, and the gate they feed, are the part that survives an interview.">
          <EvalHarness />
        </Figure>

        <ol>
          <li>
            <strong>A labelled question set.</strong> Fifty to a hundred and fifty questions
            over your corpus, each tagged with the document (ideally the chunk) that contains
            the answer. Write them by hand. Generating them with a model is fine as a first
            pass, but the model will write questions that are trivially retrievable and your
            scores will be flattering and useless.
          </li>
          <li>
            <strong>Retrieval metrics, measured separately from generation.</strong> Recall@k
            and MRR over that set. This is the step almost everyone omits, and it is the one
            that matters: if the right chunk is not in the context, no amount of prompt work
            fixes the answer.
          </li>
          <li>
            <strong>Generation metrics, on top.</strong> Faithfulness (does the answer follow
            from the retrieved context) and answer relevance. An LLM judge is acceptable here if
            you validate it: score thirty examples by hand, check the judge agrees, and report
            that agreement rate.
          </li>
          <li>
            <strong>A regression gate in CI.</strong> The harness runs on every push and fails
            the build if recall@5 drops more than a set threshold. This turns your repo from a
            demo into a system.
          </li>
        </ol>

        <div className="snippet">
          <pre>{`$ pytest tests/eval -q

retrieval    recall@5   0.87   (baseline 0.86, +0.01)
retrieval    mrr        0.71   (baseline 0.70, +0.01)
generation   faithful   0.92   judge agreement 0.90 (n=30)

PASS  no regression beyond -0.02 threshold`}</pre>
        </div>

        <p>
          Commit that output. A number in a README with a file behind it is a different
          conversation from a number in a README.
        </p>
      </Section>

      <Section title="The questions" label="Nine of them">
        <h3>1. How do you know retrieval is working?</h3>
        <p>
          The question that ends most interviews. If the answer is &ldquo;the answers looked
          good&rdquo;, the rest of the conversation is a formality. Name your metric, your set
          size, and how the set was labelled.
        </p>

        <h3>2. Why that chunk size?</h3>
        <p>
          There is no correct number, only a measured one. A good answer is a sweep: you tried
          256, 512 and 1024 with an overlap of roughly 10 to 15%, recall peaked somewhere, and
          you can say where and by how much. A bad answer is 512, because that is what the
          tutorial used.
        </p>

        <h3>3. What breaks when the answer spans two chunks?</h3>
        <p>
          Tests whether you have looked at your own failures. Real answers: overlap, a parent
          document retriever that fetches the surrounding section once a child chunk hits, or
          increasing k and re-ranking. What matters is that you know this failure exists in your
          corpus and roughly how often.
        </p>

        <h3>4. Semantic search or hybrid?</h3>
        <p>
          Pure vector search loses on exact identifiers: part numbers, error codes, function
          names, proper nouns it never saw in training. BM25 handles those, and fusing the two
          rankings usually beats either alone. If your corpus has none of that, say so, and say
          how you checked.
        </p>

        <h3>5. How do you stop it inventing things?</h3>
        <p>
          Grounding is a design problem, not a prompt problem. Answers worth giving: require
          citations and validate that the cited span exists in the retrieved context; return
          &ldquo;I do not know&rdquo; below a retrieval-score threshold, and be able to say what
          that threshold cost you in coverage.
        </p>

        <h3>6. What is your p95 latency, and where does it go?</h3>
        <p>
          Break it down: embedding, retrieval, re-rank, generation. Almost always generation
          dominates and retrieval is noise, but the candidates who have measured it are a small
          minority. Say what you would cache and why.
        </p>

        <h3>7. How does it behave when the corpus is updated?</h3>
        <p>
          Re-embedding everything is fine at ten thousand documents and untenable at ten
          million. Incremental indexing, a document-version key, and stale-chunk deletion are
          the real answer. This is the question that separates people who built a demo from
          people who thought about operating it.
        </p>

        <h3>8. What would you do if you had ten times the documents?</h3>
        <p>
          A scaling question in disguise. Metadata pre-filtering, sharding by tenant or
          namespace, a two-stage retrieve-then-rerank so the expensive model only sees fifty
          candidates. Concrete beats comprehensive.
        </p>

        <h3>9. What is the failure you have not fixed?</h3>
        <p>
          The trust question. Every real system has one. Naming yours precisely, with a rough
          frequency and why you deprioritised it, reads as engineering judgement. Claiming there
          is none reads as not having looked.
        </p>
      </Section>

      <Section title="Scoping" label="Six weeks">
        <p>
          Pick a corpus you actually care about and that has awkward structure: tables,
          footnotes, near-duplicate revisions. A clean corpus makes the project easy and the
          interview boring.
        </p>

        <ul>
          <li>
            <strong>Weeks 1 to 2</strong> Ingestion and chunking, and the labelled question set.
            The question set first, so that everything after it is measurable.
          </li>
          <li>
            <strong>Weeks 3 to 4</strong> The harness, the baseline numbers, and then two or
            three genuine experiments (chunk sweep, hybrid retrieval, a re-ranker). Record the
            ones that did not work; those are the interesting half of the design doc.
          </li>
          <li>
            <strong>Week 5</strong> Serve it behind an API, add the CI regression gate.
          </li>
          <li>
            <strong>Week 6</strong> The README, the architecture diagram, and the design
            document. Not optional, and not fifteen minutes of work.
          </li>
        </ul>

        <p>
          All of it runs on free tiers: a hosted inference endpoint for generation, a free
          embeddings API, and Postgres with pgvector. The{" "}
          <Link href="/writing/ml-portfolio-free-tier-stack">stack breakdown is here</Link>, and
          the wider question of{" "}
          <Link href="/writing/ai-engineer-portfolio-projects">
            which projects to build for which role
          </Link>{" "}
          is here.
        </p>
      </Section>

      <NextStep line="This is one of sixteen project specs in the playbook. Each one is scoped to six weeks, on a free stack, and comes with the interview questions it prepares you for." />
    </>
  )
}
