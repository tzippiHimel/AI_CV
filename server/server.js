import express from 'express';
import cors from 'cors';
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

app.use('/api', cvRoutes);
app.use('/api', downloadRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'AI CV Optimizer Server is running!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});