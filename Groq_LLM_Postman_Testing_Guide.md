# Groq LLM Postman Testing Guide

## 🚀 Quick Start

1. **Import the Collection**: Import `Groq_LLM_Postman_Collection.json` into Postman
2. **Start Your Server**: Run `npm start` or `node index.js`
3. **Test Health Check**: Start with the "Health Check" request to verify everything is working

## 📋 Available Endpoints

### 1. Health Check
- **URL**: `GET http://localhost:3000/api/langchain/health`
- **Purpose**: Verify Groq API key and model configuration
- **Expected Response**: Status 200 with model availability info

### 2. Get Models
- **URL**: `GET http://localhost:3000/api/langchain/models`
- **Purpose**: Get available LLM models and their configurations
- **Expected Response**: List of available models with settings

### 3. Chat with Groq
- **URL**: `POST http://localhost:3000/api/langchain/chat`
- **Purpose**: Send a message and get a response from Groq LLM
- **Body Example**:
```json
{
  "message": "Hello! Can you help me understand machine learning?",
  "model": "groq",
  "systemPrompt": "You are a helpful AI assistant that explains complex topics in simple terms.",
  "conversationHistory": []
}
```

### 4. Streaming Chat
- **URL**: `POST http://localhost:3000/api/langchain/chat/stream`
- **Purpose**: Get real-time streaming responses from Groq
- **Note**: Enable streaming in Postman settings for best experience

### 5. Batch Chat
- **URL**: `POST http://localhost:3000/api/langchain/chat/batch`
- **Purpose**: Process multiple messages in a single request
- **Body Example**:
```json
{
  "messages": [
    "What is Python?",
    "What is JavaScript?",
    "What is the difference between Python and JavaScript?"
  ],
  "model": "groq",
  "systemPrompt": "You are a programming expert. Provide concise and accurate answers."
}
```

## 🔧 Configuration Verification

### Environment Variables Check
Your `.env` file should contain:
```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama3-8b-8192
GROQ_TEMPERATURE=0.7
GROQ_MAX_TOKENS=4096
```

### Server Startup Verification
When you start your server, you should see:
```
✅ Groq model initialized successfully
🚀 Server is running on port 3000
```

## 🧪 Testing Scenarios

### 1. Basic Chat Test
**Request**:
```json
{
  "message": "What is the capital of France?",
  "model": "groq",
  "systemPrompt": "You are a helpful assistant.",
  "conversationHistory": []
}
```

**Expected Response**:
```json
{
  "success": true,
  "response": "The capital of France is Paris...",
  "model": "groq",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "usage": {
    "model": "llama3-8b-8192",
    "timestamp": "2024-01-01T12:00:00.000Z"
  }
}
```

### 2. Conversation History Test
**Request**:
```json
{
  "message": "What was my previous question?",
  "model": "groq",
  "systemPrompt": "You are a helpful assistant.",
  "conversationHistory": [
    {
      "role": "user",
      "content": "What is the capital of France?"
    },
    {
      "role": "assistant", 
      "content": "The capital of France is Paris."
    }
  ]
}
```

### 3. Job Matching Test
**Request**:
```json
{
  "message": "I have experience in Python, JavaScript, and React. What kind of jobs would be suitable for me?",
  "model": "groq",
  "systemPrompt": "You are a career advisor specializing in tech jobs. Analyze the user's skills and suggest relevant job opportunities with brief explanations.",
  "conversationHistory": []
}
```

### 4. Code Review Test
**Request**:
```json
{
  "message": "Can you review this code: function add(a, b) { return a + b; }",
  "model": "groq",
  "systemPrompt": "You are a senior software engineer. Review code for best practices, potential issues, and improvements.",
  "conversationHistory": []
}
```

## 🚨 Troubleshooting

### Common Issues

1. **"Model not available" Error**
   - Check if `GROQ_API_KEY` is set in your `.env` file
   - Verify the API key is valid
   - Restart the server after changing environment variables

2. **"Invalid request" Error**
   - Ensure `message` field is provided and is a string
   - Check that `model` is set to "groq"
   - Verify JSON format is correct

3. **"Groq API error"**
   - Check your internet connection
   - Verify Groq API key is valid and has credits
   - Check if you've exceeded rate limits

4. **Streaming not working**
   - Enable streaming in Postman settings
   - Use the `/chat/stream` endpoint
   - Check browser console for errors

### Debug Steps

1. **Check Health Endpoint**: Always start with health check
2. **Verify Environment**: Ensure all required env variables are set
3. **Test Simple Request**: Start with a basic chat request
4. **Check Server Logs**: Look for error messages in console
5. **Validate API Key**: Test with a simple curl request

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "response": "AI response text here",
  "model": "groq",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "usage": {
    "model": "llama3-8b-8192",
    "timestamp": "2024-01-01T12:00:00.000Z"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

## 🎯 Advanced Testing

### Testing Different Models
Currently only "groq" model is supported, but you can test different system prompts:

```json
{
  "message": "Your message here",
  "model": "groq",
  "systemPrompt": "You are a [specific role]. [specific instructions]",
  "conversationHistory": []
}
```

### Testing Conversation Context
Maintain conversation history across multiple requests:

```json
{
  "conversationHistory": [
    {"role": "user", "content": "Previous message"},
    {"role": "assistant", "content": "Previous response"}
  ]
}
```

### Testing Batch Processing
Send multiple messages at once:

```json
{
  "messages": [
    "First question",
    "Second question", 
    "Third question"
  ],
  "model": "groq",
  "systemPrompt": "Your system prompt"
}
```

## ✅ Success Checklist

- [ ] Server starts without errors
- [ ] Health check returns 200 status
- [ ] Basic chat request works
- [ ] Conversation history works
- [ ] Streaming works (if needed)
- [ ] Batch processing works
- [ ] Error handling works properly

## 🔗 Useful Links

- [Groq API Documentation](https://console.groq.com/docs)
- [Postman Documentation](https://learning.postman.com/)
- [Express.js Documentation](https://expressjs.com/)

---

**Happy Testing! 🚀** 