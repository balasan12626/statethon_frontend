const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
require("dotenv").config();

// Import routes
const searchRoutes = require("./routes/search");
const pdfRoutes = require("./routes/pdf");
const embedRoutes = require("./routes/embed");
const langchainRoutes = require("./routes/langchain");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Production security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // limit each IP to 100 requests per windowMs in production
  message: {
    success: false,
    error: "Too many requests from this IP, please try again in 15 minutes.",
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Compression middleware
app.use(compression());

// CORS middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL?.split(',') || ["https://yourdomain.com"]
    : process.env.FRONTEND_URL || ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Node.js LLM Job Matcher API is running!",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      search: "/api/search",
      pdf: "/api/pdf",
      langchain: "/api/langchain",
      health: "/api/search/health"
    },
    documentation: {
      searchAPI: {
        endpoint: "POST /api/search",
        body: { text: "string" },
        description: "Match input text to job categories using vector search and LLM"
      },
      batchAPI: {
        endpoint: "POST /api/search/batch",
        body: { texts: ["string", "string"] },
        description: "Process multiple texts in a single request"
      },
      pdfUpload: {
        endpoint: "POST /api/pdf/upload",
        body: "multipart/form-data with 'pdf' file",
        description: "Upload PDF, extract text, and match to jobs"
      },
      pdfExtract: {
        endpoint: "POST /api/pdf/extract-only",
        body: "multipart/form-data with 'pdf' file",
        description: "Extract text from PDF without job matching"
      },
      langchainChat: {
        endpoint: "POST /api/langchain/chat",
        body: { message: "string", model: "groq", systemPrompt: "string", conversationHistory: "array" },
        description: "Chat with Groq LLM model"
      },
      langchainStream: {
        endpoint: "POST /api/langchain/chat/stream",
        body: { message: "string", model: "groq", systemPrompt: "string", conversationHistory: "array" },
        description: "Stream chat responses from Groq LLM model"
      },
      langchainBatch: {
        endpoint: "POST /api/langchain/chat/batch",
        body: { messages: ["string"], model: "groq", systemPrompt: "string" },
        description: "Process multiple messages in batch with Groq"
      }
    }
  });
});

// API Routes
app.use("/api", searchRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/embed", embedRoutes);
app.use("/api/langchain", langchainRoutes);

// Global error handler
app.use((error, req, res, next) => {
  console.error("❌ Global error handler:", error);
  
  res.status(error.status || 500).json({
    success: false,
    error: "An unexpected error occurred",
    message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
    message: `The requested endpoint ${req.method} ${req.originalUrl} does not exist`,
    availableEndpoints: [
      "GET /",
      "POST /api/search",
      "POST /api/search/batch",
      "GET /api/search/health",
      "POST /api/pdf/upload",
      "POST /api/pdf/extract-only",
      "POST /api/langchain/chat",
      "POST /api/langchain/chat/stream",
      "POST /api/langchain/chat/batch",
      "GET /api/langchain/health",
      "GET /api/langchain/models"
    ]
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 Server is running on port ${PORT}
🌐 Environment: ${process.env.NODE_ENV || 'development'}
📝 API Documentation: http://localhost:${PORT}
🔍 Search API: http://localhost:${PORT}/api/search
📄 PDF API: http://localhost:${PORT}/api/pdf
🤖 LangChain API: http://localhost:${PORT}/api/langchain
✅ Health Check: http://localhost:${PORT}/api/search/health

📋 Configuration checklist:
${process.env.PINECONE_API_KEY ? '✅' : '❌'} PINECONE_API_KEY
${process.env.PINECONE_INDEX_NAME ? '✅' : '❌'} PINECONE_INDEX_NAME  
${process.env.GROQ_API_KEY ? '✅' : '❌'} GROQ_API_KEY

${!process.env.PINECONE_API_KEY || !process.env.GROQ_API_KEY ? 
'⚠️  Please configure your environment variables in .env file' : 
'🎉 All required environment variables are configured!'}
  `);
});