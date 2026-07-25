/** Composed social post: title + blurb + link (LinkedIn paste / Copy post). */
export function buildArticleSharePost(title: string, shareBlurb: string, url: string): string {
  return `${title} — ${shareBlurb}\n\n${url}`
}

/** X intent `text` — short one-liner; URL is passed separately. */
export function buildArticleShareTweetText(title: string, shareBlurb: string): string {
  return `${title} — ${shareBlurb}`
}
