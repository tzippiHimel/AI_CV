import fs from 'fs';
import PDFDocument from 'pdfkit';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class PDFService {
    static convertToBase64(filePath) {
        const fileBuffer = fs.readFileSync(filePath);
        return fileBuffer.toString('base64');
    }

    static async createPDF(content, filename) {
        const doc = new PDFDocument({ 
            margin: 50,
            bufferPages: true
        });
        const outputPath = path.join('generated', filename);
        
        if (!fs.existsSync('generated')) {
            fs.mkdirSync('generated');
        }

        doc.pipe(fs.createWriteStream(outputPath));
        
        // Register Hebrew font if available
        try {
            doc.registerFont('Hebrew', 'C:/Windows/Fonts/arial.ttf');
            doc.registerFont('Hebrew-Bold', 'C:/Windows/Fonts/arialbd.ttf');
        } catch (error) {
            try {
                doc.registerFont('Hebrew', 'C:/Windows/Fonts/calibri.ttf');
                doc.registerFont('Hebrew-Bold', 'C:/Windows/Fonts/calibrib.ttf');
            } catch (error2) {
                console.log('Hebrew fonts not found, using default fonts');
            }
        }
        
        // Parse and format the CV content
        this.formatCV(doc, content);
        
        doc.end();

        return new Promise((resolve) => {
            doc.on('end', () => resolve(outputPath));
        });
    }

    static formatCV(doc, content) {
        const lines = content.split('\n');
        let currentY = 50;
        const pageWidth = doc.page.width - 100;
        
        for (let line of lines) {
            line = line.trim();
            if (!line) {
                currentY += 10;
                continue;
            }

            // Check if we need a new page
            if (currentY > doc.page.height - 100) {
                doc.addPage();
                currentY = 50;
            }

            // Detect if line contains Hebrew characters
            const hasHebrew = /[\u0590-\u05FF]/.test(line);
            const fontName = hasHebrew ? 'Hebrew' : 'Helvetica';
            const boldFontName = hasHebrew ? 'Hebrew-Bold' : 'Helvetica-Bold';

            // Header (name)
            if (this.isName(line)) {
                doc.fontSize(20).font(boldFontName);
                doc.text(line, 50, currentY, { 
                    width: pageWidth, 
                    align: hasHebrew ? 'right' : 'center'
                });
                currentY += 30;
            }
            // Contact info
            else if (this.isContactInfo(line)) {
                doc.fontSize(10).font(fontName);
                doc.text(line, 50, currentY, { 
                    width: pageWidth, 
                    align: hasHebrew ? 'right' : 'center'
                });
                currentY += 15;
            }
            // Section headers
            else if (this.isSectionHeader(line)) {
                currentY += 10;
                doc.fontSize(14).font(boldFontName);
                const xPos = hasHebrew ? pageWidth + 50 - doc.widthOfString(line) : 50;
                doc.text(line, xPos, currentY);
                // Add underline
                doc.moveTo(xPos, currentY + 18)
                   .lineTo(xPos + doc.widthOfString(line), currentY + 18)
                   .stroke();
                currentY += 25;
            }
            // Bullet points
            else if (line.startsWith('•') || line.startsWith('-')) {
                doc.fontSize(11).font(fontName);
                const xPos = hasHebrew ? 50 : 70;
                doc.text(line, xPos, currentY, { 
                    width: pageWidth - 20,
                    align: hasHebrew ? 'right' : 'left'
                });
                currentY += doc.heightOfString(line, { width: pageWidth - 20 }) + 5;
            }
            // Job titles or company names
            else if (this.isJobTitle(line)) {
                doc.fontSize(12).font(boldFontName);
                doc.text(line, 50, currentY, { 
                    width: pageWidth,
                    align: hasHebrew ? 'right' : 'left'
                });
                currentY += doc.heightOfString(line, { width: pageWidth }) + 8;
            }
            // Regular text
            else {
                doc.fontSize(11).font(fontName);
                doc.text(line, 50, currentY, { 
                    width: pageWidth,
                    align: hasHebrew ? 'right' : 'left'
                });
                currentY += doc.heightOfString(line, { width: pageWidth }) + 5;
            }
        }
    }

    static isName(line) {
        return line.length < 50 && line.toUpperCase() === line && !line.includes('@') && !line.includes('|');
    }

    static isContactInfo(line) {
        return line.includes('@') || line.includes('|') || line.includes('linkedin') || line.includes('phone');
    }

    static isSectionHeader(line) {
        const headers = [
            'PROFESSIONAL SUMMARY', 'KEY SKILLS', 'PROFESSIONAL EXPERIENCE', 
            'EDUCATION', 'CERTIFICATIONS', 'EXPERIENCE', 'SKILLS', 'SUMMARY',
            'ניסיון מקצועי', 'כישורים', 'השכלה', 'תעודות', 'סיכום מקצועי'
        ];
        return headers.some(header => line.toUpperCase().includes(header.toUpperCase()));
    }

    static isJobTitle(line) {
        return line.includes('|') && (line.includes('20') || line.includes('Present'));
    }
}