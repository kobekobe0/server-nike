import express from 'express';
import multer from 'multer';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';

const upload = multer({ storage: multer.memoryStorage() });

const uploadImages = upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 }
]);

const processImages = (req, res, next) => {
  Promise.all(Object.values(req.files).flat().map((file, index) => {
    const dir = file.fieldname === 'mainImage' ? './src/images/mainImages' : './src/images/' + req.body.name;
    const filename = file.fieldname === 'mainImage' ? req.body.name : req.body.name + file.fieldname.charAt(file.fieldname.length - 1);
    const outputPath = path.join(dir, filename + '.webp');

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    return sharp(file.buffer)
      .webp()
      .toFile(outputPath);
  }))
  .then(() => next())
  .catch(err => res.status(500).json({ error: err.message }));
};

export { uploadImages, processImages };