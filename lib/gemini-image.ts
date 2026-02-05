import { GoogleGenerativeAI } from "@google/generative-ai";
import type { GeneratePayload } from "./validate";

function mustEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`GEMINI_CONFIG: missing env ${name}`);
  return v;
}

function stripDataUrlPrefix(s: string) {
  const idx = s.indexOf("base64,");
  return idx >= 0 ? s.slice(idx + "base64,".length) : s;
}

function guessMimeTypeFromDataUrl(s: string): string | null {
  if (!s.startsWith("data:")) return null;
  const m = s.match(/^data:([^;]+);base64,/);
  return m?.[1] || null;
}

export async function generateImageWithGemini(payload: GeneratePayload): Promise<{
  imageBase64: string;
  mimeType: string;
  modelUsed: string;
  safety?: any;
}> {
  const apiKey = mustEnv("GEMINI_API_KEY");
  const modelName = process.env.GEMINI_IMAGE_MODEL || "imagen-3.0-generate-001";

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelName });

  const parts: any[] = [{ text: payload.prompt }];

  for (const img of payload.images || []) {
    const b64 = stripDataUrlPrefix(img);
    const mime = guessMimeTypeFromDataUrl(img) || "image/png";
    parts.push({ inlineData: { data: b64, mimeType: mime } });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);

  try {
    const result = await model.generateContent(
      { contents: [{ role: "user", parts }] },
      { signal: controller.signal } as any
    );

    const response: any = result?.response;
    const cand = response?.candidates?.[0];
    const outParts = cand?.content?.parts || [];

    const imagePart = outParts.find((p: any) => p?.inlineData?.data);
    if (!imagePart) {
      const textPart = outParts.find((p: any) => p?.text)?.text;
      throw new Error(`GEMINI_NO_IMAGE: ${textPart || "model did not return image data"}`);
    }

    const imageBase64 = imagePart.inlineData.data as string;
    const mimeType = imagePart.inlineData.mimeType || "image/png";

    return {
      imageBase64,
      mimeType,
      modelUsed: modelName,
      safety: response?.promptFeedback || response?.safetyRatings
    };
  } catch (e: any) {
    const msg = String(e?.message || e);
    if (msg.toLowerCase().includes("429") || msg.toLowerCase().includes("rate")) {
      throw new Error("RATE_LIMIT: Gemini rate limited");
    }
    throw new Error(msg);
  } finally {
    clearTimeout(timeout);
  }
}
