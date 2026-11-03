"""Replace staff headshot backgrounds with a textured burgundy studio backdrop.

Place .jpg, .jpeg, and .png images in assets/images/staff (including its
subfolders), then run:
    python process_headshots.py
"""

from __future__ import annotations

import logging
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageOps
from rembg import new_session, remove
from rembg.sessions import BaseSession


ROOT = Path(__file__).resolve().parent
INPUT_DIR = ROOT / "assets" / "images" / "staff"
OUTPUT_DIR = ROOT / "output_photos"
SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png"}
MODEL_NAME = "u2net_human_seg"
BURGUNDY = (74, 35, 53)


def make_studio_background(size: tuple[int, int]) -> Image.Image:
    """Create a subtle, textured burgundy background at the requested size."""
    width, height = size
    scale = min(1.0, 2048 / max(width, height))
    texture_size = (max(1, round(width * scale)), max(1, round(height * scale)))

    noise = Image.effect_noise(texture_size, 16)
    texture = ImageOps.colorize(noise, black="#3A1C2A", white="#62384B")
    base = Image.new("RGB", texture_size, BURGUNDY)
    background = Image.blend(base, texture, 0.2)

    glow_mask = Image.new("L", texture_size, 0)
    draw = ImageDraw.Draw(glow_mask)
    draw.ellipse(
        (
            round(texture_size[0] * 0.12),
            round(texture_size[1] * 0.04),
            round(texture_size[0] * 0.88),
            round(texture_size[1] * 0.96),
        ),
        fill=40,
    )
    glow_mask = glow_mask.filter(
        ImageFilter.GaussianBlur(max(1, round(min(texture_size) * 0.12)))
    )
    glow = Image.new("RGB", texture_size, "#60384A")
    background = Image.composite(glow, background, glow_mask)

    if texture_size != size:
        background = background.resize(size, Image.Resampling.BICUBIC)
    return background


def process_image(image_path: Path, output_path: Path, session: BaseSession) -> None:
    with Image.open(image_path) as source:
        oriented = ImageOps.exif_transpose(source).convert("RGBA")

    cutout = remove(oriented, session=session, post_process_mask=True)
    if not isinstance(cutout, Image.Image):
        raise TypeError("Background removal did not return a Pillow image")

    cutout = cutout.convert("RGBA")
    background = make_studio_background(cutout.size)
    background.paste(cutout, mask=cutout.getchannel("A"))

    if output_path.suffix.lower() == ".png":
        background.save(output_path, format="PNG", optimize=True)
    else:
        background.save(
            output_path,
            format="JPEG",
            quality=95,
            subsampling=0,
            optimize=True,
        )


def main() -> int:
    logging.basicConfig(
        level=logging.INFO,
        format="%(levelname)s: %(message)s",
    )
    logger = logging.getLogger(__name__)

    if not INPUT_DIR.is_dir():
        logger.error("Staff photos folder was not found: %s", INPUT_DIR)
        return 1
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    images = sorted(
        (
            path
            for path in INPUT_DIR.rglob("*")
            if path.is_file() and path.suffix.lower() in SUPPORTED_EXTENSIONS
        ),
        key=lambda path: path.name.lower(),
    )
    if not images:
        logger.warning("No .jpg, .jpeg, or .png images found in %s", INPUT_DIR)
        return 0

    try:
        session = new_session(MODEL_NAME)
    except Exception:
        logger.exception("Could not initialize rembg model %s", MODEL_NAME)
        return 1

    failures = 0
    for image_path in images:
        output_path = OUTPUT_DIR / image_path.relative_to(INPUT_DIR)
        try:
            output_path.parent.mkdir(parents=True, exist_ok=True)
            process_image(image_path, output_path, session)
            logger.info(
                "Processed %s -> %s",
                image_path.relative_to(INPUT_DIR),
                output_path.relative_to(OUTPUT_DIR),
            )
        except Exception:
            failures += 1
            logger.exception("Failed to process %s; continuing", image_path.name)

    succeeded = len(images) - failures
    logger.info("Finished: %d succeeded, %d failed", succeeded, failures)
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
