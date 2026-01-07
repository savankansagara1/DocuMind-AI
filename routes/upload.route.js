import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { processPdf } from "../services/pdf.service.js";

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer config


const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files allowed"));
    }
    cb(null, true);
  },
});


/**
 * POST /upload
 * form-data: pdf=<file>
 */
router.post("/", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "PDF file is required" });
    }

    const pdfId = await processPdf(req.file.buffer);

    res.json({
      message: "PDF uploaded and indexed successfully",
      pdfId,
    });
  } catch (error) {
  console.error("PDF upload error:", error);

  return res.status(400).json({
    error: error.message,
  });
}
});

export default router;
