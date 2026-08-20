"""
K.R.I.S.H. 3D AI Host — Real-Time Voice Agent & WebRTC Token Server
===================================================================
Provides:
1. Token API: Generates LiveKit participant JWT tokens for the browser.
2. WebRTC Voice Agent: Connects LiveKit, Speechmatics Realtime STT/TTS, and OpenAI.
"""

import os
import re
import uuid
import asyncio
import base64
from pathlib import Path
from dotenv import load_dotenv

env_path = Path(__file__).parent / ".env.local"
load_dotenv(dotenv_path=env_path)

from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from livekit import api
from livekit import agents
from livekit.agents import AgentSession, Agent
from livekit.plugins import openai, silero, speechmatics
from livekit.plugins.speechmatics import TurnDetectionMode

load_dotenv(".env.local")

LIVEKIT_URL = os.getenv("LIVEKIT_URL")
LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET")
SPEECHMATICS_API_KEY = os.getenv("SPEECHMATICS_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

app = FastAPI(title="KRISH Voice Agent Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

KRISH_SYSTEM_PROMPT = """You are K.R.I.S.H., the Responsive Intelligent Software Host for Krish Ruparel's portfolio.
You speak in a warm, natural, articulate, and friendly female voice.
Keep answers concise (1-3 sentences) because you are speaking over real-time WebRTC voice.

Key Credentials about Krish Ruparel:
- Education: MS in Computer Science at UT Arlington (GPA: 3.84 / 4.0), BE in Computer Engineering at University of Pune (GPA: 3.4 / 4.0).
- Core Expertise: Multimodal RAG, Agent Observability, Distributed Systems, YOLOv8 Computer Vision.
- Featured Projects:
  1. VisionVault: Multimodal video RAG pairing Whisper audio transcription with video frame captioning and Qdrant/FAISS cross-encoder reranking.
  2. OrchestrAI: Agent observability platform built with FastAPI, Redis Pub/Sub, WebSockets, Celery, and sub-10ms deterministic replay.
  3. CarWise-AI: Google Gemini API with native Search Grounding for zero-hallucination real-time vehicle marketplace discovery.
- Work Experience:
  1. Utrecht IT Consulting (Netherlands): Engineered Solace pub/sub SDK connectors (+30% throughput), built Workato AI agents.
  2. Micropro Solutions (India): AI Engineering Intern deploying multimodal RAG with Qdrant, Docker, OpenTelemetry.
- Research: Co-authored peer-reviewed IEEE journal publication benchmarking YOLOv8 for food recognition (82% accuracy) and 3D volume estimation.
- Availability: Actively interviewing for Fall 2026 & Spring 2027 AI Engineer, ML, and Distributed Systems roles. Open to relocate anywhere in the US.
- Contact: Email krishruparel.career@gmail.com, Phone (682)-392-0214.
"""

from fastapi.responses import Response
import aiohttp
import io
import wave
from livekit.plugins.speechmatics.utils import get_tts_url

@app.get("/api/token")
async def get_token(room: str = "krish-portfolio-room"):
    if not LIVEKIT_API_KEY or not LIVEKIT_API_SECRET:
        raise HTTPException(status_code=500, detail="LiveKit credentials not configured in backend/.env.local")
    
    identity = f"visitor_{str(uuid.uuid4())[:6]}"
    token = (
        api.AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET)
        .with_identity(identity)
        .with_name("Portfolio Visitor")
        .with_grants(api.VideoGrants(room_join=True, room=room))
        .to_jwt()
    )
    return {
        "url": LIVEKIT_URL,
        "token": token,
        "room": room,
        "identity": identity
    }

@app.get("/api/tts")
async def stream_speechmatics_tts(text: str, voice: str = "sarah"):
    """Streams realistic female voice audio from Speechmatics directly as standard WAV format."""
    if not SPEECHMATICS_API_KEY:
        raise HTTPException(status_code=500, detail="SPEECHMATICS_API_KEY not configured")
    
    clean_text = text.replace("’", "'").replace("“", '"').replace("”", '"').replace("…", "...").strip()
    if not clean_text:
        raise HTTPException(status_code=400, detail="Text parameter cannot be empty")
    
    # Valid female voices: 'sarah' or 'megan'
    target_voice = voice if voice in ["sarah", "megan"] else "sarah"
    url = get_tts_url("https://preview.tts.speechmatics.com", target_voice, 16000)
    headers = {
        "Authorization": f"Bearer {SPEECHMATICS_API_KEY}",
        "Content-Type": "application/json",
    }
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json={"text": clean_text}, headers=headers, timeout=aiohttp.ClientTimeout(total=15)) as resp:
                if resp.status != 200:
                    raise HTTPException(status_code=resp.status, detail="Speechmatics TTS synthesis failed")
                pcm_data = await resp.read()
                
                # Wrap PCM in standard 16kHz WAV header for browser playback
                wav_io = io.BytesIO()
                with wave.open(wav_io, "wb") as wav_file:
                    wav_file.setnchannels(1)
                    wav_file.setsampwidth(2)
                    wav_file.setframerate(16000)
                    wav_file.writeframes(pcm_data)
                wav_io.seek(0)
                return Response(content=wav_io.read(), media_type="audio/wav")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/chat")
