"""
K.R.I.S.H. 3D AI Host — Real-Time Voice Agent with Speechmatics & LiveKit
========================================================================
Architecture:
- Real-Time WebRTC Streaming: LiveKit Agents
- Real-Time Speech-to-Text: Speechmatics Realtime STT (sub-second latency)
- LLM Intelligence: OpenAI / Gemini with Portfolio Knowledge Base
- Neural Voice Synthesis: Speechmatics TTS (Natural Female Voice)
"""

import os
import asyncio
from pathlib import Path
from dotenv import load_dotenv, dotenv_values

env_path = Path(__file__).resolve().parent / ".env.local"
config = dotenv_values(env_path)
for k, v in config.items():
    if v is not None:
        os.environ[k] = str(v)

from livekit import agents
from livekit.agents import AgentSession, Agent, llm, utils
from livekit.agents.types import DEFAULT_API_CONNECT_OPTIONS
from livekit.plugins import openai, silero, speechmatics
from livekit.plugins.speechmatics import TurnDetectionMode

KRISH_SYSTEM_PROMPT = """You are K.R.I.S.H., the Responsive Intelligent Software Host for Krish Ruparel's portfolio.
You speak in a warm, professional, articulate, and friendly female voice.
Keep answers concise (1-3 sentences) because you are speaking over real-time WebRTC voice.

Key Credentials about Krish Ruparel:
- Education: MS in Computer Science at UT Arlington (GPA: 3.84 / 4.0), BE at University of Pune (GPA: 3.4 / 4.0).
- Core Expertise: Multimodal RAG, Agent Observability, Distributed Systems, YOLOv8 Computer Vision.
- Featured Projects:
  1. VisionVault: Multimodal video RAG pairing Whisper transcription with frame captioning and Qdrant/FAISS cross-encoders.
  2. OrchestrAI: Agent observability platform with FastAPI, Redis Pub/Sub, WebSockets, and sub-10ms deterministic replay.
  3. CarWise-AI: Google Gemini API with native Search Grounding for zero-hallucination vehicle discovery.
- Work Experience:
  1. Utrecht IT Consulting (Netherlands): Engineered Solace pub/sub SDK connectors (+30% throughput), Workato AI agents.
  2. Micropro Solutions (India): AI Engineering Intern deploying multimodal RAG with Qdrant, Docker, OpenTelemetry.
- Research: Co-authored peer-reviewed IEEE journal publication benchmarking YOLOv8 for food recognition (82% accuracy) and 3D volume estimation.
- Availability: Actively interviewing for Fall 2026 & Spring 2027 AI Engineer, ML, and Distributed Systems roles. Open to relocate anywhere in the US.
- Contact: Email krishruparel.career@gmail.com, Phone (682)-392-0214.
"""

