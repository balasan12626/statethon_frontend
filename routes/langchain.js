const express = require("express");
const router = express.Router();

// Initialize LLM models
let groqModel = null;

// Initialize Groq model using direct API calls
const initializeGroq = () => {
  if (!process.env.GROQ_API_KEY) {
    console.warn("⚠️ GROQ_API_KEY not found in environment variables");
    return null;
  }
  
  try {
    // Create a simple Groq client wrapper
    const groqClient = {
      modelName: process.env.GROQ_MODEL || "llama3-8b-8192",
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
      
      async invoke(messages) {
        const response = await fetch(`${this.baseURL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: this.modelName,
            messages: messages.map(msg => ({
              role: msg._getType() === 'human' ? 'user' : 'assistant',
              content: msg.content
            })),
            temperature: parseFloat(process.env.GROQ_TEMPERATURE) || 0.7,
            max_tokens: parseInt(process.env.GROQ_MAX_TOKENS) || 4096
          })
        });

        if (!response.ok) {
          throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
      },

      async stream(messages) {
        const response = await fetch(`${this.baseURL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: this.modelName,
            messages: messages.map(msg => ({
              role: msg._getType() === 'human' ? 'user' : 'assistant',
              content: msg.content
            })),
            temperature: parseFloat(process.env.GROQ_TEMPERATURE) || 0.7,
            max_tokens: parseInt(process.env.GROQ_MAX_TOKENS) || 4096,
            stream: true
          })
        });

        if (!response.ok) {
          throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
        }

        return response.body;
      }
    };

    console.log("✅ Groq model initialized successfully");
    return groqClient;
  } catch (error) {
    console.error("❌ Error initializing Groq model:", error.message);
    return null;
  }
};

// Initialize models on startup
groqModel = initializeGroq();

// Health check endpoint for LangChain chatbot
router.get("/health", async (req, res) => {
  try {
    const healthStatus = {
      success: true,
      message: "LangChain Chatbot API is healthy",
      timestamp: new Date().toISOString(),
      models: {
        groq: {
          available: groqModel !== null,
          model: process.env.GROQ_MODEL || "llama3-8b-8192",
          apiKeyConfigured: !!process.env.GROQ_API_KEY,
          temperature: process.env.GROQ_TEMPERATURE || 0.7,
          maxTokens: process.env.GROQ_MAX_TOKENS || 4096
        }
      },
      endpoints: {
        chat: "POST /api/langchain/chat",
        chatStream: "POST /api/langchain/chat/stream",
        batchChat: "POST /api/langchain/chat/batch",
        models: "GET /api/langchain/models",
        health: "GET /api/langchain/health"
      }
    };

    res.json(healthStatus);
  } catch (error) {
    console.error("❌ Health check error:", error);
    res.status(500).json({
      success: false,
      error: "Health check failed",
      message: error.message
    });
  }
});

// Get available models
router.get("/models", async (req, res) => {
  try {
    const models = {
      success: true,
      models: {
        groq: {
          name: "Groq",
          available: groqModel !== null,
          model: process.env.GROQ_MODEL || "llama3-8b-8192",
          description: "Fast inference with Groq's optimized models",
          temperature: process.env.GROQ_TEMPERATURE || 0.7,
          maxTokens: process.env.GROQ_MAX_TOKENS || 4096
        }
      }
    };

    res.json(models);
  } catch (error) {
    console.error("❌ Error getting models:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get models",
      message: error.message
    });
  }
});

