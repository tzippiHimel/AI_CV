import { PDFService } from '../services/pdfService.js';
import { AIService } from '../services/aiService.js';
import fs from 'fs';

export class CVController {
    static async optimizeForJob(req, res) {
        try {
            const { jobDescription } = req.body;
            const cvFile = req.file;

            if (!cvFile || !jobDescription) {
                return res.status(400).json({ error: 'CV file and job description required' });
            }

            const cvBase64 = PDFService.convertToBase64(cvFile.path);
            
            const aiService = new AIService();
            const analysis = await aiService.optimizeCV(cvBase64, jobDescription);

            const filename = `optimized_cv_${Date.now()}.pdf`;
            await PDFService.createPDF(analysis.improvedContent, filename);

            fs.unlinkSync(cvFile.path);

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
            res.status(500).json({ error: error.message });
        }
    }
}