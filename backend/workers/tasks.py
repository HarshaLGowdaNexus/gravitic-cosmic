import os
from celery import Celery

REDIS_URL = os.environ.get("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "foresight_tasks",
    broker=REDIS_URL,
    backend=REDIS_URL
)

celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
)

@celery_app.task(bind=True)
def process_video_pipeline(self, task_id: str, file_path: str):
    """
    Simulates the long-running process of handling video files.
    - Extract Audio via FFmpeg
    - STT via Whisper
    - Keyframe Semantic via Gemini Pro Vision
    - Embedding to Pinecone
    """
    print(f"[{task_id}] Process video started for {file_path}")
    
    # 1. Pipeline Execution
    from services.video_pipeline import pipeline
    transcript = pipeline.transcribe_audio(file_path)
    visuals = pipeline.describe_visuals([file_path])
    
    # 2. Gather Context
    from services.mcp_client import mcp_client
    import asyncio
    context = asyncio.run(mcp_client.fetch_context(["keywords"]))
    combined_context = [f"Transcript: {transcript}", f"Visuals: {visuals}"] + context["google_search"]

    # 3. Execute Dialectical Engine
    from agents.debate_orchestrator import DebateOrchestrator
    orchestrator = DebateOrchestrator()
    summary = orchestrator.run_debate("Video Analysis", combined_context)
    
    # In production: Emits to WebSockets via Redis PUB/SUB or API callback
    print(f"[{task_id}] Done. Synthesis complete.")
    return {"status": "success", "task_id": task_id}
