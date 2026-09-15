// Named, repeatable interaction flows. Each scenario owns its whole setup, so
// any one can run alone and a failure in one never poisons the next.
//
// Shape:
//   name         "<surface>.<flow>", used by --scenario (prefix match: "home")
//   description  what a visitor does
//   load         true = the measurement window starts at navigation (entrances)
//   route        for load scenarios, the page to navigate to
//   setup(page)  unmeasured preparation (navigate, open prerequisites, reveal)
//   act(page)    the measured interaction; recording starts immediately before
//   windowMs     how long to keep recording after act() resolves
//   verify(page) end-state assertion, run AFTER recording stops so polling can
//                never perturb the frames being graded
//   track        selectors whose geometry/opacity is sampled per frame in the
//                trajectory pass (snap, reversal and settle analysis)
//
// Adding a flow: copy the closest scenario, keep setup deterministic (instant
// scrolls, explicit waits), and make verify() prove the interaction happened.

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const NAV = 'nav[aria-label="Page sections"]'

async function openSection(page, id) {
  await page.click(`#${id} > button`)
  await page.waitFor((sid) => document.getElementById(`${sid}-content`)?.dataset.open === "true", { label: `${id} open` }, id)
  await page.settleScroll()
  await sleep(600) // row stagger
}

const sectionOpen = (page, id) =>
  page.waitFor((sid) => document.getElementById(`${sid}-content`)?.dataset.open === "true", { label: `${id} open`, timeout: 3000 }, id)

async function openCaseStudyOverlay(page, slug) {
  await page.goto("/")
  await openSection(page, "projects")
  await page.reveal(`#project-${slug}`)
  await page.click(`#project-${slug} a[href="/projects/${slug}"]`)
  await page.waitFor(() => !!document.querySelector(".modal-card"), { label: "modal mounted", timeout: 8000 })
  await sleep(900)
}

