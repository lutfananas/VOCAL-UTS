#!/usr/bin/env python3
"""
Generate PNG VOCAL opening banner - TEMA BIRU DONGKER + MERAH
Output: /home/z/my-project/download/vocal-opening-banner.png
"""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

ASSETS = "/home/z/my-project/public/logos"
OUTPUT = "/home/z/my-project/download/vocal-opening-banner.png"
PROF_PHOTO = os.path.join(ASSETS, "prof-dwi-ima.png")  # transparent PNG
LOGO_ULTA = os.path.join(ASSETS, "universitas-tulungagung.png")  # transparent PNG
LOGO_UBP = os.path.join(ASSETS, "universitas-bhinneka-pgri.png")  # transparent PNG

W, H = 1080, 1620

# Biru dongker + merah palette
DONGKER_DARK = (15, 20, 40)       # #0f1428
DONGKER = (30, 58, 138)           # #1e3a8a
DONGKER_LIGHT = (59, 95, 191)     # #3b5fbf
MERAH = (200, 16, 46)             # #c8102e
MERAH_DARK = (139, 10, 31)        # #8b0a1f
EMAS = (201, 162, 39)             # #c9a227
EMAS_LIGHT = (224, 188, 58)       # #e0bc3a
KREM = (254, 252, 248)            # #fefcf8

def load_font(size, bold=False, italic=False, display=False):
    paths = []
    if display:
        paths = [
            "/usr/share/fonts/truetype/noto-serif-sc/NotoSerifSC-Bold.ttf" if bold else
            "/usr/share/fonts/truetype/noto-serif-sc/NotoSerifSC-Regular.ttf",
            "/usr/share/fonts/truetype/english/Tinos-Bold.ttf" if bold else
            "/usr/share/fonts/truetype/english/Tinos-Regular.ttf",
            "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf" if bold else
            "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf",
        ]
    else:
        paths = [
            "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf" if bold else
            "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Regular.ttf",
        ]
    for p in paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                continue
    return ImageFont.load_default()

def draw_batik_parang(draw, w, h, opacity=40):
    """Draw parang batik pattern overlay"""
    cell = 60
    for x in range(-cell, w + cell, cell):
        for y in range(-cell, h + cell, cell):
            # Parang curve shape
            points = []
            for i in range(0, 16):
                t = i / 15
                px = x + t * cell
                py = y + (1 - abs(2 * t - 1)) * cell * 0.5
                points.append((px, py))
            for i in range(15, -1, -1):
                t = i / 15
                px = x + t * cell
                py = y + cell - (1 - abs(2 * t - 1)) * cell * 0.5
                points.append((px, py))
            if len(points) > 2:
                draw.polygon(points, fill=(*DONGKER, opacity))

