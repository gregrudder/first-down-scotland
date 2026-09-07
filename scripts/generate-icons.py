#!/usr/bin/env python3
"""Generate simple high-contrast PWA icons without extra dependencies."""

from __future__ import annotations

import struct
import zlib
from pathlib import Path

NAVY = (11, 18, 32, 255)
GOLD = (232, 184, 74, 255)
CREAM = (244, 239, 228, 255)


def write_png(path: Path, pixels: list[list[tuple[int, int, int, int]]]) -> None:
    height = len(pixels)
    width = len(pixels[0])
    raw = bytearray()
    for row in pixels:
        raw.append(0)
        for r, g, b, a in row:
            raw.extend((r, g, b, a))

    def chunk(tag: bytes, data: bytes) -> bytes:
        return (
            struct.pack(">I", len(data))
            + tag
            + data
            + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
        )

    path.write_bytes(
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(bytes(raw), 9))
        + chunk(b"IEND", b"")
    )


def draw_mark(size: int, padding: int = 0) -> list[list[tuple[int, int, int, int]]]:
    pixels = [[NAVY for _ in range(size)] for _ in range(size)]
    inner = size - padding * 2

    def set_px(x: int, y: int, colour: tuple[int, int, int, int]) -> None:
        if 0 <= x < size and 0 <= y < size:
            pixels[y][x] = colour

    # Rounded-ish navy already fills the canvas.
    # Gold first-down line.
    line_y = padding + int(inner * 0.62)
    line_h = max(3, size // 28)
    inset = padding + int(inner * 0.12)
    for y in range(line_y, line_y + line_h):
        for x in range(inset, size - inset):
            set_px(x, y, GOLD)

    # Yard hashes on the line.
    hash_w = max(2, size // 64)
    hash_h = max(6, size // 18)
    step = max(8, inner // 8)
    for x in range(inset, size - inset, step):
        for yy in range(line_y - hash_h, line_y):
            for xx in range(x, x + hash_w):
                set_px(xx, yy, GOLD)

    # Blocky "1D" mark above the line.
    glyph_top = padding + int(inner * 0.18)
    glyph_h = int(inner * 0.32)
    stroke = max(4, size // 18)
    left = padding + int(inner * 0.22)
    # 1
    for y in range(glyph_top, glyph_top + glyph_h):
        for x in range(left, left + stroke):
            set_px(x, y, CREAM)
    for y in range(glyph_top, glyph_top + stroke):
        for x in range(left - stroke, left + stroke):
            set_px(x, y, CREAM)

    # D
    d_left = left + stroke * 2 + max(6, size // 20)
    d_width = int(inner * 0.22)
    for y in range(glyph_top, glyph_top + glyph_h):
        for x in range(d_left, d_left + stroke):
            set_px(x, y, GOLD)
    for x in range(d_left, d_left + d_width):
        for y in range(glyph_top, glyph_top + stroke):
            set_px(x, y, GOLD)
        for y in range(glyph_top + glyph_h - stroke, glyph_top + glyph_h):
            set_px(x, y, GOLD)
    for y in range(glyph_top + stroke, glyph_top + glyph_h - stroke):
        for x in range(d_left + d_width - stroke, d_left + d_width):
            set_px(x, y, GOLD)

    return pixels


def main() -> None:
    out = Path("public/icons")
    out.mkdir(parents=True, exist_ok=True)
    write_png(out / "icon-192.png", draw_mark(192))
    write_png(out / "icon-512.png", draw_mark(512))
    write_png(out / "icon-maskable-512.png", draw_mark(512, padding=56))
    write_png(out / "apple-touch-icon.png", draw_mark(180))
    write_png(Path("public/favicon.png"), draw_mark(48))
    print("Wrote PWA icons to public/icons")


if __name__ == "__main__":
    main()
