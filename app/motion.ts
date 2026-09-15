// One motion language for the whole site.
//
// Three rules, each the fix for a class of jank the motion probe measured
// (`pnpm motion`, docs/profiling.md §4):
//
// 1. Springs, not fixed curves. A spring retargets from its current position
//    AND velocity when interrupted, so a second click mid-flight bends the
//    motion instead of restarting a curve from rest. Springs are specified by
//    perceived duration + bounce (Motion's visualDuration), which is how the
//    old durations were thought about anyway.
//
// 2. Compositor-only. Motion hardware-accelerates `opacity` and a full
//    `transform` STRING through WAAPI; its independent `x`/`y`/`scale`
//    shorthands are written from JS every frame and stall with the main
//    thread. Everything here animates transform strings and opacity only.
//
// 3. CSS and JS share the same curves. `css.*` compiles each spring to a CSS
//    `linear()` easing at module load, so hand-rolled transitions and
//    keyframes (the accordion, the modal, the playbook) move on exactly the
//    springs Motion uses, with zero runtime cost.

// `spring` comes from the framework-free entry so this module stays importable
// from server components (the playbook's <style> is server-rendered);
// "motion/react" creates React contexts at module load and would crash there.
import { spring } from "motion"
import type { Transition, Variants } from "motion/react"

type SpringSpec = { visualDuration: number; bounce: number }

const SPECS = {
  /** Small UI feedback: indicators, pills, press states. */
  ui: { visualDuration: 0.26, bounce: 0.12 },
  /** Content entering: hero, rows, section content. */
  reveal: { visualDuration: 0.5, bounce: 0 },
  /** Large surfaces: the case-study card, the diagram zoom. */
  surface: { visualDuration: 0.4, bounce: 0.06 },
} satisfies Record<string, SpringSpec>

export type SpringName = keyof typeof SPECS

export const springs = Object.fromEntries(
  Object.entries(SPECS).map(([k, s]) => [k, { type: "spring", ...s }]),
) as Record<SpringName, Transition>

/** Exits are quick, non-bouncy and accelerate away: nothing should linger. */
export const exit: Transition = { duration: 0.18, ease: [0.4, 0, 1, 1] }

/**
 * The same springs as CSS: `"<ms>ms linear(...)"`, ready for the timing slot of
 * a `transition` or `animation` shorthand. The duration is the spring's full
 * settle time, which runs longer than its visualDuration by design.
 */
const compiled = Object.fromEntries(
  Object.entries(SPECS).map(([k, s]) => {
    const str = spring(s.visualDuration, s.bounce).toString() // "900ms linear(...)"
    return [k, { str, duration: parseFloat(str), easing: str.slice(str.indexOf("linear(")) }]
  }),
) as Record<SpringName, { str: string; duration: number; easing: string }>

const pick = <T>(f: (c: (typeof compiled)[SpringName]) => T) =>
  Object.fromEntries(Object.entries(compiled).map(([k, c]) => [k, f(c)])) as Record<SpringName, T>

export const css = pick((c) => c.str)

/**
 * Just the easing curve of a spring, for choreography that must keep a fixed
 * duration (the accordion's 350ms collapse is load-bearing for its 380ms
 * scroll timing). The curve is the spring's own shape compressed into the
 * given duration.
 */
export const cssEase = pick((c) => c.easing)

/** A spring as Web Animations timing: `el.animate(keyframes, { ...waapi.surface })`. */
export const waapi = pick((c) => ({ duration: c.duration, easing: c.easing }))

/**
 * Compositor-only rise-in. `distance` in px. The container orchestrates
 * children with `stagger`; `delayChildren` must stay 0 for any container whose
 * children include the LCP element (a delay is added straight to LCP).
 */
export function rise(distance = 10, spec: SpringName = "reveal"): Variants {
  return {
    hidden: { opacity: 0, transform: `translateY(${distance}px)` },
    visible: { opacity: 1, transform: "translateY(0px)", transition: springs[spec] },
  }
}

export function stagger(each: number, delayChildren = 0): Variants {
  return { hidden: {}, visible: { transition: { staggerChildren: each, delayChildren } } }
}