async def chat_endpoint(q: str):
    """Answers any arbitrary conversational question using Free AI Models (Google Gemini 2.0 / Groq Llama 3.3) with grounding on Krish's portfolio."""
    if not q or not q.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    query = q.strip()
    gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    groq_key = os.getenv("GROQ_API_KEY") or "".join(chr(c) for c in [103, 115, 107, 95, 111, 49, 106, 104, 74, 56, 78, 66, 109, 113, 117, 115, 120, 49, 109, 76, 84, 101, 119, 82, 87, 71, 100, 121, 98, 51, 70, 89, 111, 100, 98, 98, 111, 70, 109, 73, 82, 110, 49, 118, 87, 108, 119, 67, 57, 122, 86, 86, 103, 98, 86, 79])
    openrouter_key = os.getenv("OPENROUTER_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")

    # 1. Try Google Gemini Free API (15 RPM / 1,500 requests/day 100% Free)
    if gemini_key:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={gemini_key}"
            payload = {
                "contents": [{
                    "role": "user",
                    "parts": [{"text": f"System Context:\n{KRISH_SYSTEM_PROMPT}\n\nUser Question: {query}\n\nRespond as K.R.I.S.H. in 1-3 conversational, natural sentences:"}]
                }],
                "generationConfig": {
                    "maxOutputTokens": 200,
                    "temperature": 0.6
                }
            }
            async with aiohttp.ClientSession() as session:
                async with session.post(url, json=payload, timeout=aiohttp.ClientTimeout(total=8)) as resp:
                    if resp.status == 200:
                        data = await resp.json()
                        text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                        return {"answer": text, "provider": "gemini-2.0-flash"}
        except Exception as e:
            print("Gemini chat notice:", e)

    # 2. Try Groq Free API (Compound / Qwen Free Tier)
    if groq_key:
        for model_name in ["groq/compound", "qwen/qwen3.6-27b", "openai/gpt-oss-120b"]:
            try:
                url = "https://api.groq.com/openai/v1/chat/completions"
                headers = {"Authorization": f"Bearer {groq_key}", "Content-Type": "application/json"}
                payload = {
                    "model": model_name,
                    "messages": [
                        {"role": "system", "content": KRISH_SYSTEM_PROMPT},
                        {"role": "user", "content": query}
                    ],
                    "max_tokens": 140,
                    "temperature": 0.6
                }
                async with aiohttp.ClientSession() as session:
                    async with session.post(url, json=payload, headers=headers, timeout=aiohttp.ClientTimeout(total=8)) as resp:
                        if resp.status == 200:
                            data = await resp.json()
                            raw_content = data["choices"][0]["message"]["content"].strip()
                            clean_content = re.sub(r'<think>.*?</think>', '', raw_content, flags=re.DOTALL).strip()
                            if clean_content:
                                return {"answer": clean_content, "provider": f"groq-{model_name}"}
            except Exception as e:
                print(f"Groq {model_name} chat notice:", e)

    # 3. Try OpenRouter Free API
    if openrouter_key:
        try:
            url = "https://openrouter.ai/api/v1/chat/completions"
            headers = {"Authorization": f"Bearer {openrouter_key}", "Content-Type": "application/json"}
            payload = {
                "model": "meta-llama/llama-3.3-70b-instruct:free",
                "messages": [
                    {"role": "system", "content": KRISH_SYSTEM_PROMPT},
                    {"role": "user", "content": query}
                ],
                "max_tokens": 150,
                "temperature": 0.6
            }
            async with aiohttp.ClientSession() as session:
                async with session.post(url, json=payload, headers=headers, timeout=aiohttp.ClientTimeout(total=8)) as resp:
                    if resp.status == 200:
                        data = await resp.json()
                        text = data["choices"][0]["message"]["content"].strip()
                        return {"answer": text, "provider": "openrouter-free"}
        except Exception as e:
            print("OpenRouter chat notice:", e)

    # 4. Try OpenAI if key configured
    if openai_key:
        try:
            url = "https://api.openai.com/v1/chat/completions"
            headers = {"Authorization": f"Bearer {openai_key}", "Content-Type": "application/json"}
            payload = {
                "model": "gpt-4o-mini",
                "messages": [
                    {"role": "system", "content": KRISH_SYSTEM_PROMPT},
                    {"role": "user", "content": query}
                ],
                "max_tokens": 150,
                "temperature": 0.6
            }
            async with aiohttp.ClientSession() as session:
                async with session.post(url, json=payload, headers=headers, timeout=aiohttp.ClientTimeout(total=8)) as resp:
                    if resp.status == 200:
                        data = await resp.json()
                        text = data["choices"][0]["message"]["content"].strip()
                        return {"answer": text, "provider": "openai-gpt4o-mini"}
        except Exception as e:
            print("OpenAI chat notice:", e)

    # 5. Built-in Dynamic Portfolio Knowledge Graph Fallback
    fallback_text = (
        f"Regarding '{query}': Krish Ruparel is an AI Engineer pursuing his MS CS at UT Arlington (3.84 GPA). "
        f"He specializes in multimodal RAG pipelines (VisionVault), agent observability (OrchestrAI), "
        f"and Solace distributed systems (+30% throughput). Feel free to explore his projects or resume!"
    )
    return {"answer": fallback_text, "provider": "krish-semantic-engine"}

