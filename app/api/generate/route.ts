import { NextRequest, NextResponse } from "next/server";
import { generateImageWithGemini } from "../../../lib/gemini-image";
import { validateGeneratePayload } from "../../../lib/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payload = validateGeneratePayload(body);

    const { imageBase64, mimeType, modelUsed, safety } =
      await generateImageWithGemini(payload);

    return NextResponse.json(
      { ok: true, imageBase64, mimeType, modelUsed, safety },
      { status: 200 }
    );
  } catch (err: any) {
    const msg = String(err?.message || err);

    const status =
      msg.includes("INVALID_PAYLOAD") ? 400 :
      msg.includes("RATE_LIMIT") ? 429 :
      msg.includes("GEMINI_CONFIG") ? 500 :
      500;

    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}
