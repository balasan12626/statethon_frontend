const axios = require("axios");
const index = require("./pinecone");
require("dotenv").config();

/**
 * Simple TF-IDF based embedding generator (no external model downloads needed)
 * @param {string} input - Text to embed
 * @returns {Promise<number[]>} - Embedding vector
 */
const getEmbedding = async (input) => {
  try {
    console.log(`🔄 Generating embedding for: "${input.substring(0, 50)}..."`);
    
    // Simple word frequency based embedding (384 dimensions)
    const words = input.toLowerCase().split(/\s+/).filter(word => word.length > 2);
    const vector = new Array(384).fill(0);
    
    // Create a simple hash-based embedding
    words.forEach((word, index) => {
      const hash = word.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      const position = Math.abs(hash) % 384;
      vector[position] += 1;
    });
    
    // Normalize the vector
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (magnitude > 0) {
      for (let i = 0; i < vector.length; i++) {
        vector[i] = vector[i] / magnitude;
      }
    }
    
    console.log(`✅ Generated embedding with ${vector.length} dimensions`);
    return vector;
  } catch (error) {
    console.error('❌ Error generating embedding:', error.message);
    throw error;
  }
};

/**
 * Query Pinecone with embedding vector
 * @param {number[]} vector - Embedding vector
 * @param {number} topK - Number of results to return
 * @returns {Promise<Object>} - Pinecone query results
 */
const queryPinecone = async (vector, topK = 3) => {
  try {
    console.log(`🔄 Querying Pinecone for top ${topK} matches...`);
    
    const results = await index.query({
      topK,
      vector,
      includeMetadata: true,
    });
    
    console.log(`✅ Found ${results.matches.length} matches`);
    return results;
  } catch (error) {
    console.error('❌ Error querying Pinecone:', error.message);
    throw error;
  }
};

/**
 * Get reasoning from GROQ LLM
 * @param {string} prompt - Prompt for the LLM
 * @returns {Promise<string>} - LLM response
 */
const askGroq = async (prompt) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is required for LLM reasoning');
    }

    console.log('🔄 Getting reasoning from GROQ LLM...');
    
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "mixtral-8x7b-32768", // You can change to other supported models
        messages: [{ 
          role: "user", 
          content: prompt 
        }],
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000 // 30 second timeout
      }
    );
    
    const reasoning = response.data.choices[0].message.content;
    console.log('✅ Generated reasoning from GROQ LLM');
    
    return reasoning;
  } catch (error) {
    console.error('❌ Error with GROQ LLM:', error.message);
    
    // Provide fallback reasoning if LLM fails
    return "Unable to generate detailed reasoning at this time, but the semantic match suggests a strong correlation between your input and the matched job category.";
  }
};

/**
 * Main processing function that combines embedding, vector search, and LLM reasoning
 * @param {string} text - Input text to process
 * @returns {Promise<Object>} - Processing results
 */
const processText = async (text) => {
  try {
    if (!text || text.trim().length === 0) {
      throw new Error('Input text is required');
    }

    console.log(`🚀 Processing text: "${text}"`);
    
    // Step 1: Generate embedding
    const vector = await getEmbedding(text);
    
    // Step 2: Query Pinecone
    const results = await queryPinecone(vector);
    
    if (!results.matches || results.matches.length === 0) {
      return {
        success: false,
        message: "No matching job data found",
        matches: []
      };
    }
    
    const topMatch = results.matches[0];
    console.log(`🎯 Top match: ${topMatch.metadata?.occupationTitle || 'Unknown'} (score: ${topMatch.score})`);
    
    // Step 3: Generate reasoning with LLM
    const prompt = `
Input Text: "${text}"

Best Matched Job Title: "${topMatch.metadata?.occupationTitle || 'Unknown Position'}"
Match Confidence Score: ${topMatch.score}

Additional Context: ${topMatch.metadata?.description || 'No additional description available'}

Please explain how the input text relates to this job title. Provide a clear, concise explanation of the connection and why this match makes sense. Keep your response under 200 words.`;

    const reasoning = await askGroq(prompt);
    
    // Return comprehensive results
    const result = {
      success: true,
      input: text,
      topMatch: {
        title: topMatch.metadata?.occupationTitle || 'Unknown',
        score: topMatch.score,
        metadata: topMatch.metadata || {},
        id: topMatch.id
      },
      allMatches: results.matches.map(match => ({
        title: match.metadata?.occupationTitle || 'Unknown',
        score: match.score,
        metadata: match.metadata || {},
        id: match.id
      })),
      reasoning,
      timestamp: new Date().toISOString()
    };
    
    console.log('✅ Processing completed successfully');
    return result;
    
  } catch (error) {
    console.error('❌ Error processing text:', error.message);
    return {
      success: false,
      error: error.message,
      input: text,
      timestamp: new Date().toISOString()
    };
  }
};

module.exports = { 
  processText,
  getEmbedding,
  queryPinecone,
  askGroq
};