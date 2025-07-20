import fetch from 'node-fetch';
import FormData from 'form-data';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { resumeUrl, jobDescription } = await req.json();
    console.log('[ML API] Received request:', { resumeUrl, jobDescription });
    if (!resumeUrl || !jobDescription) {
      console.log('[ML API] Missing resumeUrl or jobDescription');
      return new Response(JSON.stringify({ error: 'Missing resumeUrl or jobDescription' }), { status: 400 });
    }

    // Download the PDF
    console.log('[ML API] Downloading PDF from:', resumeUrl);
    const pdfRes = await fetch(resumeUrl);
    if (!pdfRes.ok) {
      console.log('[ML API] Failed to download PDF:', pdfRes.status, pdfRes.statusText);
      return new Response(JSON.stringify({ error: 'Failed to download resume PDF' }), { status: 400 });
    }
    const pdfBuffer = await pdfRes.buffer();
    console.log('[ML API] PDF downloaded, size:', pdfBuffer.length);

    // Prepare FormData for ML API
    const form = new FormData();
    form.append('resume', pdfBuffer, { filename: 'resume.pdf', contentType: 'application/pdf' });
    form.append('job_description', jobDescription);

    // Send to ML model
    console.log('[ML API] Sending to ML model...');
    const mlRes = await fetch('http://localhost:8000/match', {
      method: 'POST',
      body: form,
      headers: form.getHeaders(),
    });
    console.log('[ML API] ML model response status:', mlRes.status);

    if (!mlRes.ok) {
      const errText = await mlRes.text();
      console.log('[ML API] ML model error:', errText);
      return new Response(JSON.stringify({ error: 'ML model error', details: errText }), { status: 500 });
    }

    const mlData = await mlRes.json();
    console.log('[ML API] ML raw data:', mlData);
    // Normalize response: always return { summary, score }
    const summary = mlData.summary || '';
    const score = mlData.match_score !== undefined ? mlData.match_score : mlData.score;
    const result = { summary, score };
    console.log('[ML API] Normalized data:', result);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (e) {
    console.error('[ML API] Internal server error:', e);
    return new Response(JSON.stringify({ error: 'Internal server error', details: e.message }), { status: 500 });
  }
} 