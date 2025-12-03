from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from summarize_resume import summarize_resume
import fitz  
from sentence_transformers import SentenceTransformer, util
import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()
genai.configure(api_key="AIzaSyCNnBduoWYaFI7qOFixuM6e9EKa2XVYj1I")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = SentenceTransformer("all-MiniLM-L6-v2")

def extract_text_from_pdf(file: UploadFile) -> str:
    content = file.file.read()
    with fitz.open(stream=content, filetype="pdf") as doc:
        return " ".join([page.get_text() for page in doc])

@app.post("/match")
async def match_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    resume_text = extract_text_from_pdf(resume)
    summary = summarize_resume(resume_text)

    embeddings = model.encode([summary, job_description], convert_to_tensor=True)
    similarity = util.cos_sim(embeddings[0], embeddings[1]).item()
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
    uvicorn.run(app, host="0.0.0.0", port=8000)