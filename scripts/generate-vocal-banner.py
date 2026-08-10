#!/usr/bin/env python3
"""
Generate PNG version of VOCAL splash screen / opening banner
Berbasis kearifan lokal Tulungagung dengan foto Prof. Dwi Ima Herminingsih

Output: /home/z/my-project/download/vocal-opening-banner.png
"""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

# Paths
ASSETS = "/home/z/my-project/public/logos"
OUTPUT = "/home/z/my-project/download/vocal-opening-banner.png"
PROF_PHOTO = os.path.join(ASSETS, "prof-dwi-ima.jpeg")
LOGO_ULTA = os.path.join(ASSETS, "universitas-tulungagung.png")
LOGO_UBP = os.path.join(ASSETS, "universitas-bhinneka-pgri.png")

# Canvas dimensions - portrait poster style (1080x1620)
W, H = 1080, 1620

# Color palette (Tulungagung batik)
SOGAN_DARK = (42, 24, 16)       # #2a1810
SOGAN = (107, 68, 35)           # #6b4423
SOGAN_LIGHT = (139, 90, 43)     # #8b5a2b
EMAS = (201, 162, 39)           # #c9a227
EMAS_LIGHT = (224, 188, 58)     # #e0bc3a
KREM = (250, 243, 224)          # #faf3e0
KREM_WARM = (255, 248, 231)     # #fff8e7
MENDON = (27, 59, 111)          # #1b3b6f
MARUN = (155, 27, 48)           # #9b1b30

def load_font(size, bold=False, italic=False, display=False):
    """Load font with fallback chain"""
    paths = []
    if display:
        # Playfair Display style - use serif
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

