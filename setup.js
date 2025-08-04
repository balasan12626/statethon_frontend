#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

/**
 * Interactive setup script for the Node.js LLM Job Matcher
 */

console.log(`
🚀 Node.js LLM Job Matcher Setup
================================

This script will help you set up your environment variables and get started quickly.
`);

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'config-example.env');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from template...');
  
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env file');
  } else {
    // Create basic .env file
    const basicEnv = `# Server Configuration
PORT=3001
NODE_ENV=development

# Pinecone Configuration (for vector database)
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX_NAME=job-data

# GROQ Configuration (for LLM reasoning)
GROQ_API_KEY=your_groq_api_key_here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
`;
    fs.writeFileSync(envPath, basicEnv);
    console.log('✅ Created basic .env file');
  }
} else {
  console.log('✅ .env file already exists');
}

console.log(`
🔧 Next Steps:
==============

1. 📝 Edit your .env file with your API keys:
   - Get Pinecone API key from: https://www.pinecone.io/
   - Get GROQ API key from: https://console.groq.com/keys

2. 🗄️ Set up your Pinecone index:
   - Create an index named "job-data" with dimension 1536
   - Use cosine similarity metric

3. 📊 Populate your index with sample data:
   node sampleData.js populate

4. 🚀 Start the development server:
   npm run dev

5. 🧪 Test the API:
   curl -X POST http://localhost:3000/api/search \\
     -H "Content-Type: application/json" \\
     -d '{"text": "I am doing painting"}'

📋 Available Commands:
=====================

Development:
  npm run dev         # Start with auto-reload
  npm start          # Start production server

Data Management:
  node sampleData.js populate   # Add sample job data
  node sampleData.js stats      # Show index statistics
  node sampleData.js clear      # Clear all data ⚠️

API Endpoints:
  POST /api/search              # Text-based job matching
  POST /api/search/batch        # Batch processing
  POST /api/pdf/upload          # PDF upload and processing
  GET  /api/search/health       # Health check

📚 Documentation:
================
  
Check README.md for detailed documentation and examples.

🎉 You're all set! Edit your .env file and start building amazing AI-powered job matching features!
`);

// Check if we can run npm commands
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  console.log('\n🔍 Checking environment setup...\n');
  
  // Load and check .env
  require('dotenv').config();
  
  const checks = [
    { name: 'PINECONE_API_KEY', value: process.env.PINECONE_API_KEY },
    { name: 'PINECONE_INDEX_NAME', value: process.env.PINECONE_INDEX_NAME },
    { name: 'GROQ_API_KEY', value: process.env.GROQ_API_KEY }
  ];
  
  checks.forEach(check => {
    const status = check.value && check.value !== `your_${check.name.toLowerCase()}_here` ? '✅' : '❌';
    console.log(`${status} ${check.name}`);
  });
  
  const allConfigured = checks.every(check => 
    check.value && check.value !== `your_${check.name.toLowerCase()}_here`
  );
  
  if (allConfigured) {
    console.log('\n🎉 All environment variables are configured!');
    console.log('\n🚀 Ready to start: npm run dev');
  } else {
    console.log('\n⚠️  Please configure your environment variables in .env file');
    console.log('💡 Run this setup script again after updating your .env file');
  }
}

console.log('\n' + '='.repeat(60) + '\n');