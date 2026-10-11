/**
 * 精简阿里 DataV 的中国省级边界 GeoJSON，生成轻量地图数据。
 *
 * 用法:
 *   node scripts/simplify-china-geo.mjs <source.json> [output.json]
 *
 * source 默认从环境变量 CHINA_GEO_SRC 读取，output 默认 src/data/china-geo.json。
 * 数据来源: https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json
 */
import fs from 'fs';
import path from 'path';

const src = process.argv[2] || process.env.CHINA_GEO_SRC;
const out = process.argv[3] || path.join(process.cwd(), 'src/data/china-geo.json');

if (!src) {
  console.error('Usage: node scripts/simplify-china-geo.mjs <source.json> [output.json]');
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(src, 'utf8'));

/** Round coordinates to 4 decimals (~11m) to shrink the payload. */
function roundCoords(coords) {
  if (typeof coords === 'number') return Math.round(coords * 1e4) / 1e4;
  return coords.map(roundCoords);
}

/** Perpendicular distance from p to segment [a, b]. */
function segDist(p, a, b) {
  const [x, y] = p;
  const [x1, y1] = a;
  const [x2, y2] = b;
  const dx = x2 - x1;
  const dy = y2 - y1;
  if (dx === 0 && dy === 0) return Math.hypot(x - x1, y - y1);
  const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy));
}

/** Douglas-Peucker line simplification (keeps first/last point). */
function simplify(points, tol) {
  if (points.length <= 4) return points;
  let maxDist = 0;
  let idx = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const d = segDist(points[i], points[0], points[points.length - 1]);
    if (d > maxDist) {
      maxDist = d;
      idx = i;
    }
  }
  if (maxDist <= tol) return [points[0], points[points.length - 1]];
  const left = simplify(points.slice(0, idx + 1), tol);
  const right = simplify(points.slice(idx), tol);
  return left.slice(0, -1).concat(right);
}

/** Simplify a ring (closed polygon), preserving closure. */
function simplifyRing(ring, tol) {
  const simplified = simplify(ring, tol);
  const out = simplified.length >= 3 ? simplified : ring;
  return [...out, out[0]];
}

const TOLERANCE = 0.01; // degrees, ~1km

function simplifyGeometry(geometry) {
  const simplifyPoly = (poly) => poly.map((ring) => simplifyRing(ring, TOLERANCE));
  if (geometry.type === 'MultiPolygon') {
    return { type: 'MultiPolygon', coordinates: roundCoords(geometry.coordinates.map(simplifyPoly)) };
  }
  return { type: 'Polygon', coordinates: roundCoords(simplifyPoly(geometry.coordinates)) };
}

const features = raw.features.map((f) => ({
  type: 'Feature',
  properties: {
    name: f.properties?.name || '南海诸岛',
    adcode: f.properties?.adcode,
  },
  geometry: simplifyGeometry(f.geometry),
}));

const geo = { type: 'FeatureCollection', features };

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(geo), 'utf8');

console.log(`features: ${features.length}`);
console.log(`names: ${features.map((f) => f.properties.name).join(', ')}`);
console.log(`written: ${out} (${fs.statSync(out).size} bytes)`);