def draw_batik_pattern(draw, w, h, opacity=80):
    """Draw subtle kawung batik pattern overlay"""
    import math
    # Kawung motif: 4 circles in a 2x2 grid pattern, repeated
    cell_size = 100
    for x in range(0, w, cell_size):
        for y in range(0, h, cell_size):
            cx, cy = x + cell_size // 2, y + cell_size // 2
            r = cell_size // 3
            # Draw 4 petal-like circles
            for dx, dy in [(-r//2, -r//2), (r//2, -r//2), (-r//2, r//2), (r//2, r//2)]:
                px, py = cx + dx, cy + dy
                draw.ellipse(
                    [px - r//2, py - r//2, px + r//2, py + r//2],
                    outline=(*EMAS, opacity),
                    width=1
                )

def draw_batik_divider(draw, y, w, color=EMAS):
    """Draw a horizontal batik divider with diamond + dot pattern"""
    mid_x = w // 2
    # Center diamond
    diamond_size = 14
    diamond = [
        (mid_x - diamond_size, y),
        (mid_x, y - diamond_size // 2),
        (mid_x + diamond_size, y),
        (mid_x, y + diamond_size // 2),
    ]
    draw.polygon(diamond, fill=color)
    # Side lines
    draw.line([(60, y), (mid_x - diamond_size - 5, y)], fill=color, width=2)
    draw.line([(mid_x + diamond_size + 5, y), (w - 60, y)], fill=color, width=2)
    # Side dots
    draw.ellipse([mid_x - diamond_size - 25, y - 4, mid_x - diamond_size - 17, y + 4], fill=color)
    draw.ellipse([mid_x + diamond_size + 17, y - 4, mid_x + diamond_size + 25, y + 4], fill=color)

def draw_corner_ornament(draw, x, y, size=40, color=EMAS):
    """Draw ❋-like ornament at corner"""
    # Multi-petal star using ellipses
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
    """Create the VOCAL opening banner PNG"""
    # Create canvas with gradient background
    img = Image.new("RGBA", (W, H), SOGAN_DARK + (255,))
    draw = ImageDraw.Draw(img, "RGBA")

    # Draw vertical gradient (sogan dark -> sogan -> sogan dark)
    for y in range(H):
        # Calculate gradient position (0 to 1 to 0)
        t = y / H
        if t < 0.5:
            mix = t * 2  # 0 -> 1
        else:
            mix = (1 - t) * 2  # 1 -> 0
        # Interpolate between SOGAN_DARK and SOGAN
        r = int(SOGAN_DARK[0] + (SOGAN[0] - SOGAN_DARK[0]) * mix)
        g = int(SOGAN_DARK[1] + (SOGAN[1] - SOGAN_DARK[1]) * mix)
        b = int(SOGAN_DARK[2] + (SOGAN[2] - SOGAN_DARK[2]) * mix)
        draw.line([(0, y), (W, y)], fill=(r, g, b, 255))

    # Overlay batik pattern (subtle)
    batik_overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    batik_draw = ImageDraw.Draw(batik_overlay, "RGBA")
    draw_batik_pattern(batik_draw, W, H, opacity=30)
    img = Image.alpha_composite(img, batik_overlay)
    draw = ImageDraw.Draw(img, "RGBA")

    # Radial glow emas in center
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow, "RGBA")
    cx, cy = W // 2, H // 2
    for r in range(600, 0, -20):
        alpha = int(40 * (1 - r / 600))
        glow_draw.ellipse(
            [cx - r, cy - r, cx + r, cy + r],
            fill=(*EMAS, alpha)
        )
    # Blur the glow
    glow = glow.filter(ImageFilter.GaussianBlur(radius=40))
    img = Image.alpha_composite(img, glow)
    draw = ImageDraw.Draw(img, "RGBA")

    # Corner ornaments (4 corners)
    draw_corner_ornament(draw, 70, 70, size=50, color=EMAS)
    draw_corner_ornament(draw, W - 70, 70, size=50, color=EMAS)
    draw_corner_ornament(draw, 70, H - 70, size=50, color=EMAS)
    draw_corner_ornament(draw, W - 70, H - 70, size=50, color=EMAS)

    # === TOP: 2 LOGOS ===
    logo_y = 120
    logo_size = 140
    try:
        logo1 = Image.open(LOGO_ULTA).convert("RGBA")
        # Resize maintaining aspect ratio, fit within logo_size x logo_size
        logo1.thumbnail((logo_size, logo_size), Image.LANCZOS)
        # White background + emas border
        logo_bg1 = Image.new("RGBA", (logo_size + 20, logo_size + 20), KREM_WARM + (255,))
        # Paste logo centered
        offset1 = ((logo_size + 20 - logo1.width) // 2, (logo_size + 20 - logo1.height) // 2)
        logo_bg1.paste(logo1, offset1, logo1)
        # Border
        border1 = ImageDraw.Draw(logo_bg1)
        border1.rectangle([0, 0, logo_size + 19, logo_size + 19], outline=EMAS, width=3)
        # Position - left of center
        pos1 = (W // 2 - logo_size - 40, logo_y)
        img.paste(logo_bg1, pos1, logo_bg1)

        logo2 = Image.open(LOGO_UBP).convert("RGBA")
        logo2.thumbnail((logo_size, logo_size), Image.LANCZOS)
        logo_bg2 = Image.new("RGBA", (logo_size + 20, logo_size + 20), KREM_WARM + (255,))
        offset2 = ((logo_size + 20 - logo2.width) // 2, (logo_size + 20 - logo2.height) // 2)
        logo_bg2.paste(logo2, offset2, logo2)
        border2 = ImageDraw.Draw(logo_bg2)
        border2.rectangle([0, 0, logo_size + 19, logo_size + 19], outline=EMAS, width=3)
        pos2 = (W // 2 + 20, logo_y)
        img.paste(logo_bg2, pos2, logo_bg2)
    except Exception as e:
        print(f"Logo load error: {e}")

    # Re-create draw object after paste
    draw = ImageDraw.Draw(img, "RGBA")

    # === DIVIDER ===
    draw_batik_divider(draw, 320, W, color=EMAS)

    # === SUGENG RAWUH ===
    font_sugeng = load_font(36, italic=True, display=True)
    sugeng_text = "❋  Sugeng Rawuh  ❋"
    bbox = draw.textbbox((0, 0), sugeng_text, font=font_sugeng)
    sugeng_w = bbox[2] - bbox[0]
    draw.text(
        ((W - sugeng_w) // 2, 350),
        sugeng_text,
        fill=EMAS_LIGHT,
        font=font_sugeng
    )

    # === VOCAL TITLE (huge) ===
    font_vocal = load_font(180, bold=True, display=True)
    vocal_text = "VOCAL"
    bbox = draw.textbbox((0, 0), vocal_text, font=font_vocal)
    vocal_w = bbox[2] - bbox[0]
    vocal_h = bbox[3] - bbox[1]
    # Drop shadow
    draw.text(
        ((W - vocal_w) // 2 + 4, 410 + 4),
        vocal_text,
        fill=SOGAN_DARK + (180,),
        font=font_vocal
    )
    # Main text
    draw.text(
        ((W - vocal_w) // 2, 410),
        vocal_text,
        fill=EMAS,
        font=font_vocal
    )

    # === Subtitle: Voice Of Cultural And Local Wisdom ===
    font_subtitle = load_font(28, italic=True, display=True)
    subtitle = "Voice Of Cultural And Local Wisdom"
    bbox = draw.textbbox((0, 0), subtitle, font=font_subtitle)
    sub_w = bbox[2] - bbox[0]
    draw.text(
        ((W - sub_w) // 2, 610),
        subtitle,
        fill=KREM + (230,),
        font=font_subtitle
    )

    # === DIVIDER ===
    draw_batik_divider(draw, 690, W, color=EMAS)

    # === Tagline ===
    font_tag = load_font(34, display=True)
    tag1 = "Inovasi Pembelajaran Digital Speaking"
    bbox = draw.textbbox((0, 0), tag1, font=font_tag)
    draw.text(((W - (bbox[2] - bbox[0])) // 2, 730), tag1, fill=KREM, font=font_tag)

    font_tag2 = load_font(28, italic=True, display=True)
    tag2 = "Berbasis Kearifan Lokal untuk Mewujudkan"
    bbox = draw.textbbox((0, 0), tag2, font=font_tag2)
    draw.text(((W - (bbox[2] - bbox[0])) // 2, 790), tag2, fill=KREM + (220,), font=font_tag2)

    font_tag3 = load_font(46, bold=True, display=True)
    tag3 = "Kampus Berdampak"
    bbox = draw.textbbox((0, 0), tag3, font=font_tag3)
    draw.text(((W - (bbox[2] - bbox[0])) // 2, 840), tag3, fill=EMAS_LIGHT, font=font_tag3)

    # === DIVIDER ===
    draw_batik_divider(draw, 940, W, color=EMAS)

    # === PROFESSOR PHOTO (circular) ===
    photo_cx, photo_cy = W // 2, 1080
    photo_r = 110

    try:
        prof = Image.open(PROF_PHOTO).convert("RGBA")
        # Crop to square (centered on top, since it's a portrait)
        w, h = prof.size
        # Use upper portion (face area) - crop top 60% as square
        crop_h = int(w * 1.0)  # square
        top = int(h * 0.05)  # start near top
        prof = prof.crop((0, top, w, top + crop_h))
        prof = prof.resize((photo_r * 2, photo_r * 2), Image.LANCZOS)

        # Create circular mask
        mask = Image.new("L", (photo_r * 2, photo_r * 2), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.ellipse([0, 0, photo_r * 2 - 1, photo_r * 2 - 1], fill=255)
        mask = mask.filter(ImageFilter.GaussianBlur(radius=2))

        # Create circular photo
        circular = Image.new("RGBA", (photo_r * 2, photo_r * 2), (0, 0, 0, 0))
        circular.paste(prof, (0, 0), mask)

        # Decorative rings around photo
        ring_draw = ImageDraw.Draw(img, "RGBA")
        # Outer thin ring
        ring_draw.ellipse(
            [photo_cx - photo_r - 18, photo_cy - photo_r - 18,
             photo_cx + photo_r + 18, photo_cy + photo_r + 18],
            outline=EMAS + (180,),
            width=2
        )
        # Middle ring
        ring_draw.ellipse(
            [photo_cx - photo_r - 12, photo_cy - photo_r - 12,
             photo_cx + photo_r + 12, photo_cy + photo_r + 12],
            outline=EMAS + (220,),
            width=2
        )
        # Border ring (thick)
        ring_draw.ellipse(
            [photo_cx - photo_r - 6, photo_cy - photo_r - 6,
             photo_cx + photo_r + 6, photo_cy + photo_r + 6],
            outline=EMAS,
            width=4
        )

        # Paste photo
        img.paste(circular, (photo_cx - photo_r, photo_cy - photo_r), circular)

        # Corner stars on photo
        star_size = 18
        for dx, dy in [(-1, -1), (1, -1), (-1, 1), (1, 1)]:
            sx = photo_cx + dx * (photo_r + 8)
            sy = photo_cy + dy * (photo_r + 8)
            # Draw small star/dot
            draw.ellipse(
                [sx - 8, sy - 8, sx + 8, sy + 8],
                fill=EMAS
            )
            # Petals
            import math
            for angle in range(0, 360, 90):
                rad = math.radians(angle)
                px = sx + int(10 * math.cos(rad))
                py = sy + int(10 * math.sin(rad))
                draw.ellipse(
                    [px - 3, py - 3, px + 3, py + 3],
                    fill=EMAS
                )
    except Exception as e:
        print(f"Photo load error: {e}")

    # Re-create draw object
    draw = ImageDraw.Draw(img, "RGBA")

    # === Professor Name ===
    font_name = load_font(38, bold=True, display=True)
    name = "Prof. Dr. Dra. Hj. Dwi Ima Herminingsih, M.Hum"
    bbox = draw.textbbox((0, 0), name, font=font_name)
    name_w = bbox[2] - bbox[0]
    draw.text(
        ((W - name_w) // 2, 1230),
        name,
        fill=KREM,
        font=font_name
    )

    # Professor role
    font_role = load_font(26, italic=True, display=True)
    role = "Dosen Pengampu Mata Kuliah Bahasa Inggris Bisnis (UTW2002)"
    bbox = draw.textbbox((0, 0), role, font=font_role)
    draw.text(
        ((W - (bbox[2] - bbox[0])) // 2, 1290),
        role,
        fill=EMAS_LIGHT,
        font=font_role
    )

    # Faculty / University
    font_fac = load_font(22)
    fac = "FISIP  ·  S1 Administrasi Publik  ·  Universitas Tulungagung"
    bbox = draw.textbbox((0, 0), fac, font=font_fac)
    draw.text(
        ((W - (bbox[2] - bbox[0])) // 2, 1335),
        fac,
        fill=KREM + (180,),
        font=font_fac
    )

    # === FOOTER ===
    # Divider line
    draw.line([(120, 1410), (W - 120, 1410)], fill=EMAS + (100,), width=1)

    # Javanese quote
    font_quote = load_font(26, italic=True, display=True)
    quote1 = '"Budaya kui dudu wates, nanging dadi identitas"'
    bbox = draw.textbbox((0, 0), quote1, font=font_quote)
    draw.text(
        ((W - (bbox[2] - bbox[0])) // 2, 1430),
        quote1,
        fill=KREM + (220,),
        font=font_quote
    )

    # Translation
    font_trans = load_font(20)
    quote2 = '"Budaya bukan batas, melainkan identitas"'
    bbox = draw.textbbox((0, 0), quote2, font=font_trans)
    draw.text(
        ((W - (bbox[2] - bbox[0])) // 2, 1480),
        quote2,
        fill=KREM + (160,),
        font=font_trans
    )

    # Copyright
    font_copy = load_font(18)
    copy_text = f"© {2026} FISIP · Sistem CBT Speaking Examination · Tema Budaya Tulungagung"
    bbox = draw.textbbox((0, 0), copy_text, font=font_copy)
    draw.text(
        ((W - (bbox[2] - bbox[0])) // 2, 1540),
        copy_text,
        fill=KREM + (140,),
        font=font_copy
    )

    # Save as PNG
    img = img.convert("RGB")  # Flatten for PNG
    img.save(OUTPUT, "PNG", quality=95, optimize=True)
    print(f"✅ Saved: {OUTPUT}")
    print(f"   Size: {os.path.getsize(OUTPUT) // 1024} KB")
    print(f"   Dimensions: {W}x{H}")

if __name__ == "__main__":
    create_vocal_banner()
