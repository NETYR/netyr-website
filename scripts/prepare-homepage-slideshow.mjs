import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const sourceDirectory = process.argv[2];
const manifestPath = path.join(
  repositoryRoot,
  "data",
  "homepage-slideshow.manifest.json",
);
const generatedDataPath = path.join(
  repositoryRoot,
  "data",
  "homepage-slideshow.generated.json",
);
const outputDirectory = path.join(
  repositoryRoot,
  "public",
  "images",
  "homepage-slideshow",
);
const supportedExtensions = new Set([
  ".heic",
  ".jpeg",
  ".jpg",
  ".png",
  ".webp",
]);

if (!sourceDirectory || !existsSync(sourceDirectory)) {
  throw new Error(
    "Pass the local photo folder as the first argument. The folder is read only.",
  );
}

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const sourceFiles = (await readdir(sourceDirectory))
  .filter((fileName) =>
    supportedExtensions.has(path.extname(fileName).toLowerCase()),
  )
  .sort((left, right) => left.localeCompare(right));

const hashes = new Map();
const duplicates = [];

for (const fileName of sourceFiles) {
  const fileBuffer = await readFile(path.join(sourceDirectory, fileName));
  const hash = createHash("sha256").update(fileBuffer).digest("hex");

  if (hashes.has(hash)) {
    duplicates.push({ duplicate: fileName, original: hashes.get(hash) });
  } else {
    hashes.set(hash, fileName);
  }
}

await mkdir(outputDirectory, { recursive: true });

const publicSlides = [];

for (const slide of manifest) {
  if (!sourceFiles.includes(slide.sourceFile)) {
    throw new Error(`Selected source image is missing: ${slide.sourceFile}`);
  }

  if (!/^[a-z0-9-]+\.webp$/.test(slide.outputFile)) {
    throw new Error(`Unsafe output filename: ${slide.outputFile}`);
  }

  const outputPath = path.join(outputDirectory, slide.outputFile);
  await sharp(path.join(sourceDirectory, slide.sourceFile))
    .rotate()
    .resize({
      fit: "inside",
      height: 1280,
      width: 1920,
      withoutEnlargement: true,
    })
    .webp({ effort: 6, quality: 82, smartSubsample: true })
    .toFile(outputPath);

  const metadata = await sharp(outputPath).metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error(`Could not verify optimized image: ${slide.outputFile}`);
  }

  if (metadata.exif || metadata.iptc || metadata.xmp) {
    throw new Error(`Private metadata remains in: ${slide.outputFile}`);
  }

  publicSlides.push({
    alt: slide.alt,
    focalPosition: slide.focalPosition,
    height: metadata.height,
    src: `/images/homepage-slideshow/${slide.outputFile}`,
    width: metadata.width,
  });
}

await writeFile(
  generatedDataPath,
  `${JSON.stringify(publicSlides, null, 2)}\n`,
  "utf8",
);

console.log(
  JSON.stringify(
    {
      duplicates,
      excluded: sourceFiles.length - manifest.length,
      found: sourceFiles.length,
      imported: manifest.length,
      outputDirectory,
    },
    null,
    2,
  ),
);
