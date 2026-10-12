import type { TravelPhoto } from '@/types/travel';

/** 帧号差不超过该值视为同一段高速连拍（中间可能删过废片） */
export const BURST_MAX_FRAME_GAP = 2;

/**
 * Parse a camera frame reference like "dkx05241" -> { prefix: "dkx", num: 5241 }.
 * Only long numeric sequences (>= 4 digits) count as camera shutter numbers;
 * short manual ids like "lz01" / "ckv03" are hand-picked shots and never grouped.
 */
export function parseFrameRef(id: string): { prefix: string; num: number } | null {
  const m = /^([a-zA-Z]+)(\d{4,})$/.exec(id);
  return m ? { prefix: m[1].toLowerCase(), num: Number(m[2]) } : null;
}

/**
 * Collapse high-speed burst runs and explicit "same scene" groups into single
 * representative photos.
 *
 * 1. Photos sharing a `group` id (same date + city + trip) form one stack; the
 *    first member in list order is the representative. This covers hand-renamed
 *    series like "lz13"/"ck04" that are visually repetitive but have no camera
 *    frame numbers.
 * 2. Remaining photos are grouped by date + city + trip + camera series; inside
 *    a group, consecutive frame numbers (gap <= BURST_MAX_FRAME_GAP) form one
 *    burst run. Runs of 2+ frames keep only their middle frame, with every
 *    frame of the run attached as `burst` (shooting order).
 *
 * The representative stays at the run's original list position; all other
 * frames are hidden from grids and reachable via the lightbox only.
 */
export function collapseBursts(photos: TravelPhoto[]): TravelPhoto[] {
  // Non-representative frames to drop from the visible list
  const hidden = new Set<string>();
  // Representative id -> all frames of the stack in shooting order
  const burstOf = new Map<string, TravelPhoto[]>();
  const kindOf = new Map<string, 'burst' | 'group'>();

  // 1) Explicit groups
  const groups = new Map<string, TravelPhoto[]>();
  const grouped = new Set<string>();
  photos.forEach((photo) => {
    if (!photo.group) return;
    const key = `${photo.date}|${photo.city}|${photo.trip ?? ''}|${photo.group}`;
    const list = groups.get(key) ?? [];
    list.push(photo);
    groups.set(key, list);
    grouped.add(photo.id);
  });
  for (const list of groups.values()) {
    if (list.length < 2) continue;
    burstOf.set(list[0].id, list);
    kindOf.set(list[0].id, 'group');
    for (const p of list.slice(1)) hidden.add(p.id);
  }

  // 2) Camera frame bursts (skip photos already placed in an explicit group,
  //    and `solo` photos that must stay individually visible)
  const runs = new Map<string, { photo: TravelPhoto; num: number }[]>();
  photos.forEach((photo) => {
    if (grouped.has(photo.id) || photo.solo) return;
    const ref = parseFrameRef(photo.id);
    if (!ref) return;
    const key = `${photo.date}|${photo.city}|${photo.trip ?? ''}|${ref.prefix}`;
    const list = runs.get(key) ?? [];
    list.push({ photo, num: ref.num });
    runs.set(key, list);
  });

  for (const list of runs.values()) {
    if (list.length < 2) continue;
    const sorted = [...list].sort((a, b) => a.num - b.num);
    let run = [sorted[0]];
    const flush = () => {
      if (run.length < 2) return;
      const middle = run[Math.floor(run.length / 2)];
      burstOf.set(
        middle.photo.id,
        run.map((r) => r.photo),
      );
      kindOf.set(middle.photo.id, 'burst');
      for (const r of run) {
        if (r.photo.id !== middle.photo.id) hidden.add(r.photo.id);
      }
    };
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].num - sorted[i - 1].num <= BURST_MAX_FRAME_GAP) {
        run.push(sorted[i]);
      } else {
        flush();
        run = [sorted[i]];
      }
    }
    flush();
  }

  return photos
    .filter((p) => !hidden.has(p.id))
    .map((p) => {
      const burst = burstOf.get(p.id);
      return burst ? { ...p, burst, stackKind: kindOf.get(p.id) } : p;
    });
}

/** Total number of shots a photo list represents (burst frames included). */
export function countPhotos(photos: TravelPhoto[]): number {
  return photos.reduce((n, p) => n + (p.burst?.length ?? 1), 0);
}
