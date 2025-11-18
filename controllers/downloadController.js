import { DownloadService } from '../services/downloadService.js';

export class DownloadController {
    static async downloadFile(req, res) {
        try {
            const { filename } = req.params;
            const filePath = await DownloadService.downloadFile(filename);
            
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            
            res.sendFile(filePath, { root: '.' }, (err) => {
                if (!err) {
                    DownloadService.deleteFile(filePath);
                }
            });
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}