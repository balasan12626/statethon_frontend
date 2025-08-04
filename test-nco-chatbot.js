const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3000';

// Test cases for NCO/NCS chatbot
const testCases = [
  {
    name: "NCO Code Question",
    message: "What is NCO code 20215?",
    expectedBehavior: "Should provide detailed information about NCO code 20215"
  },
  {
    name: "JavaScript Question (Should be rejected)",
    message: "Tell me about JavaScript programming",
    expectedBehavior: "Should reject and redirect to NCO/NCS topics only"
  },
  {
    name: "NCS Portal Question",
    message: "How can I apply for jobs through NCS portal?",
    expectedBehavior: "Should provide information about NCS portal usage"
  },
  {
    name: "General Programming Question (Should be rejected)",
    message: "What is Python programming?",
    expectedBehavior: "Should reject and redirect to NCO/NCS topics only"
  },
  {
    name: "Career Guidance Question",
    message: "What are the duties in NCO 20215 job?",
    expectedBehavior: "Should provide detailed job duties for NCO 20215"
  }
];

async function testChatbot() {
  console.log('🧪 Testing NCO/NCS Chatbot...\n');

  for (const testCase of testCases) {
    console.log(`📝 Test: ${testCase.name}`);
    console.log(`💬 Message: "${testCase.message}"`);
    console.log(`🎯 Expected: ${testCase.expectedBehavior}`);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/langchain/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: testCase.message,
          model: "groq"
          // No systemPrompt - will use the enhanced default
        })
      });

      const data = await response.json();
      
      if (data.success) {
        console.log(`✅ Response: ${data.response.substring(0, 200)}...`);
      } else {
        console.log(`❌ Error: ${data.error}`);
      }
      
    } catch (error) {
      console.log(`❌ Network Error: ${error.message}`);
    }
    
    console.log('─'.repeat(80));
  }
}

// Health check first
async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/langchain/health`);
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ LangChain API is healthy');
      console.log(`📊 Models available: ${JSON.stringify(data.models, null, 2)}`);
      return true;
    } else {
      console.log('❌ LangChain API health check failed');
      return false;
    }
  } catch (error) {
    console.log(`❌ Health check failed: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 NCO/NCS Chatbot Testing Suite\n');
  
  // Check health first
  const isHealthy = await checkHealth();
  if (!isHealthy) {
    console.log('❌ Cannot proceed with tests - API is not healthy');
    process.exit(1);
  }
  
  console.log('\n' + '='.repeat(80));
  
  // Run tests
  await testChatbot();
  
  console.log('\n🎉 Testing completed!');
  console.log('\n📋 Summary:');
  console.log('- The chatbot should now ONLY respond to NCO/NCS related questions');
  console.log('- Off-topic questions (JavaScript, programming, etc.) should be rejected');
  console.log('- All responses should focus on Indian government career guidance');
}

main().catch(console.error); 