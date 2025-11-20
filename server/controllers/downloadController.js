import { DownloadService } from "../services/downloadService.js";
import path from 'path';
import fs from 'fs';

export class DownloadController {
  static async downloadFile(req, res) {
    try {
      console.log("Received download request for file:", req.params.filename);
      const { filename } = req.params;
      const filePath = await DownloadService.downloadFile(filename);
      const absolutePath = path.resolve(filePath);

      // Check if file exists
      if (!fs.existsSync(absolutePath)) {
        return res.status(404).json({ error: 'File not found' });
      }

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );

      // Use download method instead of sendFile
      res.download(absolutePath, filename, (err) => {
        if (err) {
          console.error('Download error:', err);
          if (!res.headersSent) {
            res.status(500).json({ error: 'Download failed' });
          }
        } else {
          console.log('File downloaded successfully:', filename);
          // Don't delete the file - keep it in generated/ folder
        }
      });
    } catch (error) {
      console.error('Download controller error:', error);
      res.status(404).json({ error: error.message });
    }
  }
}
