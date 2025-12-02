import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv
from mem_module import extract_memory
from pe_module import generate_personality_prompt, Tone

load_dotenv()

app = FastAPI()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# UPDATED CORS SETTINGS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow ALL origins (Required for Codespaces)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    tone: Tone
    history: list[str]

@app.post("/chat")
async def chat_endpoint(req: ChatRequest):
    try:
        mem_data = extract_memory(req.history)
        system_instruction = generate_personality_prompt(mem_data, req.tone)
        
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=req.message,
            config={'system_instruction': system_instruction}
        )
        
        return {
            "memory": mem_data.model_dump(),
            "applied_prompt": system_instruction,
            "response": response.text
        }
    except Exception as e:
        print(f"Error: {e}") # Print error to terminal for debugging
        raise HTTPException(status_code=500, detail=str(e))