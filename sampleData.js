// Replace static require with dynamic import for ES module compatibility
let HuggingFaceTransformersEmbeddings;
(async () => {
  ({ HuggingFaceTransformersEmbeddings } = await import("@langchain/community/embeddings/hf_transformers"));
})();
const index = require("./pinecone");
require("dotenv").config();

/**
 * Sample job data to populate Pinecone index
 * In a real application, this would come from your job database
 */
const sampleJobs = [
  {
    id: "job_001",
    occupationTitle: "Software Developer",
    description: "Develops software applications and systems using programming languages like JavaScript, Python, Java. Works on frontend, backend, or full-stack development.",
    category: "Technology",
    skills: ["Programming", "Problem Solving", "Software Design", "Testing"],
    textContent: "software developer programming coding javascript python java web development applications systems"
  },
  {
    id: "job_002", 
    occupationTitle: "Painter",
    description: "Applies paint, stain, and coatings to walls, buildings, bridges, and other structures. Works with brushes, rollers, and spray equipment.",
    category: "Construction & Trades",
    skills: ["Painting", "Color Theory", "Surface Preparation", "Equipment Operation"],
    textContent: "painter painting paint walls buildings brushes rollers spray coating stain"
  },
  {
    id: "job_003",
    occupationTitle: "Graphic Designer", 
    description: "Creates visual concepts and designs for print and digital media. Uses software like Photoshop, Illustrator, and InDesign.",
    category: "Creative Arts",
    skills: ["Design", "Creativity", "Adobe Creative Suite", "Typography"],
    textContent: "graphic designer design visual concepts photoshop illustrator creative art typography"
  },
  {
    id: "job_004",
    occupationTitle: "Teacher",
    description: "Educates students in various subjects, creates lesson plans, and assesses student progress. Works in schools, colleges, or training centers.",
    category: "Education",
    skills: ["Teaching", "Communication", "Curriculum Development", "Student Assessment"],
    textContent: "teacher education teaching students lesson plans curriculum school college training"
  },
  {
    id: "job_005",
    occupationTitle: "Chef",
    description: "Prepares and cooks food in restaurants, hotels, or catering services. Plans menus, manages kitchen staff, and ensures food quality.",
    category: "Food Service",
    skills: ["Cooking", "Menu Planning", "Food Safety", "Kitchen Management"],
    textContent: "chef cooking food preparation restaurant kitchen menu planning culinary"
  },
  {
    id: "job_006",
    occupationTitle: "Nurse",
    description: "Provides medical care and support to patients in hospitals, clinics, or healthcare facilities. Administers medications and monitors patient health.",
    category: "Healthcare", 
    skills: ["Patient Care", "Medical Knowledge", "Communication", "Critical Thinking"],
    textContent: "nurse nursing healthcare medical care patients hospital clinic medications health"
  },
  {
    id: "job_007",
    occupationTitle: "Marketing Manager",
    description: "Develops and implements marketing strategies to promote products or services. Manages advertising campaigns and analyzes market trends.",
    category: "Business & Marketing",
    skills: ["Marketing Strategy", "Campaign Management", "Market Analysis", "Communication"],
    textContent: "marketing manager advertising campaigns promotion market analysis business strategy"
  },
  {
    id: "job_008",
    occupationTitle: "Electrician",
    description: "Installs, maintains, and repairs electrical systems in homes, businesses, and industrial facilities. Works with wiring, circuits, and electrical equipment.",
    category: "Construction & Trades", 
    skills: ["Electrical Systems", "Wiring", "Safety Protocols", "Problem Solving"],
    textContent: "electrician electrical systems wiring circuits installation repair maintenance power"
  },
  {
    id: "job_009",
    occupationTitle: "Data Scientist",
    description: "Analyzes complex data to extract insights and patterns. Uses statistical methods, machine learning, and programming to solve business problems.",
    category: "Technology",
    skills: ["Data Analysis", "Machine Learning", "Statistics", "Python", "R"],
    textContent: "data scientist analytics statistics machine learning python analysis insights patterns"
  },
  {
    id: "job_010",
    occupationTitle: "Carpenter",
    description: "Constructs, repairs, and installs building frameworks and structures made of wood and other materials. Works on residential and commercial projects.",
    category: "Construction & Trades",
    skills: ["Woodworking", "Construction", "Blueprint Reading", "Tool Operation"],
    textContent: "carpenter construction woodworking building frameworks structures residential commercial tools"
  }
];

