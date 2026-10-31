/**
 * Minimal positional astronomy for the homepage sky: where J2000 stars sit above New Delhi right now.
 * Accuracy is a fraction of a degree, which is plenty for a background.
 */

export const OBSERVER = { name: 'New Delhi', lat: 28.6139, lon: 77.209 }

export type SkyData = {
  stars: [number, number, number, number][]
  constellations: { id: string; name: string; lines: [number, number][][] }[]
}

const RAD = Math.PI / 180

/** Local sidereal time in degrees for a longitude (east positive). */
export function localSiderealDeg(date: Date, lonDeg: number) {
  const jd = date.getTime() / 86400000 + 2440587.5
  const d = jd - 2451545.0
  const gmst = 280.46061837 + 360.98564736629 * d
  return (((gmst + lonDeg) % 360) + 360) % 360
}

/** Altitude/azimuth in radians for RA/Dec in degrees. Azimuth measured from north through east. */
export function altAz(raDeg: number, decDeg: number, lstDeg: number, latDeg: number) {
  const ha = (lstDeg - raDeg) * RAD
  const dec = decDeg * RAD
  const lat = latDeg * RAD
  const sinAlt = Math.sin(dec) * Math.sin(lat) + Math.cos(dec) * Math.cos(lat) * Math.cos(ha)
  const alt = Math.asin(sinAlt)
  const cosAz = (Math.sin(dec) - sinAlt * Math.sin(lat)) / (Math.cos(alt) * Math.cos(lat))
  let az = Math.acos(Math.max(-1, Math.min(1, cosAz)))
  if (Math.sin(ha) > 0) az = 2 * Math.PI - az
  return { alt, az }
}

/**
 * Stereographic projection of the sky dome looking straight up, south at the bottom of the screen.
 * Returns null for points below the horizon.
 */
export function project(alt: number, az: number, cx: number, cy: number, scale: number) {
  if (alt < 0) return null
  const zen = Math.PI / 2 - alt
  const r = scale * Math.tan(zen / 2)
  // looking up with north at the top: east appears on the left
  return { x: cx - r * Math.sin(az), y: cy - r * Math.cos(az) }
}

/** Rough RGB for a B–V colour index: blue-white hot stars to orange cool ones. */
export function starColor(bv: number) {
  if (bv < 0) return '190,215,255'
  if (bv < 0.4) return '235,240,255'
  if (bv < 0.8) return '255,245,225'
  if (bv < 1.3) return '255,220,170'
  return '255,190,140'
}
