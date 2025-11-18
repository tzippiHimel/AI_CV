import fs from 'fs';
import path from 'path';

export class DownloadService {
    static async downloadFile(filename) {
        const filePath = path.join('generated', filename);
        
        if (!fs.existsSync(filePath)) {
            throw new Error('File not found');
        }
        
        return filePath;
    }
    
    static async deleteFile(filePath) {
        try {
            fs.unlinkSync(filePath);
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    }
}