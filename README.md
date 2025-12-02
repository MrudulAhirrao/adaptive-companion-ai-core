# adaptive-companion-ai-core
A high-performance, modular backend service implementing context-aware personality adaptation and structured memory extraction using Gemini 2.5 Flash and FastAPI.
---
![Status](https://img.shields.io/badge/Status-Completed-success)
![Stack](https://img.shields.io/badge/Fullstack-Vue%20%2B%20Node-blue)
![License](https://img.shields.io/badge/License-MIT-green)
---
## 🚀 **Key Features**

Memory Extraction Module (MEM): Uses Gemini Structured Output to extract User Facts, Preferences, and Emotions into strict JSON schemas.

Personality Engine (PE): A modular system that injects extracted memory into dynamic system prompts (e.g., Calm Mentor, Witty Friend).

Resilient Backend: Implements exponential backoff retry logic for API rate limits.

Modern UI: A specialized dashboard to visualize the "Live Memory" state using Shadcn UI.
---
## 🛠 Tech Stack

AI Model: Google Gemini 2.0 Flash (via google-genai SDK)

Backend: Python, FastAPI, Pydantic

Frontend: Next.js 14, TypeScript, Tailwind CSS, Lucide React

Deployment: Render (Backend) + Vercel (Frontend)
---
## ⚡ **Quick Start**

1. Clone & Setup Backend

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "GEMINI_API_KEY=your_google_api_key" > .env

# Run Server
uvicorn main:app --reload


The API will start at http://127.0.0.1:8000

2. Setup Frontend

cd companion-ai-frontend

# Install dependencies
npm install

# Run Client
npm run dev


Open http://localhost:3000 to chat.

## 🧩 **Architecture Flow**

User Input: User sends a message and selects a Tone (e.g., Therapist).

Extraction (MEM): Backend sends history to Gemini -> Returns MemoryExtraction JSON object.

Orchestration (PE): Python logic combines the JSON memory + Tone rules into a new System Prompt.

Response: Gemini generates the final reply using the context-aware prompt.

## 📦 **Deployment**

#Backend (Render/Railway)

Build Command: pip install -r requirements.txt

Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT

Env Var: Set GEMINI_API_KEY

Frontend (Vercel)

Framework Preset: Next.js

Env Var: Set NEXT_PUBLIC_API_URL to your deployed backend URL (e.g., https://your-api.onrender.com/chat).
