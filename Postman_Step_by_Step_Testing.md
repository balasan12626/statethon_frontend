# 🧪 Postman Step-by-Step Testing Guide

## 🚀 Server Status: RUNNING on http://localhost:3000

Your server is now running and ready for testing!

---

## 📋 Testing Each Endpoint in Postman

### 1️⃣ **Health Check** - Verify Groq is Working

**Method**: `GET`  
**URL**: `http://localhost:3000/api/langchain/health`

**Steps in Postman:**
1. Create new request
2. Set method to `GET`
3. Enter URL: `http://localhost:3000/api/langchain/health`
4. Click **Send**

**Expected Response:**
```json
{
  "success": true,
  "message": "LangChain Chatbot API is healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "models": {
    "groq": {
      "available": true,
      "model": "llama3-8b-8192",
      "apiKeyConfigured": true,
      "temperature": 0.7,
      "maxTokens": 4096
    }
  },
  "endpoints": {
    "chat": "POST /api/langchain/chat",
    "chatStream": "POST /api/langchain/chat/stream",
    "batchChat": "POST /api/langchain/chat/batch",
    "models": "GET /api/langchain/models",
    "health": "GET /api/langchain/health"
  }
}
```

**✅ Success Indicators:**
- Status: `200 OK`
- `"success": true`
- `"groq.available": true`

---

### 2️⃣ **Get Available Models** - Check Model Configuration

**Method**: `GET`  
**URL**: `http://localhost:3000/api/langchain/models`

**Steps in Postman:**
1. Create new request
2. Set method to `GET`
3. Enter URL: `http://localhost:3000/api/langchain/models`
4. Click **Send**

**Expected Response:**
```json
{
  "success": true,
  "models": {
    "groq": {
      "name": "Groq",
      "available": true,
      "model": "llama3-8b-8192",
      "description": "Fast inference with Groq's optimized models",
      "temperature": 0.7,
      "maxTokens": 4096
    }
  }
}
```

**✅ Success Indicators:**
- Status: `200 OK`
- `"success": true`
- Groq model is listed and available

---

### 3️⃣ **Basic Chat** - Test Simple Conversation

**Method**: `POST`  
**URL**: `http://localhost:3000/api/langchain/chat`

**Steps in Postman:**
1. Create new request
2. Set method to `POST`
3. Enter URL: `http://localhost:3000/api/langchain/chat`
4. Go to **Headers** tab
5. Add header: `Content-Type: application/json`
6. Go to **Body** tab
7. Select **raw** and **JSON**
8. Paste this JSON:
```json
{
  "message": "Hello! What is 2 + 2?",
  "model": "groq",
  "systemPrompt": "You are a helpful math assistant. Provide simple, direct answers.",
  "conversationHistory": []
}
```
9. Click **Send**

**Expected Response:**
```json
{
  "success": true,
  "response": "The answer to 2 + 2 is 4.",
  "model": "groq",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "usage": {
    "model": "llama3-8b-8192",
    "timestamp": "2024-01-01T12:00:00.000Z"
  }
}
```

**✅ Success Indicators:**
- Status: `200 OK`
- `"success": true`
- You get a meaningful response from Groq

---

### 4️⃣ **Streaming Chat** - Real-time Responses

**Method**: `POST`  
**URL**: `http://localhost:3000/api/langchain/chat/stream`

**Steps in Postman:**
1. Create new request
2. Set method to `POST`
3. Enter URL: `http://localhost:3000/api/langchain/chat/stream`
4. Go to **Headers** tab
5. Add header: `Content-Type: application/json`
6. Go to **Body** tab
7. Select **raw** and **JSON**
8. Paste this JSON:
```json
{
  "message": "Write a short story about a robot learning to paint.",
  "model": "groq",
  "systemPrompt": "You are a creative storyteller. Write engaging short stories.",
  "conversationHistory": []
}
```
9. Click **Send**

**Expected Response:**
You'll see streaming data like:
```
data: {"content":"Once","model":"groq","timestamp":"2024-01-01T12:00:00.000Z"}

data: {"content":" upon","model":"groq","timestamp":"2024-01-01T12:00:00.000Z"}

data: {"content":" a","model":"groq","timestamp":"2024-01-01T12:00:00.000Z"}

data: [DONE]
```

**✅ Success Indicators:**
- Status: `200 OK`
- You see streaming data chunks
- Response ends with `[DONE]`

---

### 5️⃣ **Batch Chat** - Multiple Messages

**Method**: `POST`  
**URL**: `http://localhost:3000/api/langchain/chat/batch`

**Steps in Postman:**
1. Create new request
2. Set method to `POST`
3. Enter URL: `http://localhost:3000/api/langchain/chat/batch`
4. Go to **Headers** tab
5. Add header: `Content-Type: application/json`
6. Go to **Body** tab
7. Select **raw** and **JSON`
8. Paste this JSON:
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
9. Click **Send**

**Expected Response:**
```json
{
  "success": true,
  "responses": [
    {
      "input": "What is Python?",
      "response": "Python is a high-level programming language...",
      "success": true
    },
    {
      "input": "What is JavaScript?",
      "response": "JavaScript is a programming language...",
      "success": true
    },
    {
      "input": "What is the difference between Python and JavaScript?",
      "response": "Python and JavaScript are both programming languages...",
      "success": true
    }
  ],
  "model": "groq",
  "totalTime": 1500,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**✅ Success Indicators:**
- Status: `200 OK`
- `"success": true`
- All messages in the batch are processed successfully

---

## 🎯 **Advanced Testing Scenarios**

### Test 1: Conversation History
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

### Test 2: Job Matching
```json
{
  "message": "I have experience in Python, JavaScript, and React. What kind of jobs would be suitable for me?",
  "model": "groq",
  "systemPrompt": "You are a career advisor specializing in tech jobs. Analyze the user's skills and suggest relevant job opportunities with brief explanations.",
  "conversationHistory": []
}
```

### Test 3: Code Review
```json
{
  "message": "Can you review this code: function add(a, b) { return a + b; }",
  "model": "groq",
  "systemPrompt": "You are a senior software engineer. Review code for best practices, potential issues, and improvements.",
  "conversationHistory": []
}
```

---

## 🚨 **Troubleshooting Common Issues**

### Issue 1: "Connection refused"
**Solution**: Make sure your server is running with `node index.js`

### Issue 2: "Model not available"
**Solution**: Check your `123.env` file has the correct `GROQ_API_KEY`

### Issue 3: "Invalid request"
**Solution**: Ensure your JSON is properly formatted and all required fields are present

### Issue 4: "Groq API error"
**Solution**: Check your internet connection and verify your Groq API key is valid

---

## ✅ **Success Checklist**

- [ ] Health check returns 200 with `"groq.available": true`
- [ ] Models endpoint shows Groq as available
- [ ] Basic chat returns meaningful responses
- [ ] Streaming chat shows real-time data
- [ ] Batch chat processes all messages successfully
- [ ] All endpoints return `"success": true`

---

## 🎉 **You're Ready!**

Once you've tested all endpoints successfully, your Groq LLM integration is working perfectly in Postman! 🚀 