import express from 'express';
import multer from 'multer';
import { CVController } from '../controllers/cvController.js';

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/optimize-for-job', upload.single('cv'), CVController.optimizeForJob);

export default router;