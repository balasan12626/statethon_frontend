<<<<<<< HEAD
# UAE NCO Job Classification Frontend

This is the frontend application for the UAE NCO (National Classification of Occupations) Job Classification system.

## Features

- **Job Description Input**: Users can describe their job responsibilities
- **Voice Input**: Simulated voice input functionality
- **NCO Code Matching**: Connects to backend API to find matching NCO codes
- **Results Display**: Shows detailed match information with scores
- **Export Functionality**: Download results as text files
- **Sharing**: Share results via URL
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Theme**: Toggle between themes
- **Multi-language Support**: Internationalization support

## API Integration

The frontend connects to the backend API at `https://statethon-backend.onrender.com/api/search` with the following specifications:

### Request Format
```json
{
  "text": "Job description text"
}
```

### Response Format
=======
# Node.js LLM Job Matcher

🚀 A powerful Node.js backend that uses LLM + vector search to match user input text to job categories using Pinecone, LangChain.js, and GROQ LLM.

## 🏗️ Architecture

```
User Input (Text/PDF) → Express API → LangChain.js (Embeddings) → Pinecone (Vector Search) → GROQ LLM (Reasoning) → Results
```

## 🛠️ Tech Stack

- **Backend**: Node.js + Express.js
- **Vector Database**: Pinecone
- **Embeddings**: OpenAI text-embedding-ada-002
- **LLM**: GROQ (Mixtral-8x7b-32768)
- **Framework**: LangChain.js
- **PDF Processing**: pdf-parse
- **File Upload**: Multer

## 📦 Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
```bash
# Copy the example config file
cp config-example.env .env

# Edit .env with your API keys
```

3. **Required Environment Variables:**
```env
# Pinecone Configuration
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX_NAME=job-data

# OpenAI Configuration (for embeddings)
OPENAI_API_KEY=your_openai_api_key_here

# GROQ Configuration (for LLM)
GROQ_API_KEY=your_groq_api_key_here

# Server Configuration (optional)
PORT=3000
NODE_ENV=development
```

## 🚀 Quick Start

1. **Start the server:**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

2. **Test the API:**
```bash
# Health check
curl http://localhost:3000/api/search/health

# Test search
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{"text": "I am doing painting"}'
```

## 📋 API Endpoints

### 🔍 Search API

#### POST `/api/search`
Match input text to job categories.

**Request:**
```json
{
  "text": "I am doing painting"
}
```

**Response:**
>>>>>>> 3c362d84fcb8ba51bc69dff3b27676c6810a15e0
```json
{
  "success": true,
  "data": {
<<<<<<< HEAD
    "success": true,
    "input": "Original job description",
    "topMatch": {
      "title": "Job Title",
      "score": 0.95,
      "metadata": {
        "description": "Job description",
        "division": "Division code",
        "family": "Family code",
        "family_title": "Family title",
        "group": "Group code",
        "nco_code": "NCO code",
        "sub_division": "Sub-division code",
        "title": "Job title"
      }
    }
=======
    "input": "I am doing painting",
    "topMatch": {
      "title": "Painter",
      "score": 0.85,
      "metadata": {...}
    },
    "reasoning": "The input 'I am doing painting' directly correlates with the occupation of 'Painter'...",
    "allMatches": [...]
>>>>>>> 3c362d84fcb8ba51bc69dff3b27676c6810a15e0
  }
}
```

<<<<<<< HEAD
## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## Backend Requirements

The backend server is deployed at `https://statethon-backend.onrender.com` and has the `/api/search` endpoint available.

## Error Handling

The application includes comprehensive error handling for:
- Network connectivity issues
- Invalid API responses
- Server errors
- Missing or invalid data

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Dependencies

- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- React Router
- i18next for internationalization
- Lucide React for icons
- React CountUp for animations 
=======
#### POST `/api/search/batch`
Process multiple texts at once.

**Request:**
```json
{
  "texts": ["I am doing painting", "I work in software development"]
}
```

### 📄 PDF API

#### POST `/api/pdf/upload`
Upload PDF, extract text, and match to jobs.

**Request:**
```bash
curl -X POST http://localhost:3000/api/pdf/upload \
  -F "pdf=@resume.pdf"
```

#### POST `/api/pdf/extract-only`
Extract text from PDF without job matching.

## 🏗️ Project Structure

```
├── index.js                 # Main server entry point
├── pinecone.js              # Pinecone client initialization  
├── embedAndQuery.js         # Core processing logic
├── routes/
│   ├── search.js           # Search API endpoints
│   └── pdf.js              # PDF processing endpoints
├── config-example.env      # Environment variables template
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## 🔧 Core Components

### `pinecone.js`
- Initializes Pinecone client
- Validates environment variables
- Exports configured index

### `embedAndQuery.js`
- **`getEmbedding()`**: Generates embeddings using OpenAI
- **`queryPinecone()`**: Searches vector database
- **`askGroq()`**: Gets LLM reasoning
- **`processText()`**: Main processing pipeline

### `routes/search.js`
- Text-based search endpoints
- Input validation
- Batch processing support

### `routes/pdf.js`
- PDF upload and processing
- Text extraction from PDFs
- File validation and error handling

## 🗄️ Data Setup

To populate your Pinecone index with job data, you'll need vectors with metadata like:

```json
{
  "id": "job_001",
  "values": [0.1, 0.2, ...], // 1536-dimensional embedding
  "metadata": {
    "occupationTitle": "Software Developer",
    "description": "Develops software applications...",
    "category": "Technology",
    "skills": ["Programming", "Problem Solving"]
  }
}
```

## 🎯 Example Usage

### JavaScript/Node.js Client
```javascript
const response = await fetch('http://localhost:3000/api/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: 'I am doing painting' })
});

const data = await response.json();
console.log(data.data.topMatch); // Best job match
```

### React Frontend Integration
```jsx
const searchJobs = async (inputText) => {
  try {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: inputText })
    });
    
    const result = await response.json();
    
    if (result.success) {
      setJobMatch(result.data.topMatch);
      setReasoning(result.data.reasoning);
    }
  } catch (error) {
    console.error('Search failed:', error);
  }
};
```

## 🚨 Error Handling

The API includes comprehensive error handling:

- **Input validation** (required fields, length limits)
- **API key validation** (missing credentials)
- **Service timeouts** (30s timeout for LLM calls)
- **Graceful degradation** (fallback reasoning if LLM fails)
- **Detailed error messages** (in development mode)

## 🔍 Monitoring & Logging

The server includes built-in logging:
- Request logging with timestamps
- Processing step indicators
- Error tracking with context
- Health check endpoints

## 🚀 Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure all required API keys
3. Set appropriate CORS origins
4. Consider rate limiting for production

### Recommended Platforms
- **Railway**: Easy Node.js deployment
- **Render**: Free tier available
- **Heroku**: Traditional PaaS
- **DigitalOcean App Platform**: Scalable option

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Start production server
npm start
```

## 📝 TODO

- [ ] Add rate limiting
- [ ] Implement caching for embeddings
- [ ] Add authentication/API keys
- [ ] WebSocket support for real-time updates
- [ ] Metrics and monitoring
- [ ] Docker containerization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

🎉 **Ready to match text to jobs with AI!** Start by setting up your environment variables and testing the API endpoints.
>>>>>>> 3c362d84fcb8ba51bc69dff3b27676c6810a15e0
