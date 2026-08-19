"""
K.R.I.S.H. 3D AI Host — Real-Time Voice Agent & WebRTC Token Server
===================================================================
Provides:
1. Token API: Generates LiveKit participant JWT tokens for the browser.
2. WebRTC Voice Agent: Connects LiveKit, Speechmatics Realtime STT/TTS, and OpenAI.
"""

import os
import uuid
import asyncio
from pathlib import Path
from dotenv import load_dotenv

env_path = Path(__file__).parent / ".env.local"
load_dotenv(dotenv_path=env_path)

from fastapi import FastAPI, HTTPException
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
    if not text.strip():
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
            async with session.post(url, json={"text": text}, headers=headers, timeout=aiohttp.ClientTimeout(total=15)) as resp:
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
