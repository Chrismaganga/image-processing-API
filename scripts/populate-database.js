const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { getImageMetadata } = require('../dist/utils/imageProccessor');
const { saveImage } = require('../dist/database/services');

const fullImagesPath = path.join(__dirname, '../assets/images/full');

async function populateDatabase() {
  console.log('Populating database with existing images...');

  try {
    // Get all image files
    const files = fs.readdirSync(fullImagesPath);
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'].includes(ext);
    });

    console.log(`Found ${imageFiles.length} image files`);

    let savedCount = 0;
    let errorCount = 0;

    for (const filename of imageFiles) {
      try {
        const filePath = path.join(fullImagesPath, filename);
        const metadata = await getImageMetadata(filePath);

        // Add originalPath to metadata
        metadata.originalPath = filePath;

        // Save to database
        await saveImage(metadata);
        console.log(`✓ Saved metadata for: ${filename}`);
        savedCount++;
      } catch (error) {
        console.error(`✗ Error processing ${filename}:`, error.message);
        errorCount++;
      }
    }

    console.log('\nDatabase population completed!');
    console.log(`Successfully saved: ${savedCount} images`);
    console.log(`Errors: ${errorCount} images`);
  } catch (error) {
    console.error('Error populating database:', error);
  }
}

populateDatabase();
