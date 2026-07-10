import { Router, type Response } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken, type AuthenticatedRequest } from '../middlewares/auth';
import { env } from '../config/env';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Storing files in the public/uploads directory. Make sure it exists.
    cb(null, path.join(__dirname, '../../public/uploads'));
  },
  filename: (req, file, cb) => {
    // Append UUID to avoid name collisions
    const uniqueName = `${uuidv4()}-${file.originalname.replace(/\s+/g, '-')}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  },
});

router.post('/', authenticateToken, upload.single('file'), (req: AuthenticatedRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'ValidationError', message: 'No file uploaded.' });
  }

  // Determine the base URL depending on the environment
  const baseUrl = env.isProduction ? `https://${req.headers.host}` : `http://${req.headers.host}`;
  const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

  return res.status(200).json({
    message: 'File uploaded successfully',
    url: fileUrl,
    filename: req.file.filename,
    mimetype: req.file.mimetype,
    size: req.file.size
  });
});

export default router;
