import { describe, expect, it } from "vitest";
import { resolveSpeedDrawing } from "./speed-drawing";

describe("resolveSpeedDrawing", () => {
  it("reads the id out of a youtube.com watch URL", () => {
    expect(resolveSpeedDrawing("https://www.youtube.com/watch?v=abc123XYZ_-")).toEqual({
      kind: "youtube",
      id: "abc123XYZ_-",
    });
  });

  it("reads the id out of a youtu.be short link", () => {
    expect(resolveSpeedDrawing("https://youtu.be/abc123")).toEqual({
      kind: "youtube",
      id: "abc123",
    });
  });

  it("reads the id out of a youtube.com embed URL", () => {
    expect(resolveSpeedDrawing("https://www.youtube.com/embed/abc123?rel=0")).toEqual({
      kind: "youtube",
      id: "abc123",
    });
  });

  it("treats a local path as a self-hosted video", () => {
    expect(resolveSpeedDrawing("/illustrations/character-concept-speed.mp4")).toEqual({
      kind: "video",
      id: "/illustrations/character-concept-speed.mp4",
    });
  });

  it("treats an unrelated absolute URL as a self-hosted video", () => {
    const url = "https://cdn.example.com/clip.mp4";
    expect(resolveSpeedDrawing(url)).toEqual({ kind: "video", id: url });
  });

  it("returns null for a watch URL missing the v= param instead of throwing", () => {
    expect(resolveSpeedDrawing("https://www.youtube.com/watch?list=abc")).toEqual({
      kind: "video",
      id: "https://www.youtube.com/watch?list=abc",
    });
  });
});
