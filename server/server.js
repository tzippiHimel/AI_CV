import express from 'express';
import cors from 'cors';
import fs from 'fs';
import multer from 'multer';
import cvRoutes from './routes/cvRoutes.js';
import downloadRoutes from './routes/downloadRoutes.js';

const app = express();
const PORT = 3000;

app.use(cors()); // לא חובה עם proxy, אבל בסדר להשאיר
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
if (!fs.existsSync('generated')) fs.mkdirSync('generated');

app.use('/api', cvRoutes);
app.use('/api', downloadRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Server running' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