// Chat endpoint with model selection
router.post("/chat", async (req, res) => {
  try {
    const { message, model = "groq", systemPrompt, conversationHistory = [] } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        error: "Invalid request",
        message: "Message is required and must be a string"
      });
    }

    // Select the appropriate model
    let selectedModel = null;
    if (model.toLowerCase() === "groq") {
      selectedModel = groqModel;
    } else {
      return res.status(400).json({
        success: false,
        error: "Invalid model",
        message: "Model must be 'groq'"
      });
    }

    if (!selectedModel) {
      return res.status(503).json({
        success: false,
        error: "Model not available",
        message: `${model} model is not configured or available`
      });
    }

    // Prepare messages
    const messages = [];
    
    // Add enhanced system prompt for NCO/NCS focus
    const enhancedSystemPrompt = systemPrompt || `You are a specialized NCO/NCS career assistant chatbot. Your ONLY purpose is to help with Indian National Classification of Occupations (NCO) and National Career Service (NCS) related questions. 

IMPORTANT RULES:
1. ONLY answer questions about NCO codes, NCS portal, Indian government job classifications, career guidance for Indian jobs
2. If asked about ANY other topic (JavaScript, programming, general topics, etc.), respond with: "I am a specialized NCO/NCS career assistant. I can only help with Indian National Classification of Occupations (NCO) and National Career Service (NCS) related questions. Please ask me about NCO codes, job classifications, career guidance, or NCS portal information."
3. Focus specifically on NCO Code 20215 when relevant
4. Provide information from official Indian government sources only
5. Be clear, career-focused, and helpful to Indian job seekers and students

Your expertise covers:
- NCO codes and job classifications
- NCS portal usage and job applications
- Indian government career guidance
- Job duties, skills, and qualifications
- Training and certification requirements
- Career progression paths

Do not provide information on any other topics.`;

    messages.push({ _getType: () => 'system', content: enhancedSystemPrompt });

    // Add conversation history
    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      conversationHistory.forEach(msg => {
        if (msg.role === "user") {
          messages.push({ _getType: () => 'human', content: msg.content });
        } else if (msg.role === "assistant") {
          messages.push({ _getType: () => 'assistant', content: msg.content });
        }
      });
    }

    // Add current user message
    messages.push({ _getType: () => 'human', content: message });

    // Get response
    const response = await selectedModel.invoke(messages);

    res.json({
      success: true,
      response: response,
      model: model,
      timestamp: new Date().toISOString(),
      usage: {
        model: selectedModel.modelName || model,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("❌ Chat error:", error);
    res.status(500).json({
      success: false,
      error: "Chat failed",
      message: error.message
    });
  }
});

// Streaming chat endpoint
router.post("/chat/stream", async (req, res) => {
  try {
    const { message, model = "groq", systemPrompt, conversationHistory = [] } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        error: "Invalid request",
        message: "Message is required and must be a string"
      });
    }

    // Select the appropriate model
    let selectedModel = null;
    if (model.toLowerCase() === "groq") {
      selectedModel = groqModel;
    } else {
      return res.status(400).json({
        success: false,
        error: "Invalid model",
        message: "Model must be 'groq'"
      });
    }

    if (!selectedModel) {
      return res.status(503).json({
        success: false,
        error: "Model not available",
        message: `${model} model is not configured or available`
      });
    }

    // Set headers for streaming
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Prepare messages
    const messages = [];
    
    // Add enhanced system prompt for NCO/NCS focus
    const enhancedSystemPrompt = systemPrompt || `You are a specialized NCO/NCS career assistant chatbot. Your ONLY purpose is to help with Indian National Classification of Occupations (NCO) and National Career Service (NCS) related questions. 

IMPORTANT RULES:
1. ONLY answer questions about NCO codes, NCS portal, Indian government job classifications, career guidance for Indian jobs
2. If asked about ANY other topic (JavaScript, programming, general topics, etc.), respond with: "I am a specialized NCO/NCS career assistant. I can only help with Indian National Classification of Occupations (NCO) and National Career Service (NCS) related questions. Please ask me about NCO codes, job classifications, career guidance, or NCS portal information."
3. Focus specifically on NCO Code 20215 when relevant
4. Provide information from official Indian government sources only
5. Be clear, career-focused, and helpful to Indian job seekers and students

Your expertise covers:
- NCO codes and job classifications
- NCS portal usage and job applications
- Indian government career guidance
- Job duties, skills, and qualifications
- Training and certification requirements
- Career progression paths

Do not provide information on any other topics.`;

    messages.push({ _getType: () => 'system', content: enhancedSystemPrompt });

    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      conversationHistory.forEach(msg => {
        if (msg.role === "user") {
          messages.push({ _getType: () => 'human', content: msg.content });
        } else if (msg.role === "assistant") {
          messages.push({ _getType: () => 'assistant', content: msg.content });
        }
      });
    }

    messages.push({ _getType: () => 'human', content: message });

    // Stream the response
    const stream = await selectedModel.stream(messages);
    
    const reader = stream.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              res.write(`data: [DONE]\n\n`);
              break;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.content) {
                res.write(`data: ${JSON.stringify({
                  content: parsed.choices[0].delta.content,
                  model: model,
                  timestamp: new Date().toISOString()
                })}\n\n`);
              }
            } catch (e) {
              // Ignore parsing errors for incomplete chunks
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    res.write(`data: [DONE]\n\n`);
    res.end();

  } catch (error) {
    console.error("❌ Streaming chat error:", error);
    res.write(`data: ${JSON.stringify({
      error: "Streaming failed",
      message: error.message
    })}\n\n`);
    res.end();
  }
});

