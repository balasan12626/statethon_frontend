const express = require("express");
const router = express.Router();
const { processText } = require("../embedAndQuery");

/**
 * POST /api/search
 * Main endpoint for text-based job matching
 */
router.post("/search", async (req, res) => {
  try {
    const { text } = req.body;

    // Validate input
    if (!text) {
      return res.status(400).json({
        success: false,
        error: "Text input is required",
        example: { text: "I am doing painting" }
      });
    }

    if (typeof text !== 'string') {
      return res.status(400).json({
        success: false,
        error: "Text must be a string"
      });
    }

    if (text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Text cannot be empty"
      });
    }

    if (text.length > 5000) {
      return res.status(400).json({
        success: false,
        error: "Text is too long (max 5000 characters)"
      });
    }

    console.log(`📝 Received search request: "${text.substring(0, 100)}..."`);

    // Process the text
    const result = await processText(text);

    if (result.success) {
      res.json({
        success: true,
        data: result,
        processingTime: Date.now() - new Date(result.timestamp).getTime()
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error || "Processing failed",
        details: "An error occurred while processing your request"
      });
    }

  } catch (error) {
    console.error("❌ Search endpoint error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/search/health
 * Health check endpoint
 */
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Search API is healthy",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0"
  });
});

/**
 * POST /api/search/batch
 * Batch processing endpoint for multiple texts
 */
router.post("/batch", async (req, res) => {
  try {
    const { texts } = req.body;

    // Validate input
    if (!texts || !Array.isArray(texts)) {
      return res.status(400).json({
        success: false,
        error: "An array of texts is required",
        example: { texts: ["I am doing painting", "I work in software"] }
      });
    }

    if (texts.length === 0) {
      return res.status(400).json({
        success: false,
        error: "At least one text is required"
      });
    }

    if (texts.length > 10) {
      return res.status(400).json({
        success: false,
        error: "Maximum 10 texts allowed per batch"
      });
    }

    console.log(`📝 Received batch search request for ${texts.length} texts`);

    // Process all texts
    const results = await Promise.allSettled(
      texts.map(text => processText(text))
    );

    const processedResults = results.map((result, index) => ({
      index,
      input: texts[index],
      success: result.status === 'fulfilled',
      data: result.status === 'fulfilled' ? result.value : null,
      error: result.status === 'rejected' ? result.reason.message : null
    }));

    res.json({
      success: true,
      totalProcessed: texts.length,
      successCount: processedResults.filter(r => r.success).length,
      results: processedResults
    });

  } catch (error) {
    console.error("❌ Batch search endpoint error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;