import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, imageBase64, mimeType } = await request.json();

    if (!imageUrl && !imageBase64) {
      return NextResponse.json({ error: 'Image URL or base64 required' }, { status: 400 });
    }

    if (!GEMINI_API_KEY) {
      // Return a mock response if no API key (for demo/dev)
      return NextResponse.json({
        success: false,
        error: 'GEMINI_API_KEY not configured. Add it to your .env.local file.',
        demo: true,
      }, { status: 500 });
    }

    // Build the Gemini request - use URL or base64
    const imagePart = imageUrl
      ? { fileData: { mimeType: mimeType || 'image/jpeg', fileUri: imageUrl } }
      : { inlineData: { mimeType: mimeType || 'image/jpeg', data: imageBase64 } };

    // Fetch image as base64 if URL given (Gemini needs inline data for external URLs)
    let finalImagePart = imagePart;
    if (imageUrl && !imageBase64) {
      const imgRes = await fetch(imageUrl);
      const arrayBuffer = await imgRes.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      const ct = imgRes.headers.get('content-type') || 'image/jpeg';
      finalImagePart = { inlineData: { mimeType: ct, data: base64 } };
    }

    const prompt = `You are an expert real estate plot layout analyzer. Analyze this plot layout/site map image carefully.

Your task: Detect all individual plots visible in this image and return structured JSON.

Detection rules:
- RED or DARK RED filled plots = "sold"
- YELLOW or ORANGE filled plots = "booked"  
- GREEN filled plots = "available"
- WHITE, LIGHT GRAY, or EMPTY/UNFILLED plots = "available"
- Look for plot numbers/labels inside each plot boundary

Return ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "totalPlots": <number>,
  "sold": <number>,
  "booked": <number>,
  "available": <number>,
  "confidence": <0-100 percentage>,
  "detectedLegend": {
    "red": "sold",
    "yellow": "booked",
    "green": "available",
    "white": "available"
  },
  "notes": "<brief description of what you detected>",
  "plots": [
    {
      "plotNumber": "<plot label/number if visible, else 'Plot N'>",
      "status": "<available|booked|sold>",
      "xPercent": <0-100 position from left as percentage>,
      "yPercent": <0-100 position from top as percentage>,
      "widthPercent": <estimated width as percentage of image>,
      "heightPercent": <estimated height as percentage of image>,
      "color": "<detected fill color description>"
    }
  ]
}

Important:
- If you cannot read plot numbers, use sequential numbering like "Plot 1", "Plot 2"
- Estimate coordinates as percentages of the full image dimensions
- Be thorough - detect every visible plot boundary
- If the image is unclear, still attempt detection and note low confidence`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                finalImagePart,
                { text: prompt }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 8192,
          }
        })
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini API error:', errText);
      return NextResponse.json({ error: 'AI analysis failed', details: errText }, { status: 500 });
    }

    const geminiData = await geminiRes.json();
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Clean and parse JSON from the response
    let cleanJson = rawText.trim();
    // Remove markdown code blocks if present
    cleanJson = cleanJson.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();

    let analysisResult;
    try {
      analysisResult = JSON.parse(cleanJson);
    } catch {
      console.error('Failed to parse Gemini response as JSON:', cleanJson);
      return NextResponse.json({
        error: 'Could not parse AI response as JSON',
        rawResponse: cleanJson.substring(0, 500)
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
      rawResponse: cleanJson,
    });
  } catch (error: any) {
    console.error('Analyze layout error:', error);
    return NextResponse.json({ error: error.message || 'Analysis failed' }, { status: 500 });
  }
}
