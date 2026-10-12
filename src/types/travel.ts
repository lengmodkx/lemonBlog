/** A single travel photo with location metadata. */
export interface TravelPhoto {
  /** Unique id (also used as React key). */
  id: string;
  /** Full-size image URL (RustFS or local /travel/...). */
  src: string;
  /** Optional thumbnail URL; falls back to src. */
  thumb?: string;
  /** Taken date, YYYY-MM-DD. */
  date: string;
  /** City name in Chinese, e.g. "杭州". */
  city: string;
  /** Province name, must match the map region name, e.g. "浙江省". */
  province: string;
  /** [lng, lat] of the city. Auto-filled from city-coords when omitted. */
  coords?: [number, number];
  /** Optional caption shown in the timeline and lightbox. */
  caption?: string;
  /** Optional trip id this photo belongs to. */
  trip?: string;
  /** Intrinsic size of the web image (for masonry layout without reflow). */
  width?: number;
  height?: number;
  /**
   * Explicit "same scene" group id. Photos sharing a group (and date/city) are
   * collapsed into one stack even when their ids are not camera frame numbers —
   * for hand-renamed series like "lz13"/"ck04". The first photo of the group in
   * list order becomes the representative.
   */
  group?: string;
  /**
   * Never collapse this photo into a burst/group stack — each photo stays
   * visible on its own. Used for portraits and other shots the author wants
   * shown individually.
   */
  solo?: boolean;
  /**
   * All frames of the same stack (including this photo), in shooting order.
   * Filled for both camera frame bursts and explicit `group` stacks. Only the
   * representative carries this field; other frames are hidden from grids and
   * only reachable via the lightbox.
   */
  burst?: TravelPhoto[];
  /** How the stack was formed: camera frame burst or explicit `group`. */
  stackKind?: 'burst' | 'group';
}

/** A trip groups photos taken in one journey. */
export interface TravelTrip {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  description?: string;
  /** Cities passed on this trip; all of them light up on the map. */
  cities?: string[];
  /** Preferred cover photo id; defaults to the first landscape photo. */
  cover?: string;
}

/** A travel video (e.g. drone footage) shown inside a trip chapter. */
export interface TravelVideo {
  id: string;
  /** Video URL (mp4). */
  src: string;
  /** Taken date, YYYY-MM-DD. */
  date: string;
  city: string;
  province: string;
  trip?: string;
  /** Optional title shown on the card. */
  title?: string;
  /** Optional file size label, e.g. "132 MB". */
  size?: string;
}

export interface TravelData {
  trips: TravelTrip[];
  photos: TravelPhoto[];
  videos: TravelVideo[];
}

/** One city aggregated on the map. */
export interface CityMarker {
  city: string;
  province: string;
  coords: [number, number];
  photos: TravelPhoto[];
  /** Earliest/latest photo date of this city. */
  firstDate: string;
  lastDate: string;
}

/** One province aggregated on the map. */
export interface ProvinceStats {
  province: string;
  photoCount: number;
  cities: string[];
}

/** Photos grouped by day for the timeline view. */
export interface TimelineMonth {
  /** YYYY-MM-DD */
  key: string;
  photos: TravelPhoto[];
}

export interface TravelStats {
  photoCount: number;
  cityCount: number;
  provinceCount: number;
  /** First and last photo date. */
  startDate?: string;
  endDate?: string;
}
