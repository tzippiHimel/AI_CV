import { GoogleGenerativeAI } from '@google/generative-ai';

export class AIService {
    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    }

    async optimizeCV(cvBase64, jobDescription) {
        const prompt = `
        Please analyze the following CV and provide optimization recommendations for the job:

        Job Description: ${jobDescription}

        CV (base64): ${cvBase64}

        Please provide:
        1. Key skills to highlight
        2. Suggested changes
        3. Missing skills
        4. Match score (0-100)
        5. Specific recommendations
        6. Complete improved CV content

        Respond in JSON format with the following fields:
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