def draw_batik_divider(draw, y, w, color=EMAS):
    mid_x = w // 2
    diamond_size = 14
    diamond = [
        (mid_x - diamond_size, y),
        (mid_x, y - diamond_size // 2),
        (mid_x + diamond_size, y),
        (mid_x, y + diamond_size // 2),
    ]
    draw.polygon(diamond, fill=color)
    draw.line([(60, y), (mid_x - diamond_size - 5, y)], fill=color, width=2)
    draw.line([(mid_x + diamond_size + 5, y), (w - 60, y)], fill=color, width=2)
    draw.ellipse([mid_x - diamond_size - 25, y - 4, mid_x - diamond_size - 17, y + 4], fill=color)
    draw.ellipse([mid_x + diamond_size + 17, y - 4, mid_x + diamond_size + 25, y + 4], fill=color)

def draw_corner_ornament(draw, x, y, size=40, color=EMAS):
    import math
    cx, cy = x, y
    for angle in range(0, 360, 45):
        rad = math.radians(angle)
        ex = cx + int(size * 0.5 * math.cos(rad))
        ey = cy + int(size * 0.5 * math.sin(rad))
        draw.ellipse(
            [ex - size//4, ey - size//4, ex + size//4, ey + size//4],
            outline=color,
            width=2
        )
    draw.ellipse([cx - 5, cy - 5, cx + 5, cy + 5], fill=color)

def create_vocal_banner():
    """Create VOCAL opening banner PNG - BIRU DONGKER + MERAH theme"""
    # Canvas with dongker gradient
    img = Image.new("RGBA", (W, H), DONGKER_DARK + (255,))
    draw = ImageDraw.Draw(img, "RGBA")

    # Vertical gradient (dongker dark -> dongker -> dongker dark)
    for y in range(H):
        t = y / H
        if t < 0.5:
            mix = t * 2
        else:
            mix = (1 - t) * 2
        r = int(DONGKER_DARK[0] + (DONGKER[0] - DONGKER_DARK[0]) * mix)
        g = int(DONGKER_DARK[1] + (DONGKER[1] - DONGKER_DARK[1]) * mix)
        b = int(DONGKER_DARK[2] + (DONGKER[2] - DONGKER_DARK[2]) * mix)
        draw.line([(0, y), (W, y)], fill=(r, g, b, 255))

    # Overlay batik parang pattern
    batik_overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    batik_draw = ImageDraw.Draw(batik_overlay, "RGBA")
    draw_batik_parang(batik_draw, W, H, opacity=25)
    img = Image.alpha_composite(img, batik_overlay)
    draw = ImageDraw.Draw(img, "RGBA")

    # Radial glow emas
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow, "RGBA")
    cx, cy = W // 2, H // 2
    for r in range(600, 0, -20):
        alpha = int(45 * (1 - r / 600))
        glow_draw.ellipse(
            [cx - r, cy - r, cx + r, cy + r],
            fill=(*EMAS, alpha)
        )
    glow = glow.filter(ImageFilter.GaussianBlur(radius=40))
    img = Image.alpha_composite(img, glow)
    draw = ImageDraw.Draw(img, "RGBA")

    # Corner ornaments
    draw_corner_ornament(draw, 70, 70, size=50, color=EMAS)
    draw_corner_ornament(draw, W - 70, 70, size=50, color=EMAS)
    draw_corner_ornament(draw, 70, H - 70, size=50, color=EMAS)
    draw_corner_ornament(draw, W - 70, H - 70, size=50, color=EMAS)

    # === TOP: 2 LOGOS (transparent PNGs) ===
    logo_y = 110
    logo_size = 130
    try:
        # Logo 1 - already transparent
        logo1 = Image.open(LOGO_ULTA).convert("RGBA")
        logo1.thumbnail((logo_size, logo_size), Image.LANCZOS)
        # Add subtle drop shadow
        shadow1 = Image.new("RGBA", logo1.size, (0, 0, 0, 0))
        shadow1_draw = ImageDraw.Draw(shadow1)
        shadow1_draw.bitmap((0, 0), logo1.split()[3], fill=(0, 0, 0, 80))
        shadow1 = shadow1.filter(ImageFilter.GaussianBlur(radius=3))
        # Position - left of center
        pos1 = (W // 2 - logo_size - 40, logo_y)
        img.paste(shadow1, (pos1[0] + 3, pos1[1] + 3), shadow1)
        img.paste(logo1, pos1, logo1)

        logo2 = Image.open(LOGO_UBP).convert("RGBA")
        logo2.thumbnail((logo_size, logo_size), Image.LANCZOS)
        shadow2 = Image.new("RGBA", logo2.size, (0, 0, 0, 0))
        shadow2_draw = ImageDraw.Draw(shadow2)
        shadow2_draw.bitmap((0, 0), logo2.split()[3], fill=(0, 0, 0, 80))
        shadow2 = shadow2.filter(ImageFilter.GaussianBlur(radius=3))
        pos2 = (W // 2 + 40, logo_y)
        img.paste(shadow2, (pos2[0] + 3, pos2[1] + 3), shadow2)
        img.paste(logo2, pos2, logo2)
    except Exception as e:
        print(f"Logo load error: {e}")

    draw = ImageDraw.Draw(img, "RGBA")

    # === DIVIDER ===
    draw_batik_divider(draw, 290, W, color=EMAS)

    # === SUGENG RAWUH ===
    font_sugeng = load_font(36, italic=True, display=True)
    sugeng_text = "❋  Sugeng Rawuh  ❋"
    bbox = draw.textbbox((0, 0), sugeng_text, font=font_sugeng)
    draw.text(
        ((W - (bbox[2] - bbox[0])) // 2, 320),
        sugeng_text,
        fill=EMAS_LIGHT,
        font=font_sugeng
    )

    # === VOCAL TITLE (huge, with merah glow) ===
    font_vocal = load_font(180, bold=True, display=True)
    vocal_text = "VOCAL"
    bbox = draw.textbbox((0, 0), vocal_text, font=font_vocal)
    vocal_w = bbox[2] - bbox[0]
    # Drop shadow with merah tint
    draw.text(
        ((W - vocal_w) // 2 + 4, 380 + 4),
        vocal_text,
        fill=MERAH + (200,),
        font=font_vocal
    )
    # Main emas text
    draw.text(
        ((W - vocal_w) // 2, 380),
        vocal_text,
        fill=EMAS,
        font=font_vocal
    )

    # === Subtitle ===
    font_subtitle = load_font(28, italic=True, display=True)
    subtitle = "Voice Of Cultural And Local Wisdom"
    bbox = draw.textbbox((0, 0), subtitle, font=font_subtitle)
    draw.text(
        ((W - (bbox[2] - bbox[0])) // 2, 580),
        subtitle,
        fill=KREM + (230,),
        font=font_subtitle
    )

    # === DIVIDER ===
    draw_batik_divider(draw, 660, W, color=EMAS)

    # === Tagline ===
    font_tag = load_font(34, display=True)
    tag1 = "Inovasi Pembelajaran Digital Speaking"
    bbox = draw.textbbox((0, 0), tag1, font=font_tag)
    draw.text(((W - (bbox[2] - bbox[0])) // 2, 700), tag1, fill=KREM, font=font_tag)

    font_tag2 = load_font(28, italic=True, display=True)
    tag2 = "Berbasis Kearifan Lokal untuk Mewujudkan"
    bbox = draw.textbbox((0, 0), tag2, font=font_tag2)
    draw.text(((W - (bbox[2] - bbox[0])) // 2, 760), tag2, fill=KREM + (220,), font=font_tag2)

    font_tag3 = load_font(46, bold=True, display=True)
    tag3 = "Kampus Berdampak"
    bbox = draw.textbbox((0, 0), tag3, font=font_tag3)
    # Merah accent for "Kampus Berdampak"
    draw.text(
        ((W - (bbox[2] - bbox[0])) // 2 + 2, 812 + 2),
        tag3,
        fill=MERAH + (180,),
        font=font_tag3
    )
    draw.text(
        ((W - (bbox[2] - bbox[0])) // 2, 812),
        tag3,
        fill=EMAS_LIGHT,
        font=font_tag3
    )

    # === DIVIDER ===
    draw_batik_divider(draw, 910, W, color=EMAS)

    # === PROFESSOR PHOTO (circular, larger, transparent PNG) ===
    photo_cx, photo_cy = W // 2, 1080
    photo_r = 130  # Larger than before

    try:
        prof = Image.open(PROF_PHOTO).convert("RGBA")
        # Resize maintaining aspect
        prof.thumbnail((photo_r * 2, photo_r * 2), Image.LANCZOS)
        # Center crop to square
        w, h = prof.size
        side = min(w, h)
        left = (w - side) // 2
        top = (h - side) // 2
        prof = prof.crop((left, top, left + side, top + side))
        prof = prof.resize((photo_r * 2, photo_r * 2), Image.LANCZOS)

        # Create circular mask
        mask = Image.new("L", (photo_r * 2, photo_r * 2), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.ellipse([0, 0, photo_r * 2 - 1, photo_r * 2 - 1], fill=255)
        mask = mask.filter(ImageFilter.GaussianBlur(radius=2))

        # Drop shadow
        shadow = Image.new("RGBA", (photo_r * 2 + 20, photo_r * 2 + 20), (0, 0, 0, 0))
        shadow_draw = ImageDraw.Draw(shadow)
        shadow_draw.ellipse([10, 10, photo_r * 2 + 9, photo_r * 2 + 9], fill=(0, 0, 0, 120))
        shadow = shadow.filter(ImageFilter.GaussianBlur(radius=8))
        img.paste(shadow, (photo_cx - photo_r - 10 + 4, photo_cy - photo_r - 10 + 6), shadow)

        # Decorative rings
        ring_draw = ImageDraw.Draw(img, "RGBA")
        ring_draw.ellipse(
            [photo_cx - photo_r - 22, photo_cy - photo_r - 22,
             photo_cx + photo_r + 22, photo_cy + photo_r + 22],
            outline=MERAH + (180,),
            width=2
        )
        ring_draw.ellipse(
            [photo_cx - photo_r - 15, photo_cy - photo_r - 15,
             photo_cx + photo_r + 15, photo_cy + photo_r + 15],
            outline=EMAS + (220,),
            width=2
        )
        ring_draw.ellipse(
            [photo_cx - photo_r - 8, photo_cy - photo_r - 8,
             photo_cx + photo_r + 8, photo_cy + photo_r + 8],
            outline=EMAS,
            width=4
        )

        # Paste circular photo
        circular = Image.new("RGBA", (photo_r * 2, photo_r * 2), (0, 0, 0, 0))
        circular.paste(prof, (0, 0), mask)
        img.paste(circular, (photo_cx - photo_r, photo_cy - photo_r), circular)

        # Corner stars on photo
        for dx, dy in [(-1, -1), (1, -1), (-1, 1), (1, 1)]:
            sx = photo_cx + dx * (photo_r + 10)
            sy = photo_cy + dy * (photo_r + 10)
            draw.ellipse([sx - 9, sy - 9, sx + 9, sy + 9], fill=EMAS)
            import math
            for angle in range(0, 360, 90):
                rad = math.radians(angle)
                px = sx + int(11 * math.cos(rad))
                py = sy + int(11 * math.sin(rad))
                draw.ellipse([px - 3, py - 3, px + 3, py + 3], fill=EMAS)
    except Exception as e:
        print(f"Photo load error: {e}")

    draw = ImageDraw.Draw(img, "RGBA")

    # === Professor Name ===
    font_name = load_font(36, bold=True, display=True)
    name = "Prof. Dr. Dra. Hj. Dwi Ima Herminingsih, M.Hum"
    bbox = draw.textbbox((0, 0), name, font=font_name)
    draw.text(
        ((W - (bbox[2] - bbox[0])) // 2, 1240),
        name,
        fill=KREM,
        font=font_name
    )

    # Role
    font_role = load_font(26, italic=True, display=True)
    role = "Dosen Pengampu Mata Kuliah Bahasa Inggris Bisnis (UTW2002)"
    bbox = draw.textbbox((0, 0), role, font=font_role)
    draw.text(
        ((W - (bbox[2] - bbox[0])) // 2, 1300),
        role,
        fill=EMAS_LIGHT,
        font=font_role
    )

    # Faculty
    font_fac = load_font(22)
    fac = "FISIP  ·  S1 Administrasi Publik  ·  Universitas Tulungagung"
    bbox = draw.textbbox((0, 0), fac, font=font_fac)
    draw.text(
        ((W - (bbox[2] - bbox[0])) // 2, 1348),
        fac,
        fill=KREM + (180,),
        font=font_fac
    )

    # === FOOTER ===
    draw.line([(120, 1420), (W - 120, 1420)], fill=EMAS + (100,), width=1)

    font_quote = load_font(26, italic=True, display=True)
    quote1 = '"Budaya kui dudu wates, nanging dadi identitas"'
    bbox = draw.textbbox((0, 0), quote1, font=font_quote)
    draw.text(
        ((W - (bbox[2] - bbox[0])) // 2, 1440),
        quote1,
        fill=KREM + (220,),
        font=font_quote
    )

    font_trans = load_font(20)
    quote2 = '"Budaya bukan batas, melainkan identitas"'
    bbox = draw.textbbox((0, 0), quote2, font=font_trans)
    draw.text(
        ((W - (bbox[2] - bbox[0])) // 2, 1490),
        quote2,
        fill=KREM + (160,),
        font=font_trans
    )

    font_copy = load_font(18)
    copy_text = f"© {2026} FISIP · Sistem CBT Speaking Examination · Tema Batik Dongker & Merah"
    bbox = draw.textbbox((0, 0), copy_text, font=font_copy)
    draw.text(
        ((W - (bbox[2] - bbox[0])) // 2, 1550),
        copy_text,
        fill=KREM + (140,),
        font=font_copy
    )

    img = img.convert("RGB")
    img.save(OUTPUT, "PNG", quality=95, optimize=True)
    print(f"✅ Saved: {OUTPUT}")
    print(f"   Size: {os.path.getsize(OUTPUT) // 1024} KB")
    print(f"   Dimensions: {W}x{H}")

if __name__ == "__main__":
    create_vocal_banner()
