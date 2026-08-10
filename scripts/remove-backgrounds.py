#!/usr/bin/env python3
"""
Hapus background dari:
1. Logo Universitas Tulungagung
2. Logo Universitas Bhinneka PGRI
3. Foto Prof. Dwi Ima Herminingsih (close-up crop ke wajah)

Menggunakan rembg (U2Net model) untuk hasil terbaik.
"""
import os
from PIL import Image, ImageFilter, ImageEnhance
from rembg import remove, new_session

ASSETS = "/home/z/my-project/public/logos"
UPLOADS = "/home/z/my-project/upload"

# Output paths
LOGO_ULTA_OUT = os.path.join(ASSETS, "universitas-tulungagung.png")
LOGO_UBP_OUT = os.path.join(ASSETS, "universitas-bhinneka-pgri.png")
PROF_OUT = os.path.join(ASSETS, "prof-dwi-ima.png")  # PNG with transparency

# Initialize rembg session (u2net for general, isnet-general-use for better edge)
print("🔄 Initializing rembg session (this may take a moment on first run)...")
session = new_session("u2net")

def remove_background(input_path, output_path, sharpen=True, enhance_color=False):
    """Remove background from image"""
    print(f"\n📸 Processing: {input_path}")
    with open(input_path, "rb") as f:
        input_data = f.read()

    # Remove background
    result = remove(input_data, session=session, alpha_matting=True, alpha_matting_foreground_threshold=240, alpha_matting_background_threshold=10)

    # Save to bytes, then open with PIL for post-processing
    img = Image.open(BytesIO(result_bytes := result)).convert("RGBA")

    # Optional: sharpen edges
    if sharpen:
        # Apply slight sharpening to alpha channel
        alpha = img.split()[3]
        alpha = alpha.filter(ImageFilter.SHARPEN)
        img.putalpha(alpha)

    # Optional: enhance color saturation
    if enhance_color:
        enhancer = ImageEnhance.Color(img)
        img = enhancer.enhance(1.15)

    img.save(output_path, "PNG", optimize=True)
    size_kb = os.path.getsize(output_path) // 1024
    print(f"   ✅ Saved: {output_path} ({size_kb} KB, {img.size[0]}x{img.size[1]})")
    return img


def process_prof_photo(input_path, output_path):
    """
    Process professor photo:
    1. Crop to focus on upper portion (face/upper body) - close-up
    2. Remove background
    3. Apply slight enhancement
    """
    print(f"\n📸 Processing professor photo: {input_path}")

    # First, open and crop to upper portion (face area)
    img = Image.open(input_path).convert("RGBA")
    w, h = img.size
    print(f"   Original size: {w}x{h}")

    # Crop to upper 55% of the photo (focus on face/upper body)
    # This is a portrait photo - upper portion typically has the face
    crop_top = int(h * 0.02)  # start near top
    crop_bottom = int(h * 0.55)  # take upper 55%
    # Keep horizontal centered, but use full width if it's portrait
    crop_left = max(0, int(w * 0.20))
    crop_right = min(w, int(w * 0.80))

    cropped = img.crop((crop_left, crop_top, crop_right, crop_bottom))
    print(f"   Cropped to: {cropped.size[0]}x{cropped.size[1]}")

    # Save cropped temporarily
    temp_path = "/tmp/prof_cropped.png"
    cropped.save(temp_path, "PNG")

    # Now remove background using rembg
    with open(temp_path, "rb") as f:
        input_data = f.read()

    result = remove(
        input_data,
        session=session,
        alpha_matting=True,
        alpha_matting_foreground_threshold=235,
        alpha_matting_background_threshold=15,
        alpha_matting_erode_size=8,
    )

    final_img = Image.open(__import__("io").BytesIO(result)).convert("RGBA")

    # Slight color enhancement
    enhancer = ImageEnhance.Color(final_img)
    final_img = enhancer.enhance(1.10)

    # Slight brightness boost
    enhancer = ImageEnhance.Brightness(final_img)
    final_img = enhancer.enhance(1.05)

    # Sharpen alpha edges
    alpha = final_img.split()[3]
    alpha = alpha.filter(ImageFilter.SHARPEN)
    final_img.putalpha(alpha)

    final_img.save(output_path, "PNG", optimize=True)
    size_kb = os.path.getsize(output_path) // 1024
    print(f"   ✅ Saved: {output_path} ({size_kb} KB, {final_img.size[0]}x{final_img.size[1]})")

    # Cleanup
    if os.path.exists(temp_path):
        os.remove(temp_path)

    return final_img


def process_logo(input_path, output_path):
    """Process logo - remove background, preserve logo details"""
    print(f"\n🏛️  Processing logo: {input_path}")

    with open(input_path, "rb") as f:
        input_data = f.read()

    result = remove(
        input_data,
        session=session,
        alpha_matting=True,
        alpha_matting_foreground_threshold=240,
        alpha_matting_background_threshold=20,
        alpha_matting_erode_size=3,
    )

    img = Image.open(__import__("io").BytesIO(result)).convert("RGBA")

    # Sharpen alpha
    alpha = img.split()[3]
    alpha = alpha.filter(ImageFilter.SHARPEN)
    img.putalpha(alpha)

    # Slight saturation boost
    enhancer = ImageEnhance.Color(img)
    img = enhancer.enhance(1.08)

    img.save(output_path, "PNG", optimize=True)
    size_kb = os.path.getsize(output_path) // 1024
    print(f"   ✅ Saved: {output_path} ({size_kb} KB, {img.size[0]}x{img.size[1]})")
    return img


from io import BytesIO

if __name__ == "__main__":
    print("=" * 60)
    print("🎨 BACKGROUND REMOVAL - Logo Kampus & Foto Profesor")
    print("=" * 60)

    # 1. Process logo Universitas Tulungagung
    process_logo(
        os.path.join(UPLOADS, "Universitas Tulungagung.png"),
        LOGO_ULTA_OUT,
    )

    # 2. Process logo Universitas Bhinneka PGRI
    process_logo(
        os.path.join(UPLOADS, "Universitas Bhinneka PGRI.png"),
        LOGO_UBP_OUT,
    )

    # 3. Process professor photo (close-up crop + background removal)
    process_prof_photo(
        os.path.join(UPLOADS, "WhatsApp Image 2026-08-10 at 21.51.35.jpeg"),
        PROF_OUT,
    )

    print("\n" + "=" * 60)
    print("✅ SEMUA BACKGROUND BERHASIL DIHAPUS!")
    print("=" * 60)
    print("\nFile output:")
    for f in [LOGO_ULTA_OUT, LOGO_UBP_OUT, PROF_OUT]:
        if os.path.exists(f):
            size = os.path.getsize(f) // 1024
            print(f"  - {f} ({size} KB)")
