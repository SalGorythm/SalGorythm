/**
 * The hidden Golden Record page (/golden-record). Reached by typing "golden record" anywhere,
 * or `golden record` in the mission console. Edit these freely: they are a draft, written from
 * the themes of the site and the articles.
 */
export const GOLDEN_RECORD_PRINCIPLES: { title: string; body: string }[] = [
  {
    title: 'Ship, don’t just build',
    body: 'Work isn’t done when it compiles. It’s done when it’s live, measured and handed over to the people who use it.',
  },
  {
    title: 'One owner, no handoffs',
    body: 'The fewer times a problem changes hands, the less of it gets lost. I’d rather carry it from sketch to production myself.',
  },
  {
    title: 'Evals before production',
    body: 'An AI feature without an evaluation is a demo. Decide what “good” means, test for it, and gate releases on it.',
  },
  {
    title: 'Prompts are code',
    body: 'Schema-first, reviewed, versioned and regression-tested, like everything else that runs in production.',
  },
  {
    title: 'Verify before you merge',
    body: 'Tools make writing code fast. Reading it, testing it and being able to defend it on Monday is still my job.',
  },
  {
    title: 'Privacy by default',
    body: 'My own apps have no ads, no accounts and no tracking. Data stays on the device unless there is a real reason to move it.',
  },
  {
    title: 'Write it down',
    body: 'If I learned something the hard way, I write it up, so the next person doesn’t have to.',
  },
]
