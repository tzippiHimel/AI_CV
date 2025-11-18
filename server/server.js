import express from 'express';
import cors from 'cors';
<<<<<<< HEAD
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
=======
import dotenv from 'dotenv';
import fs from 'fs';
import cvRoutes from './routes/cvRoutes.js';
import downloadRoutes from './routes/downloadRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

if (!fs.existsSync('generated')) {
    fs.mkdirSync('generated');
}
>>>>>>> 8e869b839912b7ddda2e5ce35a7dd9fec35ebc90

app.use('/api', cvRoutes);
app.use('/api', downloadRoutes);

app.get('/', (req, res) => {
<<<<<<< HEAD
  res.json({ message: 'Server running' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
=======
    res.json({ message: 'AI CV Optimizer Server is running!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
>>>>>>> 8e869b839912b7ddda2e5ce35a7dd9fec35ebc90
