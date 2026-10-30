from fastapi import FastAPI, UploadFile, File, Form, BackgroundTasks, WebSocket, WebSocketDisconnect, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
import tempfile
import uuid
import traceback
from typing import Dict, Any, Optional

app = FastAPI(
    title="Foresight Context Engine API",
    description="Multi-Agent Dialectical Debate, Narrative Forensics, and Predictive Forecasting Engine",
    version="1.0.0"
)

# Enable CORS for all local development and production origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global in-memory analysis cache
import json
import glob

analysis_store: Dict[str, Dict[str, Any]] = {}
latest_analysis: Optional[Dict[str, Any]] = None

CACHE_FILE_LOCAL = os.path.join(os.path.dirname(__file__), "latest_analysis.json")
CACHE_FILE_TEMP = os.path.join(tempfile.gettempdir(), "foresight_latest_analysis.json")

def persist_analysis(result: dict):
    global latest_analysis
    latest_analysis = result
    try:
        with open(CACHE_FILE_LOCAL, "w", encoding="utf-8") as f:
            json.dump(result, f, indent=2)
    except Exception as e:
        print(f"Failed to write local cache: {e}")
    try:
        with open(CACHE_FILE_TEMP, "w", encoding="utf-8") as f:
            json.dump(result, f, indent=2)
    except Exception as e:
        print(f"Failed to write temp cache: {e}")

