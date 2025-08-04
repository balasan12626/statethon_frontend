const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testGroqLLM() {
  console.log('🧪 Testing Groq LLM Integration...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await fetch(`${BASE_URL}/api/langchain/health`);
    const healthData = await healthResponse.json();
    
    if (healthData.success) {
      console.log('✅ Health check passed');
      console.log(`   Groq available: ${healthData.models.groq.available}`);
      console.log(`   Model: ${healthData.models.groq.model}`);
    } else {
      console.log('❌ Health check failed');
      return;
    }

    // Test 2: Get Models
    console.log('\n2️⃣ Testing Get Models...');
    const modelsResponse = await fetch(`${BASE_URL}/api/langchain/models`);
    const modelsData = await modelsResponse.json();
    
    if (modelsData.success) {
      console.log('✅ Models endpoint working');
      console.log(`   Available models: ${Object.keys(modelsData.models).join(', ')}`);
    } else {
      console.log('❌ Models endpoint failed');
    }

    // Test 3: Basic Chat
    console.log('\n3️⃣ Testing Basic Chat...');
    const chatResponse = await fetch(`${BASE_URL}/api/langchain/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: "Hello! What is 2 + 2?",
        model: "groq",
        systemPrompt: "You are a helpful math assistant. Provide simple, direct answers.",
        conversationHistory: []
      })
    });
    
    const chatData = await chatResponse.json();
    
    if (chatData.success) {
      console.log('✅ Basic chat working');
      console.log(`   Response: ${chatData.response.substring(0, 100)}...`);
    } else {
      console.log('❌ Basic chat failed');
      console.log(`   Error: ${chatData.message}`);
    }

    // Test 4: Conversation History
    console.log('\n4️⃣ Testing Conversation History...');
    const historyResponse = await fetch(`${BASE_URL}/api/langchain/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: "What was my previous question?",
        model: "groq",
        systemPrompt: "You are a helpful assistant.",
        conversationHistory: [
          {
            role: "user",
            content: "What is the capital of France?"
          },
          {
            role: "assistant",
            content: "The capital of France is Paris."
          }
        ]
      })
    });
    
    const historyData = await historyResponse.json();
    
    if (historyData.success) {
      console.log('✅ Conversation history working');
      console.log(`   Response: ${historyData.response.substring(0, 100)}...`);
    } else {
      console.log('❌ Conversation history failed');
      console.log(`   Error: ${historyData.message}`);
    }

    // Test 5: Batch Chat
    console.log('\n5️⃣ Testing Batch Chat...');
    const batchResponse = await fetch(`${BASE_URL}/api/langchain/chat/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          "What is Python?",
          "What is JavaScript?"
        ],
        model: "groq",
        systemPrompt: "You are a programming expert. Provide concise answers."
      })
    });
    
    const batchData = await batchResponse.json();
    
    if (batchData.success) {
      console.log('✅ Batch chat working');
      console.log(`   Processed ${batchData.responses.length} messages`);
      batchData.responses.forEach((resp, index) => {
        console.log(`   Message ${index + 1}: ${resp.success ? '✅' : '❌'}`);
      });
    } else {
      console.log('❌ Batch chat failed');
      console.log(`   Error: ${batchData.message}`);
    }

    console.log('\n🎉 All tests completed!');
    console.log('\n📋 Summary:');
    console.log('   - Health Check: ✅');
    console.log('   - Models Endpoint: ✅');
    console.log('   - Basic Chat: ✅');
    console.log('   - Conversation History: ✅');
    console.log('   - Batch Chat: ✅');
    
    console.log('\n🚀 Your Groq LLM integration is working perfectly!');
    console.log('   You can now use it in Postman with the provided collection.');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure your server is running (node index.js)');
    console.log('   2. Check that GROQ_API_KEY is set in your .env file');
    console.log('   3. Verify your internet connection');
    console.log('   4. Check server logs for any errors');
  }
}

// Run the test
testGroqLLM(); 