/**
 * Generate embeddings for sample job data and upload to Pinecone
 */
async function populatePineconeIndex() {
  try {
    console.log("🚀 Starting Pinecone index population...");
    
    const vectors = [];

    // Generate embeddings for each job
    for (const job of sampleJobs) {
      console.log(`🔄 Processing: ${job.occupationTitle}`);
      
      // Create text for embedding (combine title, description, and skills)
      const textForEmbedding = `${job.occupationTitle} ${job.description} ${job.skills.join(' ')} ${job.textContent}`;
      
      // Generate embedding using simple TF-IDF approach
      const words = textForEmbedding.toLowerCase().split(/\s+/).filter(word => word.length > 2);
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
      
      vectors.push({
        id: job.id,
        values: vector,
        metadata: {
          occupationTitle: job.occupationTitle,
          description: job.description,
          category: job.category,
          skills: job.skills,
          textContent: job.textContent
        }
      });
      
      console.log(`✅ Generated embedding for: ${job.occupationTitle}`);
    }

    // Upload vectors to Pinecone in batches
    console.log(`📤 Uploading ${vectors.length} vectors to Pinecone...`);
    
    const batchSize = 100;
    for (let i = 0; i < vectors.length; i += batchSize) {
      const batch = vectors.slice(i, i + batchSize);
      await index.upsert(batch);
      console.log(`✅ Uploaded batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(vectors.length/batchSize)}`);
    }

    console.log("🎉 Successfully populated Pinecone index with sample job data!");
    console.log(`📊 Total jobs uploaded: ${vectors.length}`);
    
    // Test a quick search
    console.log("\n🔍 Testing search functionality...");
    const testWords = "I work with computers and code".toLowerCase().split(/\s+/).filter(word => word.length > 2);
    const testVector = new Array(384).fill(0);
    
    testWords.forEach((word, index) => {
      const hash = word.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      const position = Math.abs(hash) % 384;
      testVector[position] += 1;
    });
    
    // Normalize test vector
    const testMagnitude = Math.sqrt(testVector.reduce((sum, val) => sum + val * val, 0));
    if (testMagnitude > 0) {
      for (let i = 0; i < testVector.length; i++) {
        testVector[i] = testVector[i] / testMagnitude;
      }
    }
    
    const searchResults = await index.query({
      topK: 3,
      vector: testVector,
      includeMetadata: true
    });
    
    console.log("🎯 Top 3 matches for 'I work with computers and code':");
    searchResults.matches.forEach((match, idx) => {
      console.log(`${idx + 1}. ${match.metadata.occupationTitle} (score: ${match.score.toFixed(3)})`);
    });

  } catch (error) {
    console.error("❌ Error populating Pinecone index:", error.message);
    process.exit(1);
  }
}

/**
 * Clear all vectors from the index (use with caution!)
 */
async function clearIndex() {
  try {
    console.log("⚠️  Clearing Pinecone index...");
    
    // Delete all vectors (this will delete everything in the index!)
    await index.deleteAll();
    
    console.log("✅ Index cleared successfully");
  } catch (error) {
    console.error("❌ Error clearing index:", error.message);
  }
}

/**
 * Get index statistics
 */
async function getIndexStats() {
  try {
    console.log("📊 Getting index statistics...");
    
    const stats = await index.describeIndexStats();
    console.log("Index Statistics:", JSON.stringify(stats, null, 2));
    
  } catch (error) {
    console.error("❌ Error getting index stats:", error.message);
  }
}

// Command line interface
const command = process.argv[2];

switch (command) {
  case 'populate':
    populatePineconeIndex();
    break;
  case 'clear':
    clearIndex();
    break;
  case 'stats':
    getIndexStats();
    break;
  default:
    console.log(`
📋 Pinecone Sample Data Management

Usage: node sampleData.js <command>

Commands:
  populate  - Upload sample job data to Pinecone index
  clear     - Clear all data from the index (⚠️  DANGEROUS!)
  stats     - Show index statistics

Examples:
  node sampleData.js populate
  node sampleData.js stats
  node sampleData.js clear

⚠️  Make sure your .env file is configured with:
  - PINECONE_API_KEY
  - PINECONE_INDEX_NAME  
  - GROQ_API_KEY
    `);
    process.exit(1);
}

module.exports = {
  populatePineconeIndex,
  clearIndex,
  getIndexStats,
  sampleJobs
};