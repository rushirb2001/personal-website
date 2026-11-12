// Closes the overlay on any soft navigation that is not another case study.
//
// A parallel-route slot keeps rendering its last matched page until something
// else matches it. The case-study overlay now links out (to /projects, /hire,
// /resume), and without this file following one of those links would change
// the page underneath while the modal stayed open on top of it. A catch-all
// that renders nothing gives the slot something to match for every other URL.
// The more specific (.)projects/[slug] interception still wins for case
// studies, and default.tsx still covers the hard-navigation case.
export default function ModalCatchAll() {
  return null
}
