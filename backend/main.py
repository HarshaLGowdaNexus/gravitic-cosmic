from fastapi import FastAPI, UploadFile, File, BackgroundTasks, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid

app = FastAPI(title="Foresight Context Engine API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/upload")
async def upload_content(file: UploadFile = File(...)):
    """
    Endpoint handles video or text uploads. Returning a sub-5-second acknowledgement
    while deferring processing to Celery workers.
    """
    task_id = str(uuid.uuid4())
    # Save the file temporarily before sending to worker
    temp_file_path = f"/tmp/{task_id}_{file.filename}"
    contents = await file.read()
    with open(temp_file_path, "wb") as f:
        f.write(contents)

    # Trigger Celery Worker
    from workers.tasks import process_video_pipeline
    process_video_pipeline.delay(task_id, temp_file_path)
    
    return {
        "status": "queued", 
        "task_id": task_id,
        "filename": file.filename, 
        "message": "Content received and processing initiated."
    }

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # This is where the chat agent hook will go
            await websocket.send_text(f"Chat Agent: You said {data} (Hallucination-free response here)")
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
