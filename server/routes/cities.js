import express from 'express';
import { listCities, getCityById, popularCities } from '../controllers/cityController.js';

const router = express.Router();

router.get('/', listCities);
router.get('/popular', popularCities);
router.get('/:id', getCityById);

export default router;
