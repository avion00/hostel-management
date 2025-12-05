import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configure multer for test
const upload = multer({ dest: 'uploads/test/' });

app.post('/test-upload', upload.single('image'), (req, res) => {
  console.log('File received:', req.file);
  res.json({ success: true, file: req.file });
});

app.get('/test', (req, res) => {
  res.json({ status: 'Server is running' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
