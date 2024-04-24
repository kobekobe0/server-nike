import { parentPort, workerData } from 'worker_threads';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

async function processImage() {
  const { imageBuffer, background, logoPath, metadata } = workerData;



  console.log(`Original Image Size: ${imageBuffer.length} bytes`)

  // Get the metadata of the background
  const backgroundMetadata = await sharp(background).metadata();

  // Calculate the new width and height based on the aspect ratio of the image
  const aspectRatio = metadata.width / metadata.height;
  let newWidth, newHeight;
  if (backgroundMetadata.width / backgroundMetadata.height > aspectRatio) {
    // The background is wider than the image, so we adjust the width
    newWidth = Math.round(backgroundMetadata.height * aspectRatio);
    newHeight = backgroundMetadata.height;
  } else {
    // The background is taller than the image, so we adjust the height
    newWidth = backgroundMetadata.width;
    newHeight = Math.round(backgroundMetadata.width / aspectRatio);
  }

  // Calculate the top left corner of the crop area
  const left = (backgroundMetadata.width - newWidth) / 2;
  const top = (backgroundMetadata.height - newHeight) / 2;

  const border = await sharp(background)
    .extract({
      left: Math.round(left),
      top: Math.round(top),
      width: newWidth,
      height: newHeight,
    })
    .toBuffer();
  
  const borderMetadata = await sharp(border).metadata();

  console.log(`Border Size: ${border.length} bytes`);

  const resizedOriginal = await sharp(imageBuffer)
    .resize({
      width: Math.round(borderMetadata.width * 0.8),
      height: Math.round(borderMetadata.height * 0.8),
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .toBuffer();

  console.log(`Resized Original Size: ${resizedOriginal.length} bytes`);

  const compositeData = await sharp(border)
    .composite([{ input: resizedOriginal, gravity: 'center' }])
    .toBuffer();

  console.log(`Composite Data Size: ${compositeData.length} bytes`);
  
  let logo = await sharp(logoPath);

  const logoMetadata = await logo.metadata();

  logo = await logo.resize({
    width: Math.round(borderMetadata.width * 0.7),
  }).toBuffer();

  console.log(`Logo Size: ${logo.length} bytes`)

  const topLogo = metadata.height - logoMetadata.height;

  // Put the logo on top of the compositeData
  const finalImage = await sharp(compositeData)
    .composite([{ input: logo, topLogo, gravity: 'south' }])
    .toFormat('jpeg', { quality: 80 }) 
    .toBuffer();

  // Send the final image back to the main thread
  parentPort.postMessage(finalImage);
}

if (parentPort) {
  parentPort.on('message', (workerData) => {
    processImage(workerData).catch((error) => {
      console.error(error);
      process.exit(1);
    });
  });
}

export default processImage;