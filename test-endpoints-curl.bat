@echo off
echo 🧪 Testing Groq LLM Endpoints with curl
echo ========================================
echo.

set BASE_URL=http://localhost:3000

REM Test 1: Health Check
echo 1️⃣ Testing Health Check...
curl -s -X GET "%BASE_URL%/api/langchain/health"
echo.
echo.

REM Test 2: Get Models
echo 2️⃣ Testing Get Models...
curl -s -X GET "%BASE_URL%/api/langchain/models"
echo.
echo.

REM Test 3: Basic Chat
echo 3️⃣ Testing Basic Chat...
curl -s -X POST "%BASE_URL%/api/langchain/chat" -H "Content-Type: application/json" -d "{\"message\": \"Hello! What is 2 + 2?\", \"model\": \"groq\", \"systemPrompt\": \"You are a helpful math assistant. Provide simple, direct answers.\", \"conversationHistory\": []}"
echo.
echo.

REM Test 4: Conversation History
echo 4️⃣ Testing Conversation History...
curl -s -X POST "%BASE_URL%/api/langchain/chat" -H "Content-Type: application/json" -d "{\"message\": \"What was my previous question?\", \"model\": \"groq\", \"systemPrompt\": \"You are a helpful assistant.\", \"conversationHistory\": [{\"role\": \"user\", \"content\": \"What is the capital of France?\"}, {\"role\": \"assistant\", \"content\": \"The capital of France is Paris.\"}]}"
echo.
echo.

REM Test 5: Batch Chat
echo 5️⃣ Testing Batch Chat...
curl -s -X POST "%BASE_URL%/api/langchain/chat/batch" -H "Content-Type: application/json" -d "{\"messages\": [\"What is Python?\", \"What is JavaScript?\"], \"model\": \"groq\", \"systemPrompt\": \"You are a programming expert. Provide concise answers.\"}"
echo.
echo.

echo 🎉 All curl tests completed!
echo Now you can test these same endpoints in Postman!
pause 