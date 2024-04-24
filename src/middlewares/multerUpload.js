import { S3Client, PutObjectCommand, CopyObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from 'url';


const s3Client = new S3Client({
  endpoint: process.env.SPACE_URL,
  forcePathStyle: false,
  region: process.env.SPACE_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});


export const moveFile = async (bucket, oldKey, newKey) => {
  // Copy the file to the new location
  const copyParams = {
    Bucket: bucket,
    CopySource: `${bucket}/${oldKey}`,
    Key: newKey,
  };
  await s3Client.send(new CopyObjectCommand(copyParams));

  // Delete the file from the old location
  const deleteParams = {
    Bucket: bucket,
    Key: oldKey,
  };
  await s3Client.send(new DeleteObjectCommand(deleteParams));
};

// moveFile("your-bucket", "old-folder/old-file.jpg", "new-folder/new-file.jpg")
//   .then(() => console.log("File moved successfully"))
//   .catch((error) => console.error("Error:", error));

const addWatermark = async (fileData) => {
  try {
    const watermarkImage = await sharp('/src/watermark_w150.png').resize({ width: 600 });
    const compositeData = await sharp(fileData)
      .composite([{ input: await watermarkImage.toBuffer(), gravity: 'southeast' }])
      .toBuffer();

    return compositeData;
  } catch (error) {
    console.error(error);
  }
};



const uploadObject = async (fileData, fileName, code, folderName) => {
  try {
    const timestamp = Date.now();
    const originalStoredFileName = `${folderName}/${code}-${timestamp}-${fileName}`;

    const fileType = path.extname(originalStoredFileName).slice(1);
    const contentType = `image/${fileType}`;

    const params = {
      Bucket: 'truesight',
      Key: originalStoredFileName,
      Body: fileData,
      ACL: 'private',
      ContentType: contentType, 
    };

    await s3Client.send(new PutObjectCommand(params));
    console.log('Successfully uploaded original object:', params.Bucket + '/' + params.Key);

    const watermarkImage = sharp('./src/watermark_w150.png').resize({ width: 500 });
    const compressedData = await sharp(fileData)
      .webp()
      .resize({
        width: 800,
        withoutEnlargement: true,
      })
      .composite([{ input: await watermarkImage.toBuffer(), gravity: 'center' }])
      .toBuffer();

    // Add watermark to the compressed image
    //const watermarkedData = await addWatermark(compressedData);

    const compressedStoredFileName = `compressed/${code}-${timestamp}-${fileName.replace(/\.[^.]+$/, '.webp')}`;
    const compressedParams = {
      Bucket: 'truesight',
      Key: compressedStoredFileName,
      Body: compressedData, // Use the watermarked data
      ACL: 'private',
      ContentType: 'image/webp', 
    };

    await s3Client.send(new PutObjectCommand(compressedParams));
    console.log('Successfully uploaded compressed object with watermark:', compressedParams.Bucket + '/' + compressedParams.Key);

    return originalStoredFileName;
  } catch (err) {
    console.error('Error:', err);
    throw err;
  }
};

export const uploadLogo = async (fileData, fileName, folderName) => {
  try {
    const timestamp = Date.now();
    const originalStoredFileName = `${folderName}/${timestamp}-${fileName}`;

    const params = {
      Bucket: 'truesight',
      Key: originalStoredFileName,
      Body: fileData,
      ACL: 'private',
      ContentType: 'image/png', 
    };

    await s3Client.send(new PutObjectCommand(params));
    console.log('Successfully uploaded original object:', params.Bucket + '/' + params.Key);

    return originalStoredFileName;
  } catch (err) {
    console.error('Error:', err);
    throw err;
  }
};

export const uploadObjectProof = async (fileData, fileName, code, folderName) => {
  try {
    const timestamp = Date.now();
    const originalStoredFileName = `${folderName}/${code}-${timestamp}-${fileName}`;

    const params = {
      Bucket: 'truesight',
      Key: originalStoredFileName,
      Body: fileData,
      ACL: 'private',
      ContentType: 'image/jpeg', 
    };

    await s3Client.send(new PutObjectCommand(params));
    console.log('Successfully uploaded original object:', params.Bucket + '/' + params.Key);

    return originalStoredFileName;
  } catch (err) {
    console.error('Error:', err);
    throw err;
  }
};

export const uploadQRCode = async (fileData, fileName, folderName) => {
  try {
    const timestamp = Date.now();
    const originalStoredFileName = `${folderName}/${timestamp}-${fileName}`;

    const params = {
      Bucket: 'truesight',
      Key: originalStoredFileName,
      Body: fileData,
      ACL: 'private',
      ContentType: 'image/jpeg', 
    };

    await s3Client.send(new PutObjectCommand(params));
    console.log('Successfully uploaded QR code object:', params.Bucket + '/' + params.Key);

    return originalStoredFileName;
  } catch (err) {
    console.error('Error:', err);
    throw err;
  }
};

export const uploadBorder = async (fileData, fileName, orientation, folderName, type) => {
  try {
    const timestamp = Date.now();
    const originalStoredFileName = `${folderName}/${timestamp}-${fileName}-${type}-${orientation}`;

    const params = {
      Bucket: 'truesight',
      Key: originalStoredFileName,
      Body: fileData,
      ACL: 'private',
      ContentType: 'image/jpeg', 
    };

    await s3Client.send(new PutObjectCommand(params));
    console.log('Successfully uploaded border object:', params.Bucket + '/' + params.Key);

    return originalStoredFileName;
  } catch (err) {
    console.error('Error:', err);
    throw err;
  }
};

export const addBorder = async (imgId, backgroundDB) => {
  try {
    const params = {
      Bucket: 'truesight',
      Key: imgId,
    };

    const data = await s3Client.send(new GetObjectCommand(params));
    const imageBuffer = await new Promise((resolve, reject) => {
      const chunks = [];
      data.Body.on('data', chunk => chunks.push(chunk));
      data.Body.on('error', reject);
      data.Body.on('end', () => resolve(Buffer.concat(chunks)));
    });

    const image = sharp(imageBuffer);
    const metadata = await image.metadata();

    console.log(`Original Image Size: ${imageBuffer.length} bytes`)

    let backgroundTemp;
    if (metadata.width > metadata.height) {
      backgroundTemp = backgroundDB.find(item => item.orientation === 'horizontal');
    } else {
      backgroundTemp = backgroundDB.find(item => item.orientation === 'horizontal');
    }

    let backgroundRes = await s3Client.send(new GetObjectCommand({ 
      Bucket: 'truesight', 
      Key: backgroundTemp.image
    }));

    const border = await new Promise((resolve, reject) => {
      const chunks = [];
      backgroundRes.Body.on('data', chunk => chunks.push(chunk));
      backgroundRes.Body.on('error', reject);
      backgroundRes.Body.on('end', () => resolve(Buffer.concat(chunks)));
    });


    // Get the metadata of the background
    const borderImage = await sharp(border);
    const borderMetadata = await borderImage.metadata();

    //resize the image to fit the background
    const resizedImage = await image.resize({
      width: borderMetadata.width,
      height: borderMetadata.height,
      fit: 'fill',
    });

    //composite the image with the background
    const compositeData = await resizedImage.composite([{ input: await borderImage.toBuffer(), gravity: 'center' }]).toBuffer();

    return compositeData;

  } catch (error) {
    console.error(error);
  }
};

export const deleteBorderFromSpace = async (imgId) => {
  try {
    const params = {
      Bucket: 'truesight',
      Key: imgId,
    };

    await s3Client.send(new DeleteObjectCommand(params));
    console.log('Successfully deleted border object:', params.Bucket + '/' + params.Key);
  } catch (err) {
    console.error('Error:', err);
    throw err;
  }
}

export const deleteImagesInSpace = async (filenames) => {
    try {
        for (const filename of filenames) {
            const params = {
                Bucket: 'truesight',
                Key: filename,
            };

            await s3Client.send(new DeleteObjectCommand(params));
            console.log('Successfully deleted object:', params.Bucket + '/' + params.Key);
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export default uploadObject;