def load_persisted_analysis() -> Optional[Dict[str, Any]]:
    for path in [CACHE_FILE_LOCAL, CACHE_FILE_TEMP]:
        if os.path.exists(path):
            try:
                with open(path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    if data and "truth_verification" in data:
                        return data
            except Exception as e:
                print(f"Failed to load cache from {path}: {e}")
    return None

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Ensures that unexpected exceptions return structured JSON with proper
    CORS headers so the frontend receives readable errors instead of opaque CORS drops.
    """
    print(f"Unhandled server error: {exc}")
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc), "error_type": type(exc).__name__}
    )

@app.get("/")
async def root():
    """
    Root endpoint verifying the API is live, with quick-reference links.
    """
    has_gemini = bool(os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY"))
    return {
        "status": "online",
        "service": "Foresight Context Engine API",
        "version": "1.0.0",
        "mode": "Active Agentic System",
        "gemini_api_configured": has_gemini,
        "docs_url": "/docs",
        "endpoints": {
            "health": "/health",
            "upload": "/api/upload (POST)",
            "latest_analysis": "/api/latest-analysis (GET)",
            "analysis_detail": "/api/analysis/{task_id} (GET)",
            "chat_websocket": "/ws/{client_id} (WebSocket)"
        }
    }

@app.get("/health")
async def health_check():
    has_gemini = bool(os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY"))
    return {
        "status": "healthy",
        "gemini_api_configured": has_gemini,
        "active_analyses_count": len(analysis_store),
        "engine": "ready"
    }

def run_pipeline_sync(task_id: str, file_path: str):
    """Executes the analysis pipeline and caches the result."""
    global latest_analysis
    try:
        from workers.tasks import execute_pipeline
        result = execute_pipeline(task_id, file_path)
        analysis_store[task_id] = result
        persist_analysis(result)
    except Exception as e:
        print(f"Error in pipeline worker: {e}")
        traceback.print_exc()
        analysis_store[task_id] = {
            "task_id": task_id,
            "status": "error",
            "error": str(e)
        }

@app.post("/api/upload")
async def upload_content(
    file: Optional[UploadFile] = File(None),
    claim_text: Optional[str] = Form(None),
    background_tasks: BackgroundTasks = None
):
    """
    Handles video, photo, document uploads, or direct claim text.
    1. Transcribes into structured JSON claims.
    2. Queries live open internet sources (News, Wikipedia, Fact-Checkers) to compare and verify.
    3. Evaluates whether the video/information is TRUE or FALSE, and reports on any miracle claims.
    """
    global latest_analysis
    task_id = str(uuid.uuid4())
    temp_dir = tempfile.gettempdir()

    if file and file.filename:
        safe_filename = os.path.basename(file.filename)
        temp_file_path = os.path.join(temp_dir, f"{task_id}_{safe_filename}")
        try:
            contents = await file.read()
            with open(temp_file_path, "wb") as f:
                f.write(contents)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to save uploaded file: {e}")
    elif claim_text:
        safe_filename = "direct_claim_submission.txt"
        temp_file_path = os.path.join(temp_dir, f"{task_id}_{safe_filename}")
        try:
            with open(temp_file_path, "w", encoding="utf-8") as f:
                f.write(claim_text.strip())
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to save claim text: {e}")
    else:
        raise HTTPException(status_code=400, detail="Please upload a media file or provide claim text to verify.")

    # Execute pipeline: Transcribe -> Internet Search -> Truth Verification -> Multi-Agent Debate
    try:
        from workers.tasks import execute_pipeline
        analysis_result = execute_pipeline(task_id, temp_file_path, display_name=safe_filename)
        analysis_store[task_id] = analysis_result
        persist_analysis(analysis_result)
    except Exception as e:
        print(f"Direct pipeline execution error: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Agent analysis failed: {e}")

    truth = analysis_result.get("truth_verification", {})

    return {
        "status": "completed",
        "task_id": task_id,
        "filename": safe_filename,
        "verdict": truth.get("verdict"),
        "verdict_badge": truth.get("verdict_badge"),
        "is_miracle_claim": truth.get("is_miracle_claim"),
        "message": f"Verification complete for '{safe_filename}': {truth.get('verdict_badge')}",
        "analysis": analysis_result
    }

@app.get("/api/analysis/{task_id}")
async def get_analysis(task_id: str):
    """Retrieves full analysis for a specific task ID."""
    if task_id in analysis_store:
        return analysis_store[task_id]
    raise HTTPException(status_code=404, detail="Analysis task not found.")

@app.get("/api/latest-analysis")
async def get_latest_analysis():
    """Retrieves the most recent analysis, or a default baseline if none uploaded yet."""
    global latest_analysis
    if latest_analysis and latest_analysis.get("truth_verification", {}).get("event_provenance"):
        return latest_analysis
    
    # 1. Try loading cached analysis from disk
    cached = load_persisted_analysis()
    if cached:
        latest_analysis = cached
        return latest_analysis

    # 2. Check if the user's uploaded video exists in temp
    temp_dir = tempfile.gettempdir()
    annamalai_videos = glob.glob(os.path.join(temp_dir, "*annamalai*.mp4"))
    if annamalai_videos:
        try:
            from workers.tasks import execute_pipeline
            target_video = annamalai_videos[0]
            latest_analysis = execute_pipeline("annamalai-auto", target_video, display_name="annamalai_speech.mp4")
            persist_analysis(latest_analysis)
            return latest_analysis
        except Exception as e:
            print(f"Auto-analysis of annamalai video failed: {e}")

    # 3. Fallback baseline demonstration with real-world verification
    demo_file = os.path.join(temp_dir, "initial_demo_claims.txt")
    with open(demo_file, "w", encoding="utf-8") as f:
        f.write("Municipal budget transparency report alleges unaccounted transfers on March 10th.")
    
    from workers.tasks import execute_pipeline
    latest_analysis = execute_pipeline("demo-init", demo_file, display_name="municipal_budget_claims.mp4")
    persist_analysis(latest_analysis)
    return latest_analysis

class ChatMessageRequest(BaseModel):
    message: str

@app.post("/api/chat")
async def chat_rest_endpoint(req: ChatMessageRequest):
    """
    REST query endpoint for the Context Guide Agent.
    Guarantees instant conversational responses even if WebSockets are in standby.
    """
    global latest_analysis
    from agents.chat_agent import chat_agent
    current_data = latest_analysis
    if not current_data:
        current_data = await get_latest_analysis()
    
    reply = chat_agent.answer_query(req.message, current_data)
    return {"reply": reply, "agent": "Context Guide Agent"}

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket)
    from agents.chat_agent import chat_agent
    global latest_analysis
    try:
        # Welcome message
        await websocket.send_text("Context Guide Agent connected. Ask me any questions regarding the verified claims, proponent evidence, or skeptic findings.")
        while True:
            data = await websocket.receive_text()
            query = data.strip()
            current_data = latest_analysis
            if not current_data:
                current_data = await get_latest_analysis()
            
            reply = chat_agent.answer_query(query, current_data)
            await websocket.send_text(reply)
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
