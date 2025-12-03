# summarize_resume.py

import google.generativeai as genai

def summarize_resume(resume_text: str) -> str:
    prompt = f"""
You are an expert recruiter. Summarize the following resume text.

Only include:
- Key skills and tools
- Job titles and relevant experience
- Technologies, languages, and frameworks

Ignore: education, contact info, and formatting junk.

Resume:
\"\"\"
{resume_text}
\"\"\"
"""
    model = genai.GenerativeModel("gemini-2.0-flash")
    chat = model.start_chat()
    response = chat.send_message(prompt)
    return response.text