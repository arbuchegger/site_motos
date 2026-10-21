import sharp from 'sharp';

// Inputs: Real-ESRGAN ncnn Vulkan, realesrgan-x4plus, scale 4.
// Deliver at 2x the source dimensions, with smaller responsive alternatives.
const images = [
  ['light-white', 2752],
  ['racing-red', 2048],
  ['triple-black', 2752],
];
for (const [name, width] of images) {
  for (const size of [960, 1600, width]) {
    const file = `public/images/bmw-r1300gs/banner-${name}-sr-${size}.webp`;
    const result = await sharp(`output/super-resolution/${name}-4x.png`)
      .resize({ width: size }).webp({ quality: 88, effort: 6 }).toFile(file);
    console.log(`${file}: ${result.width}x${result.height}, ${Math.round(result.size / 1024)} KB`);
  }
}
