import { PDFService } from '../services/pdfService.js';
import { AIService } from '../services/aiService.js';
import fs from 'fs';

export class CVController {
    static async optimizeForJob(req, res) {
        try {
            const { jobDescription } = req.body;
            const cvFile = req.file;

            console.log('Received jobDescription:', jobDescription);
            console.log('Received file:', cvFile);

            if (!cvFile) {
                return res.status(400).json({ error: 'CV file is required' });
            }
            if (!jobDescription) {
                return res.status(400).json({ error: 'Job description is required' });
            }

            // המרת קובץ ל-Base64
            let cvBase64;
            try {
                console.log('Converting CV to base64:', cvFile.path);
                cvBase64 = PDFService.convertToBase64(cvFile.path);
            } catch (err) {
                console.error('Base64 conversion failed:', err);
                return res.status(500).json({ error: 'Failed to read CV file: ' + err.message });
            }

            // קריאה ל-AI
            let analysis;
            try {
                console.log('Calling AIService...');
                const aiService = new AIService();
                analysis = await aiService.optimizeCV(cvBase64, jobDescription);
                console.log('AI analysis result:', analysis);
            } catch (err) {
                console.error('AIService failed:', err);
                return res.status(500).json({ error: 'AI optimization failed: ' + err.message });
            }

            // יצירת PDF חדש
            const filename = `optimized_cv_${Date.now()}.pdf`;
            try {
                console.log('Creating PDF:', filename);
                await PDFService.createPDF(analysis.improvedContent, filename);
            } catch (err) {
                console.error('PDF creation failed:', err);
                return res.status(500).json({ error: 'PDF creation failed: ' + err.message });
            }

            // מחיקת הקובץ המקורי
            try {
                fs.unlinkSync(cvFile.path);
                console.log('Original CV deleted:', cvFile.path);
            } catch (err) {
                console.warn('Warning: failed to delete uploaded file:', err.message);
            }

            // החזרת התוצאה ל-React
            res.json({
                analysis: {
                    keySkills: analysis.keySkills,
                    suggestedChanges: analysis.suggestedChanges,
                    missingSkills: analysis.missingSkills,
                    matchScore: analysis.matchScore,
                    recommendations: analysis.recommendations
                },
                filename
            });

        } catch (error) {
            console.error('Unexpected error in optimizeForJob:', error);
            res.status(500).json({ error: 'Unexpected server error: ' + error.message });
        }
    }
}