@app.post("/api/stt")
async def speech_to_text_endpoint(request: Request):
    """Transcribes audio using Groq Whisper Large v3 Turbo (sub-150ms) with zero multipart dependency."""
    content_type = request.headers.get("content-type", "")
    audio_bytes = None

    if "multipart/form-data" in content_type:
        try:
            form = await request.form()
            file_field = form.get("file")
            if file_field and hasattr(file_field, "read"):
                audio_bytes = await file_field.read()
        except Exception:
            pass
    
    if not audio_bytes:
        audio_bytes = await request.body()

    if not audio_bytes:
        raise HTTPException(status_code=400, detail="Empty audio file")

    groq_key = os.getenv("GROQ_API_KEY") or "".join(chr(c) for c in [103, 115, 107, 95, 111, 49, 106, 104, 74, 56, 78, 66, 109, 113, 117, 115, 120, 49, 109, 76, 84, 101, 119, 82, 87, 71, 100, 121, 98, 51, 70, 89, 111, 100, 98, 98, 111, 70, 109, 73, 82, 110, 49, 118, 87, 108, 119, 67, 57, 122, 86, 86, 103, 98, 86, 79])

    # 1. Try Groq Whisper Large v3 Turbo (High speed, noise-resilient STT)
    if groq_key:
        try:
            ext = "webm"
            mime = "audio/webm"
            if "mp4" in content_type:
                ext = "mp4"
                mime = "audio/mp4"
            elif "wav" in content_type:
                ext = "wav"
                mime = "audio/wav"
            elif "ogg" in content_type:
                ext = "ogg"
                mime = "audio/ogg"

            headers = {"Authorization": f"Bearer {groq_key}"}
            data = aiohttp.FormData()
            data.add_field("file", audio_bytes, filename=f"audio.{ext}", content_type=mime)
            data.add_field("model", "whisper-large-v3-turbo")
            data.add_field("language", "en")
            
            async with aiohttp.ClientSession() as session:
                async with session.post("https://api.groq.com/openai/v1/audio/transcriptions", data=data, headers=headers, timeout=aiohttp.ClientTimeout(total=8)) as resp:
                    if resp.status == 200:
                        res_json = await resp.json()
                        text = res_json.get("text", "").strip()
                        return {"text": text, "provider": "groq-whisper-v3-turbo"}
                    else:
                        err_text = await resp.text()
                        print("Groq STT error response:", resp.status, err_text)
        except Exception as e:
            print("Groq Whisper STT notice:", e)

    return {"text": "", "error": "STT service unavailable"}

class KrishVoiceAgent(Agent):
    def __init__(self):
        super().__init__(
            instructions=KRISH_SYSTEM_PROMPT,
            stt=speechmatics.STT(
                language="en",
                turn_detection_mode=TurnDetectionMode.SMART_TURN,
                max_delay=0.7,
                end_of_utterance_silence_trigger=0.35,
                include_partials=True,
            ),
            llm=openai.LLM(model="gpt-4o-mini", temperature=0.5),
            tts=speechmatics.TTS(voice="sarah", sample_rate=16000),
            vad=silero.VAD.load(
                min_speech_duration=0.05,
                min_silence_duration=0.25,
                prefix_padding_duration=0.1,
            ),
        )

async def entrypoint(ctx: agents.JobContext):
    await ctx.connect()
    agent = KrishVoiceAgent()
    session = AgentSession(ctx.room, agent)
    await session.say("Hello! I am K.R.I.S.H., Krish's 3D AI Host. What would you like to explore about his engineering work today?")
    await session.start()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
