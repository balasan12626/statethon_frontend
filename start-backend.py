#!/usr/bin/env python3
"""
Simple FastAPI backend for translation service
Run this script to start the translation backend on localhost:8000
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import html
import re

app = FastAPI(title="Page Translation API", version="1.0.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TranslationRequest(BaseModel):
    html_content: str
    target_lang: str

class TranslationResponse(BaseModel):
    translated_html: str
    target_language: str
    target_language_code: str
    translation_count: int
    status: str
    message: str

# Language mapping
LANGUAGES = {
    'hi': 'Hindi',
    'ta': 'Tamil', 
    'te': 'Telugu',
    'bn': 'Bengali',
    'ml': 'Malayalam',
    'gu': 'Gujarati',
    'pa': 'Punjabi',
    'mr': 'Marathi',
    'kn': 'Kannada',
    'or': 'Odia',
    'as': 'Assamese',
    'ur': 'Urdu',
    'ne': 'Nepali',
    'si': 'Sinhala'
}

def simple_translate(text: str, target_lang: str) -> str:
    """
    Simple mock translation function
    Replace this with actual translation service (Google Translate API, etc.)
    """
    # Mock translations for demonstration
    translations = {
        'hi': {
            'FIND THE PERFECT': 'सही खोजें',
            'NCO CODE': 'NCO कोड',
            'National Classification of Occupation': 'राष्ट्रीय व्यवसाय वर्गीकरण',
            'Classification of Occupation code for you': 'आपके लिए व्यवसाय वर्गीकरण कोड',
            'Try these examples': 'इन उदाहरणों को आज़माएं',
            'I teach children in primary school': 'मैं प्राथमिक स्कूल में बच्चों को पढ़ाता हूं',
            'I develop mobile applications': 'मैं मोबाइल एप्लिकेशन विकसित करता हूं',
            'I install solar panels and fix inverters': 'मैं सोलर पैनल लगाता हूं और इन्वर्टर ठीक करता हूं',
            'Education Sector': 'शिक्षा क्षेत्र',
            'Technology Sector': 'प्रौद्योगिकी क्षेत्र',
            'Renewable Energy': 'नवीकरणीय ऊर्जा',
            'Describe Your Job': 'अपनी नौकरी का वर्णन करें',
            'Find My NCO Code': 'मेरा NCO कोड खोजें',
            'Home': 'होम',
            'About': 'के बारे में',
            'Contact': 'संपर्क',
            'English': 'अंग्रेजी'
        },
        'ta': {
            'FIND THE PERFECT': 'சரியானதைக் கண்டறியவும்',
            'NCO CODE': 'NCO குறியீடு',
            'National Classification of Occupation': 'தேசிய தொழில் வகைப்பாடு',
            'Classification of Occupation code for you': 'உங்களுக்கான தொழில் வகைப்பாட்டு குறியீடு',
            'Try these examples': 'இந்த எடுத்துக்காட்டுகளை முயற்சிக்கவும்',
            'Home': 'முகப்பு',
            'About': 'பற்றி',
            'Contact': 'தொடர்பு',
            'English': 'ஆங்கிலம்'
        }
    }
    
    if target_lang in translations and text.strip() in translations[target_lang]:
        return translations[target_lang][text.strip()]
    
    # Return original text if no translation available
    return text

@app.post("/translate-page", response_model=TranslationResponse)
async def translate_page(request: TranslationRequest):
    try:
        if request.target_lang not in LANGUAGES:
            raise HTTPException(status_code=400, detail="Unsupported language")
        
        html_content = request.html_content
        target_lang = request.target_lang
        
        # Extract text from HTML and translate
        # Simple regex to find text content (this is basic - in production use proper HTML parser)
        text_pattern = r'>([^<]+)<'
        matches = re.findall(text_pattern, html_content)
        
        translated_html = html_content
        translation_count = 0
        
        for match in matches:
            if match.strip() and not match.strip().startswith('<'):
                original_text = match.strip()
                translated_text = simple_translate(original_text, target_lang)
                if translated_text != original_text:
                    translated_html = translated_html.replace(f'>{original_text}<', f'>{translated_text}<')
                    translation_count += 1
        
        return TranslationResponse(
            translated_html=translated_html,
            target_language=LANGUAGES[target_lang],
            target_language_code=target_lang,
            translation_count=translation_count,
            status="success",
            message=f"Successfully translated to {LANGUAGES[target_lang]}"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "Translation API is running", "status": "ok"}

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "translation-api"}

if __name__ == "__main__":
    print("🚀 Starting Translation API on http://localhost:8000")
    print("📝 API docs available at http://localhost:8000/docs")
    print("🔄 Make sure your frontend is running on localhost:5173")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
