import fs from 'fs';
import PDFDocument from 'pdfkit';
import path from 'path';

export class PDFService {
    static convertToBase64(filePath) {
        const fileBuffer = fs.readFileSync(filePath);
        return fileBuffer.toString('base64');
    }

    static async createPDF(content, filename) {
        const doc = new PDFDocument();
        const outputPath = path.join('generated', filename);
        
        if (!fs.existsSync('generated')) {
            fs.mkdirSync('generated');
        }

        doc.pipe(fs.createWriteStream(outputPath));
        
        doc.fontSize(12);
        doc.text(content, 50, 50);
        doc.end();

        return new Promise((resolve) => {
            doc.on('end', () => resolve(outputPath));
        });
    }
}