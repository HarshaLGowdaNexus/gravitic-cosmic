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

def execute_pipeline(task_id: str, file_path: str, display_name: str = None) -> dict:
    """
    Executes the 3-Step Foresight Agent Pipeline:
    1. Transcribe video, photo, or text into structured JSON format.
    2. Query the live open internet (News agencies, Fact-Checkers, Wikipedia) to compare and verify.
    3. Return whether the video/information is TRUE or FALSE, whether an extraordinary miracle occurred,
       and provide multi-agent dialectical debate and narrative forensics.
    """
    filename = display_name or os.path.basename(file_path)
    print(f"[{task_id}] Step 1: Transcribing '{filename}' into structured JSON format...")

    # Step 1: Transcribe Media into JSON format
    from services.media_transcriber import media_transcriber
    transcription_json = media_transcriber.transcribe(file_path)

    transcript = transcription_json.get("transcript_or_text", "")
    extracted_claims = transcription_json.get("extracted_claims", [])

    print(f"[{task_id}] Step 2: Connecting to the live internet for factual verification...")
    # Step 2: Connect to the live internet to verify claims
    from services.web_verifier import web_verifier
    truth_verification = web_verifier.cross_check_claims(transcription_json)

    # Compile context sources from live web results for the Agent Triad
    web_sources = truth_verification.get("evidence_sources", [])
    combined_context = [
        f"Transcript/Content: {transcript}",
        f"Truth Verification: {truth_verification.get('verdict')}",
        f"Factual Explanation: {truth_verification.get('explanation')}"
    ]
    for src in web_sources:
        combined_context.append(f"Source [{src['publisher']}]: {src['title']} - {src['snippet']} ({src['link']})")

    print(f"[{task_id}] Step 3: Synthesizing multi-agent debate, forensics, and predictive models...")
    # Step 3: Dialectical Debate, Forensics, and Predictive Engines
    from agents.debate_orchestrator import DebateOrchestrator
    orchestrator = DebateOrchestrator()
    summary = orchestrator.run_debate(filename, combined_context)

    from agents.forensics_and_prediction import ForensicsEngine, PredictiveEngine
    forensics = ForensicsEngine().run_genealogy(filename)
    predictions = PredictiveEngine().run_forecast(filename)

    summary_dict = summary.model_dump() if hasattr(summary, "model_dump") else summary.dict()

    result = {
        "task_id": task_id,
        "filename": filename,
        "status": "completed",
        "transcription_json": transcription_json,
        "truth_verification": truth_verification,
        "debate": summary_dict,
        "forensics": forensics,
        "predictions": predictions,
        "transcript": transcript,
        "visuals": transcription_json.get("media_type", "general_media")
    }

    print(f"[{task_id}] Complete. Factual verdict: {truth_verification.get('verdict_badge')} for '{filename}'.")
    return result

@celery_app.task(bind=True)
def process_video_pipeline(self, task_id: str, file_path: str, display_name: str = None):
    return execute_pipeline(task_id, file_path, display_name)
