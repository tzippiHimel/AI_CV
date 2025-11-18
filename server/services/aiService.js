import { GoogleGenerativeAI } from '@google/generative-ai';

export class AIService {
    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    }

    async optimizeCV(cvBase64, jobDescription) {
        const prompt = `
        אנא נתח את קורות החיים הבאים ותן המלצות לאופטימיזציה למשרה:

        תיאור המשרה: ${jobDescription}

        קורות החיים (base64): ${cvBase64}

        אנא ספק:
        1. מיומנויות מרכזיות להדגיש
        2. שינויים מוצעים
        3. כישורים חסרים
        4. ציון התאמה (0-100)
        5. המלצות ספציפיות
        6. תוכן קורות חיים משופר מלא

        תן תשובה בפורמט JSON עם השדות הבאים:
        {
            "keySkills": [],
            "suggestedChanges": [],
            "missingSkills": [],
            "matchScore": 0,
            "recommendations": [],
            "improvedContent": ""
        }
        `;

        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return JSON.parse(response.text());
    }
}