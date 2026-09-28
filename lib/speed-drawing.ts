export type SpeedDrawingKind = "youtube" | "video";

export interface SpeedDrawingSource {
  kind: SpeedDrawingKind;
  /** YouTube video id for "youtube"; the original src for "video". */
  id: string;
}

/** Extracts a YouTube video id from a watch/share/embed URL, or null if it isn't one. */
function youtubeId(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null; // not an absolute URL -> treat as a local file path
  }

  if (parsed.hostname === "youtu.be") return parsed.pathname.slice(1) || null;

  if (parsed.hostname === "youtube.com" || parsed.hostname.endsWith(".youtube.com")) {
    if (parsed.pathname === "/watch") return parsed.searchParams.get("v");
    const embedMatch = /^\/embed\/([^/]+)/.exec(parsed.pathname);
    if (embedMatch) return embedMatch[1];
  }

  return null;
}

/**
 * Decides how to render a speed drawing.
 *
 * Screen recordings routinely run to hundreds of MB, well past what's sane
 * to commit to the repo or serve from Vercel — an unlisted YouTube link is
 * the recommended path for anything but a short clip. A path starting with
 * "/" (public/illustrations/...) is treated as a local, self-hosted file.
 */
export function resolveSpeedDrawing(src: string): SpeedDrawingSource {
  const id = youtubeId(src);
  return id ? { kind: "youtube", id } : { kind: "video", id: src };
}
