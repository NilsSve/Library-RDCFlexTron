"""Generate Bitmaps/RDCFlexTron/Lt/*.ico, the light-theme icons, from Bitmaps/RDCFlexTron/Dk/*.ico.

Run it after adding or changing a dark icon, look at the result, and commit both folders:

    python Tools/MakeLightIcons.py

WHAT IT DOES: every frame of every dark icon (all are 32-bit, with an alpha channel) is recoloured pixel by
pixel; nothing else in the file changes - the sizes, the order of the frames, the transparency.

- A grey, white or black pixel (saturation under 0.15) has its lightness turned around: the light strokes
  that read on a dark toolbar become dark ones that read on a light toolbar. White becomes #2B2B2B, the light
  grey of most dark icons (#D5D5D5) about #525252, and a dark grey part becomes a light one.
- A coloured pixel keeps its hue and saturation, and is darkened - only when it must be - until its contrast
  with white is at least 4:1 (WCAG relative luminance). The blue of the find icons, #1F9CDB, becomes about
  #1680B6. The test is a contrast, not a colour: it reads the same for a reader who cannot tell red from green.

A light icon that should look different from its dark one can be drawn by hand in Lt instead: leave its name
out of the dark folder's list below (HAND_DRAWN), and this tool leaves the Lt file alone.
"""
import colorsys
import os
import struct
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DARK = os.path.join(ROOT, 'Bitmaps', 'RDCFlexTron', 'Dk')
LIGHT = os.path.join(ROOT, 'Bitmaps', 'RDCFlexTron', 'Lt')

# Light icons drawn by hand: not written by this tool.
HAND_DRAWN = set()

MIN_CONTRAST = 4.0


def luminance(r, g, b):
    def lin(c):
        c = c / 255.0
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)


def contrast_with_white(r, g, b):
    return 1.05 / (luminance(r, g, b) + 0.05)


def light_pixel(r, g, b):
    h, l, s = colorsys.rgb_to_hls(r / 255.0, g / 255.0, b / 255.0)
    if s < 0.15:
        l = 0.92 - 0.75 * l
        v = round(max(0.0, min(1.0, l)) * 255)
        return v, v, v
    while contrast_with_white(r, g, b) < MIN_CONTRAST and l > 0.05:
        l -= 0.01
        rf, gf, bf = colorsys.hls_to_rgb(h, l, s)
        r, g, b = round(rf * 255), round(gf * 255), round(bf * 255)
    return r, g, b


def make_light(data):
    data = bytearray(data)
    count = struct.unpack_from('<H', data, 4)[0]
    for i in range(count):
        w, h, _cc, _res, _planes, _bpp, _size, off = struct.unpack_from('<BBBBHHII', data, 6 + 16 * i)
        w = w or 256
        h = h or 256
        if data[off:off + 4] == b'\x89PNG':
            raise ValueError('frame %d is a PNG frame - only 32-bit bitmap frames are recoloured' % i)
        header = struct.unpack_from('<I', data, off)[0]
        bpp = struct.unpack_from('<H', data, off + 14)[0]
        if bpp != 32:
            raise ValueError('frame %d has %d bits a pixel - only 32-bit frames are recoloured' % (i, bpp))
        base = off + header
        cache = {}
        for k in range(w * h):
            p = base + 4 * k
            b, g, r, a = data[p], data[p + 1], data[p + 2], data[p + 3]
            if a == 0:
                continue
            key = (r, g, b)
            if key not in cache:
                cache[key] = light_pixel(r, g, b)
            nr, ng, nb = cache[key]
            data[p], data[p + 1], data[p + 2] = nb, ng, nr
    return bytes(data)


def main():
    os.makedirs(LIGHT, exist_ok=True)
    names = sorted(n for n in os.listdir(DARK) if n.lower().endswith('.ico'))
    written = 0
    for name in names:
        if name in HAND_DRAWN:
            print('kept (drawn by hand):', name)
            continue
        with open(os.path.join(DARK, name), 'rb') as f:
            light = make_light(f.read())
        target = os.path.join(LIGHT, name)
        old = open(target, 'rb').read() if os.path.exists(target) else None
        if old != light:
            with open(target, 'wb') as f:
                f.write(light)
            written += 1
    print('%d light icons from %d dark ones (%d written)' % (len(names) - len(HAND_DRAWN), len(names), written))
    return 0


if __name__ == '__main__':
    sys.exit(main())
