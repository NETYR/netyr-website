# Homepage slideshow

The homepage slideshow uses optimized, metadata-free WebP files in
`public/images/homepage-slideshow/`. Its order, alternative text, source image,
and focal position are managed in `data/homepage-slideshow.manifest.json`.

To update the slideshow:

1. Place the original photos in a local folder outside the repository.
2. Update `data/homepage-slideshow.manifest.json`. Use a safe, unique `.webp`
   name for each `outputFile` and keep the list in the intended display order.
3. Run `node scripts/prepare-homepage-slideshow.mjs "C:\path\to\photos"`.
4. Review the generated files on both wide and narrow screens, then run the
   normal format, lint, type-check, and build commands.

The preparation script applies embedded orientation, limits images to 1920 by
1280 pixels without stretching, strips EXIF/XMP/IPTC metadata, identifies exact
duplicates, and generates `data/homepage-slideshow.generated.json` for the site.
The originals are read only and remain outside the repository.
