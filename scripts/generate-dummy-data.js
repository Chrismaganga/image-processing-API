const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Ensure directories exist
const fullDir = path.join(__dirname, '../assets/images/full');
const thumbDir = path.join(__dirname, '../assets/images/thumb');

if (!fs.existsSync(fullDir)) {
  fs.mkdirSync(fullDir, { recursive: true });
}
if (!fs.existsSync(thumbDir)) {
  fs.mkdirSync(thumbDir, { recursive: true });
}

// Sample image data for generating dummy images
const dummyImages = [
  {
    name: 'sample1.jpg',
    width: 800,
    height: 600,
    color: '#FF6B6B',
  },
  {
    name: 'sample2.jpg',
    width: 1024,
    height: 768,
    color: '#4ECDC4',
  },
  {
    name: 'sample3.jpg',
    width: 1200,
    height: 800,
    color: '#45B7D1',
  },
  {
    name: 'sample4.jpg',
    width: 900,
    height: 600,
    color: '#96CEB4',
  },
  {
    name: 'sample5.jpg',
    width: 750,
    height: 500,
    color: '#FFEAA7',
  },
  {
    name: 'test.png',
    width: 600,
    height: 400,
    color: '#DDA0DD',
  },
  {
    name: 'demo.webp',
    width: 800,
    height: 600,
    color: '#98D8C8',
  },
];

async function generateDummyImages() {
  console.log('Generating dummy images...');

  for (const image of dummyImages) {
    const outputPath = path.join(fullDir, image.name);

    // Create a simple colored rectangle as dummy image
    await sharp({
      create: {
        width: image.width,
        height: image.height,
        channels: 3,
        background: image.color,
      },
    })
      .jpeg({ quality: 90 })
      .toFile(outputPath);

    console.log(`Generated: ${image.name} (${image.width}x${image.height})`);
  }

  console.log('Dummy images generated successfully!');
  console.log(`Images saved to: ${fullDir}`);
}

generateDummyImages().catch(console.error);
