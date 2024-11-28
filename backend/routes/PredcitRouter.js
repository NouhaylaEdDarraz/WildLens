import dotenv from 'dotenv';
import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { isAdmin, isAuth } from '../Utils.js';
import AnimalModel from '../models/animaldata.js';
import imageModel from '../models/imageModel.js';

const router = express.Router();

dotenv.config();

router.get('/getByEspece/:espece', async (req, res) => {
  const especeParam = req.params.espece;
  try {
    const animals = await AnimalModel.find({ Espèce: especeParam });
    if (animals.length === 0) {
      res.status(404).send('No data found for the given espece');
      return;
    }
    res.json(animals);
  } catch (error) {
    console.error('Error retrieving data by espece:', error);
    res.status(500).send('Something went wrong!');
  }
});
router.get(
  '/allimages',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const images = await imageModel.find({});
    res.send(images);
  })
);

router.get('/extractGPSWithImages', async (req, res) => {
  try {
    const allImageData = await imageModel.find();
    const extractedData = [];
    allImageData.forEach((userData) => {
      const latitude = userData.exifData?.['GPS GPSLatitude'] ?? null;
      const longitude = userData.exifData?.['GPS GPSLongitude'] ?? null;
      const image = userData.imageData?.toString('base64') ?? null;
      if (latitude && longitude) {
        if (image) {
          extractedData.push({ latitude, longitude, image });
        }
      }
    });
    res.json(extractedData);
  } catch (error) {
    console.error('Error extracting GPS coordinates with images:', error);
    res.status(500).send('Something went wrong!');
  }
});

router.get(
  '/allanimals',
  expressAsyncHandler(async (req, res) => {
    try {
      const animals = await AnimalModel.find({});
      res.send(animals);
    } catch (error) {
      console.error('Error retrieving all animals:', error);
      res.status(500).send('Something went wrong!');
    }
  })
);

export default router;