class FastPortfolioStream(llm.LLMStream):
    def __init__(self, llm_instance, *, chat_ctx, tools=None, conn_options=DEFAULT_API_CONNECT_OPTIONS):
        super().__init__(llm_instance, chat_ctx=chat_ctx, tools=tools or [], conn_options=conn_options)

    async def _run(self):
        messages_list = self._chat_ctx.messages() if callable(self._chat_ctx.messages) else self._chat_ctx.messages
        last_msg = ""
        for item in reversed(messages_list):
            if getattr(item, "role", "") == "user":
                content = getattr(item, "content", "")
                if isinstance(content, str):
                    last_msg = content
                elif isinstance(content, list):
                    last_msg = " ".join(str(c) for c in content)
                break
        
        q = last_msg.lower().strip()
        reply = "I am K.R.I.S.H., Krish's 3D AI Host. You can ask me about his RAG projects, GPA, IEEE research, work experience, or hiring details!"

        if any(w in q for w in ["rag", "visionvault", "video"]):
            reply = "VisionVault is Krish's multimodal video RAG system. It pairs Whisper audio transcription with video frame captioning and Qdrant FAISS indexing for sub-second video search."
        elif any(w in q for w in ["gpa", "uta", "education", "degree", "university", "college", "school"]):
            reply = "Krish is pursuing his Master of Science in Computer Science at UT Arlington with a 3.84 GPA, and earned his Bachelor's in Computer Engineering from University of Pune with a 3.4 GPA."
        elif any(w in q for w in ["orchestrai", "agent", "observability", "replay"]):
            reply = "OrchestrAI is Krish's distributed agent observability platform built with FastAPI, Redis Pub/Sub, and WebSockets featuring sub-10ms deterministic replay."
        elif any(w in q for w in ["experience", "work", "job", "utrecht", "micropro", "intern"]):
            reply = "Krish worked at Utrecht IT Consulting in the Netherlands boosting event throughput by 30% with Solace pub/sub, and as an AI intern at Micropro Solutions deploying multimodal RAG."
        elif any(w in q for w in ["ieee", "paper", "research", "yolo", "publication"]):
            reply = "Krish co-authored a peer-reviewed IEEE research paper benchmarking YOLOv8 for food recognition and 3D volume estimation with 82% accuracy."
        elif any(w in q for w in ["hire", "hiring", "why", "role", "available", "relocate", "location"]):
            reply = "Krish brings deep production experience in multimodal RAG, distributed systems, and AI agent observability. He is actively interviewing for Fall 2026 and Spring 2027 roles across the US."
        elif any(w in q for w in ["contact", "email", "phone", "reach", "call", "connect"]):
            reply = "You can reach Krish directly via email at krishruparel.career@gmail.com or by phone at 682-392-0214."
        elif any(w in q for w in ["skill", "stack", "tech", "python", "fastapi", "docker"]):
            reply = "Krish's core stack spans Python, FastAPI, PyTorch, LangChain, Qdrant, Docker, Kubernetes, Redis Pub/Sub, WebSockets, and OpenTelemetry."
        elif any(w in q for w in ["who", "about", "krish", "tell", "know", "hello", "hi", "hey", "yourself"]):
            reply = "Krish Ruparel is an AI Engineer and Distributed Systems Architect pursuing his MS in CS at UT Arlington with a 3.84 GPA, specializing in Multimodal RAG and high-throughput streaming systems."

        words = reply.split(" ")
        for i, word in enumerate(words):
            chunk = llm.ChatChunk(
                id=utils.shortuuid(),
                delta=llm.ChoiceDelta(content=word + (" " if i < len(words) - 1 else ""))
            )
            self._event_ch.send_nowait(chunk)
            await asyncio.sleep(0.01)

class FastPortfolioLLM(llm.LLM):
    def __init__(self):
        super().__init__()

    def chat(self, *, chat_ctx, tools=None, conn_options=DEFAULT_API_CONNECT_OPTIONS, **kwargs):
        return FastPortfolioStream(self, chat_ctx=chat_ctx, tools=tools, conn_options=conn_options)

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
            llm=FastPortfolioLLM(),
            tts=speechmatics.TTS(
                voice="sarah",  # Realistic Neural Female Voice from Speechmatics
                sample_rate=16000,
            ),
            vad=silero.VAD.load(
                min_speech_duration=0.05,
                min_silence_duration=0.25,
                prefix_padding_duration=0.1,
            ),
            allow_interruptions=True,
            min_endpointing_delay=0.3,
            max_endpointing_delay=1.5,
        )

async def entrypoint(ctx: agents.JobContext):
    await ctx.connect()
    
    agent = KrishVoiceAgent()
    session = AgentSession()
    
    await session.start(agent, room=ctx.room)
    await session.say("Hello! I am K.R.I.S.H., Krish's 3D AI Host. What would you like to explore about his engineering work today?")

if __name__ == "__main__":
    agents.cli.run_app(agents.WorkerOptions(entrypoint_fnc=entrypoint))
