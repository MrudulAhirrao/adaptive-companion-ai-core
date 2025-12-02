import os
from google import genai
from models import MemoryExtraction
from dotenv import load_dotenv

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def extract_memory(chat_history: list[str]) -> MemoryExtraction:
    schema = MemoryExtraction.model_json_schema()
    history_text = "\n".join(chat_history)
    
    response = client.models.generate_content(
        model='gemini-2.0-flash',
        contents=history_text,
        config={
            'response_mime_type': 'application/json',
            'response_schema': schema,
        },
    )
    return MemoryExtraction.model_validate_json(response.text)