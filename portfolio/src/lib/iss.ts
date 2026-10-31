/** Live International Space Station position via the public wheretheiss.at API (no key). */
export type IssFix = { lat: number; lon: number; altKm: number; speedKmh: number; over: string }

const regionNames = typeof Intl !== 'undefined' && 'DisplayNames' in Intl ? new Intl.DisplayNames(['en'], { type: 'region' }) : null

export async function fetchIss(signal?: AbortSignal): Promise<IssFix> {
  const res = await fetch('https://api.wheretheiss.at/v1/satellites/25544', { signal })
  if (!res.ok) throw new Error('ISS position unavailable')
  const p = (await res.json()) as { latitude: number; longitude: number; altitude: number; velocity: number }
  let over = 'the ocean'
  try {
    const c = await fetch(`https://api.wheretheiss.at/v1/coordinates/${p.latitude.toFixed(3)},${p.longitude.toFixed(3)}`, { signal })
    if (c.ok) {
      const j = (await c.json()) as { country_code?: string }
      if (j.country_code && j.country_code !== '??') over = regionNames?.of(j.country_code) ?? j.country_code
    }
  } catch {
    /* keep "the ocean" */
  }
  return { lat: p.latitude, lon: p.longitude, altKm: p.altitude, speedKmh: p.velocity, over }
}
