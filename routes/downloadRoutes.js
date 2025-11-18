import express from 'express';
import { DownloadController } from '../controllers/downloadController.js';

const router = express.Router();

router.get('/download/:filename', DownloadController.downloadFile);

export default router;