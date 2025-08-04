const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const router = express.Router();
const { processText } = require("../embedAndQuery");

// Configure multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

/**
 * POST /api/pdf/upload
 * Upload and process PDF file
 */
router.post("/upload", upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "PDF file is required"
      });
    }

    console.log(`📄 Processing PDF: ${req.file.originalname} (${req.file.size} bytes)`);

    // Extract text from PDF
    const pdfData = await pdfParse(req.file.buffer);
    const extractedText = pdfData.text.trim();

    if (!extractedText) {
      return res.status(400).json({
        success: false,
        error: "No text could be extracted from the PDF"
      });
    }

    console.log(`📝 Extracted ${extractedText.length} characters from PDF`);

    // Process the extracted text
    const result = await processText(extractedText);

    if (result.success) {
      res.json({
        success: true,
        filename: req.file.originalname,
        fileSize: req.file.size,
        extractedTextLength: extractedText.length,
        extractedText: extractedText.substring(0, 500) + (extractedText.length > 500 ? '...' : ''),
        data: result
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error || "Processing failed",
        filename: req.file.originalname
      });
    }

  } catch (error) {
    console.error("❌ PDF upload error:", error);
    
    if (error.message === 'Only PDF files are allowed') {
      return res.status(400).json({
        success: false,
        error: "Only PDF files are allowed"
      });
    }
    
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: "File too large (max 10MB)"
      });
    }

    res.status(500).json({
      success: false,
      error: "PDF processing failed",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * POST /api/pdf/extract-only
 * Extract text from PDF without job matching
 */
router.post("/extract-only", upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "PDF file is required"
      });
    }

    console.log(`📄 Extracting text from PDF: ${req.file.originalname}`);

    // Extract text from PDF
    const pdfData = await pdfParse(req.file.buffer);
    const extractedText = pdfData.text.trim();

    if (!extractedText) {
      return res.status(400).json({
        success: false,
        error: "No text could be extracted from the PDF"
      });
    }

    res.json({
      success: true,
      filename: req.file.originalname,
      fileSize: req.file.size,
      pageCount: pdfData.numpages,
      extractedText: extractedText,
      textLength: extractedText.length,
      info: pdfData.info
    });

  } catch (error) {
    console.error("❌ PDF text extraction error:", error);
    
    if (error.message === 'Only PDF files are allowed') {
      return res.status(400).json({
        success: false,
        error: "Only PDF files are allowed"
      });
    }

    res.status(500).json({
      success: false,
      error: "PDF text extraction failed",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;