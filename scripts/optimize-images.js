const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Define the images to optimize and their target sizes
const imagesToOptimize = [
  {
    input: 'public/images/fashion-collection-hero.webp',
    output: 'public/images/fashion-collection-hero-optimized.webp',
    width: 1200,
    height: 800,
    quality: 80
  },
  {
    input: 'public/images/fashion-banner.webp',
    output: 'public/images/fashion-banner-optimized.webp',
    width: 800,
    height: 600,
    quality: 80
  },
  {
    input: 'public/images/fashion-style.webp',
    output: 'public/images/fashion-style-optimized.webp',
    width: 800,
    height: 1000,
    quality: 80
  }
];

async function optimizeImages() {
  for (const img of imagesToOptimize) {
    try {
      if (!fs.existsSync(img.input)) {
        console.log(`Source image does not exist: ${img.input}`);
        continue;
      }
      
      await sharp(img.input)
        .resize(img.width, img.height, {
          fit: 'cover',
          position: 'center'
        })
        .webp({ quality: img.quality })
        .toFile(img.output);
        
      console.log(`Optimized: ${img.input} -> ${img.output}`);
      
      // Show size comparison
      const originalSize = fs.statSync(img.input).size;
      const newSize = fs.statSync(img.output).size;
      const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);
      
      console.log(`  Size: ${originalSize} bytes -> ${newSize} bytes (${reduction}% reduction)`);
      
      // Move optimized file to original name
      fs.renameSync(img.output, img.input);
      console.log(`  Moved optimized file to: ${img.input}`);
    } catch (error) {
      console.error(`Error optimizing ${img.input}:`, error.message);
    }
  }
}

optimizeImages().catch(console.error);