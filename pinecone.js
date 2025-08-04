const { Pinecone } = require('@pinecone-database/pinecone');
require('dotenv').config();

/**
 * Initialize Pinecone client and return the index
 * @returns {Object} Pinecone index instance
 */
const initializePinecone = () => {
  try {
    // Validate required environment variables
    if (!process.env.PINECONE_API_KEY) {
      throw new Error('PINECONE_API_KEY is required');
    }
    
    if (!process.env.PINECONE_INDEX_NAME) {
      throw new Error('PINECONE_INDEX_NAME is required');
    }

    // Initialize Pinecone client
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    // Get the index
    const index = pinecone.index(process.env.PINECONE_INDEX_NAME);
    
    console.log(`✅ Connected to Pinecone index: ${process.env.PINECONE_INDEX_NAME}`);
    return index;
    
  } catch (error) {
    console.error('❌ Failed to initialize Pinecone:', error.message);
    process.exit(1);
  }
};

module.exports = initializePinecone();