export const SCENARIOS = [
  // ── Home ────────────────────────────────────────────────────────────────
  {
    name: "home.load",
    description: "Landing entrance: hero stagger, section heads, footer",
    load: true,
    route: "/",
    windowMs: 1600,
    track: ["main h1", "#experience > button", "main footer"],
  },
  {
    name: "home.open",
    description: "Open Experience from the closed landing",
    setup: (p) => p.goto("/"),
    act: (p) => p.click("#experience > button"),
    windowMs: 1600,
    verify: (p) => sectionOpen(p, "experience"),
    track: ["main h1", "#experience > button", "#experience-content", "main footer"],
  },
  {
    name: "home.switch-down",
    description: "Experience open, jump to Projects from the top nav",
    setup: async (p) => {
      await p.goto("/")
      await openSection(p, "experience")
    },
    act: (p) => p.click(`${NAV} a[href="#projects"]`),
    windowMs: 1800,
    verify: (p) => sectionOpen(p, "projects"),
    track: ["#projects > button", "#experience-content", "#projects-content"],
  },
  {
    name: "home.switch-up",
    description: "Projects open, jump up to Experience from the top nav",
    setup: async (p) => {
      await p.goto("/")
      await openSection(p, "projects")
    },
    act: (p) => p.click(`${NAV} a[href="#experience"]`),
    windowMs: 2400,
    verify: (p) => sectionOpen(p, "experience"),
    track: ["#experience > button", "#experience-content", "#projects-content"],
  },
  {
    name: "home.close",
    description: "Experience open, return home from the top nav",
    setup: async (p) => {
      await p.goto("/")
      await openSection(p, "experience")
    },
    act: (p) => p.click(`${NAV} a[href="/"]`),
    windowMs: 2400,
    verify: (p) =>
      p.waitFor(() => ![...document.querySelectorAll("[data-open]")].some((el) => el.dataset.open === "true") && scrollY < 5, {
        label: "all sections closed at top",
        timeout: 3000,
      }),
    track: ["main h1", "#experience-content", "main footer"],
  },
  {
    name: "home.scroll-open",
    description: "Scroll through the open Projects list",
    setup: async (p) => {
      await p.goto("/")
      await openSection(p, "projects")
    },
    act: (p) => p.scrollGesture({ distance: 1400 }),
    windowMs: 400,
    track: ["#projects > button"],
  },

  // ── Case study ──────────────────────────────────────────────────────────
  {
    name: "case.open",
    description: "Open a case study over the home page (intercepted route)",
    setup: async (p) => {
      await p.goto("/")
      await openSection(p, "projects")
      await p.reveal("#project-hybridflow")
    },
    act: (p) => p.click('#project-hybridflow a[href="/projects/hybridflow"]'),
    windowMs: 1200,
    verify: (p) =>
      p.waitFor(() => location.pathname === "/projects/hybridflow" && !!document.querySelector(".modal-card"), {
        label: "overlay modal open",
      }),
    track: [".modal-backdrop", ".modal-card"],
  },
  {
    name: "case.close",
    description: "Dismiss the overlay case study with Escape",
    setup: (p) => openCaseStudyOverlay(p, "hybridflow"),
    act: (p) => p.key("Escape"),
    windowMs: 1000,
    verify: (p) =>
      p.waitFor(() => location.pathname === "/" && !document.querySelector(".modal-card"), { label: "back on home" }),
    track: [".modal-backdrop", ".modal-card"],
  },
  {
    name: "case.zoom-open",
    description: "Enlarge the architecture diagram",
    setup: async (p) => {
      await p.goto("/projects/hybridflow")
      await p.reveal('button[aria-label="Enlarge architecture diagram"]')
    },
    act: (p) => p.click('button[aria-label="Enlarge architecture diagram"]'),
    windowMs: 900,
    verify: (p) => p.waitFor(() => !!document.querySelector(".modal-zoom"), { label: "zoom open" }),
    track: [".modal-zoom", ".modal-zoom svg"],
  },
  {
    name: "case.zoom-close",
    description: "Shrink the enlarged diagram back with Escape",
    setup: async (p) => {
      await p.goto("/projects/hybridflow")
      await p.reveal('button[aria-label="Enlarge architecture diagram"]')
      await p.click('button[aria-label="Enlarge architecture diagram"]')
      await p.waitFor(() => !!document.querySelector(".modal-zoom"), { label: "zoom open" })
      await sleep(700)
    },
    act: (p) => p.key("Escape"),
    windowMs: 900,
    verify: (p) =>
      p.waitFor(() => !document.querySelector(".modal-zoom") && location.pathname === "/projects/hybridflow", {
        label: "zoom closed, modal still open",
      }),
    track: [".modal-zoom", ".modal-zoom svg"],
  },
  {
    name: "case.scroll",
    description: "Read down a case study",
    setup: (p) => p.goto("/projects/mace-pinn"),
    act: (p) => p.scrollGesture({ distance: 2500 }),
    windowMs: 400,
    track: ["#cs-the-problem", "#cs-the-design"],
  },
  {
    name: "case.carousel",
    description: "Advance the results carousel",
    setup: async (p) => {
      await p.goto("/projects/mace-pinn")
      await p.reveal('[aria-roledescription="carousel"]')
    },
    act: (p) => p.click('button[aria-label="Next artifact"]'),
    windowMs: 1000,
    verify: (p) =>
      p.waitFor(
        () => document.querySelector('[aria-roledescription="carousel"] [aria-current="true"]')?.getAttribute("aria-label")?.startsWith("Show artifact 2"),
        { label: "carousel on slide 2" },
      ),
    track: ['[aria-roledescription="carousel"] figure > div', '[aria-roledescription="carousel"] figcaption'],
  },

  // ── Playbook ────────────────────────────────────────────────────────────
  {
    name: "playbook.load",
    description: "Playbook entrance and hero shimmer",
    load: true,
    route: "/playbook",
    windowMs: 1600,
    track: ["main h1"],
  },
  {
    name: "playbook.scroll",
    description: "Scroll the playbook sales page",
    setup: (p) => p.goto("/playbook"),
    act: (p) => p.scrollGesture({ distance: 3000 }),
    windowMs: 400,
    track: [".pb-bar"],
  },
]

export function selectScenarios(filter) {
  if (!filter) return SCENARIOS
  const wanted = filter.split(",").map((s) => s.trim()).filter(Boolean)
  const picked = SCENARIOS.filter((sc) => wanted.some((w) => sc.name === w || sc.name.startsWith(w.replace(/\*$/, "").replace(/\.$/, "") + ".")))
  const unknown = wanted.filter((w) => !SCENARIOS.some((sc) => sc.name === w || sc.name.startsWith(w.replace(/\*$/, "").replace(/\.$/, "") + ".")))
  if (unknown.length) throw new Error(`Unknown scenario(s): ${unknown.join(", ")}. Run with --list.`)
  return picked
}