// Batch chat endpoint for multiple messages
router.post("/chat/batch", async (req, res) => {
  try {
    const { messages, model = "groq", systemPrompt } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid request",
        message: "Messages array is required and must not be empty"
      });
    }

    // Select the appropriate model
    let selectedModel = null;
    if (model.toLowerCase() === "groq") {
      selectedModel = groqModel;
    } else {
      return res.status(400).json({
        success: false,
        error: "Invalid model",
        message: "Model must be 'groq'"
      });
    }

    if (!selectedModel) {
      return res.status(503).json({
        success: false,
        error: "Model not available",
        message: `${model} model is not configured or available`
      });
    }

    const responses = [];
    const startTime = Date.now();

    for (const userMessage of messages) {
      try {
        const messages = [];
        
        // Add enhanced system prompt for NCO/NCS focus
        const enhancedSystemPrompt = systemPrompt || `You are a specialized NCO/NCS career assistant chatbot. Your ONLY purpose is to help with Indian National Classification of Occupations (NCO) and National Career Service (NCS) related questions. 

IMPORTANT RULES:
1. ONLY answer questions about NCO codes, NCS portal, Indian government job classifications, career guidance for Indian jobs
2. If asked about ANY other topic (JavaScript, programming, general topics, etc.), respond with: "I am a specialized NCO/NCS career assistant. I can only help with Indian National Classification of Occupations (NCO) and National Career Service (NCS) related questions. Please ask me about NCO codes, job classifications, career guidance, or NCS portal information."
3. Focus specifically on NCO Code 20215 when relevant
4. Provide information from official Indian government sources only
5. Be clear, career-focused, and helpful to Indian job seekers and students

Your expertise covers:
- NCO codes and job classifications
- NCS portal usage and job applications
- Indian government career guidance
- Job duties, skills, and qualifications
- Training and certification requirements
- Career progression paths

Do not provide information on any other topics.`;

        messages.push({ _getType: () => 'system', content: enhancedSystemPrompt });

        messages.push({ _getType: () => 'human', content: userMessage });

        const response = await selectedModel.invoke(messages);
        
        responses.push({
          input: userMessage,
          response: response,
          success: true
        });
      } catch (error) {
        responses.push({
          input: userMessage,
          response: null,
          success: false,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      responses: responses,
      model: model,
      totalTime: Date.now() - startTime,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("❌ Batch chat error:", error);
    res.status(500).json({
      success: false,
      error: "Batch chat failed",
      message: error.message
    });
  }
});

module.exports = router; 