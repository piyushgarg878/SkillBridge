from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from summarize_resume import summarize_resume
import fitz
import google.generativeai as genai
from dotenv import load_dotenv
import os
import numpy as np

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    print("Warning: GOOGLE_API_KEY not found in environment variables.")

genai.configure(api_key=GOOGLE_API_KEY)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_text_from_pdf(file: UploadFile) -> str:
    content = file.file.read()
    with fitz.open(stream=content, filetype="pdf") as doc:
        return " ".join([page.get_text() for page in doc])

def get_embedding(text: str):
    result = genai.embed_content(
        model="models/text-embedding-004",
        content=text,
        task_type="semantic_similarity"
    )
    return result['embedding']

def cosine_similarity(v1, v2):
    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))

@app.post("/match")
async def match_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    resume_text = extract_text_from_pdf(resume)
    summary = summarize_resume(resume_text)

    # Get embeddings using Gemini
    emb1 = get_embedding(summary)
    emb2 = get_embedding(job_description)

    # Calculate similarity
    similarity = cosine_similarity(emb1, emb2)
    score = round(similarity * 100, 2)
    
    print("received")
    return {
        "summary": summary,
        "match_score": score
    }

@app.get("/")
async def root():
    return {"message": "Resume Scorer ML API is running!"}


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)