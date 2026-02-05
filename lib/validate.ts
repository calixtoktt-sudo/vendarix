type Modulo =
  | "CAPA_ANUNCIO"
  | "INFOGRAFICO_PROMOCIONAL"
  | "FUNDO_BRANCO_ML"
  | "FOTO_NO_PE_LIFESTYLE";

export type GeneratePayload = {
  prompt: string;
  images?: string[]; // base64 dataURL ou base64 puro
  module?: Modulo;
  selectors?: Record<string, any>;
};

const MAX_PROMPT_CHARS = 20000;
const MAX_IMAGES = 8;
const MAX_IMAGE_BYTES = 6_000_000; // ~6MB aprox por imagem

function isString(x: any): x is string {
  return typeof x === "string";
}

function stripDataUrlPrefix(s: string) {
  const idx = s.indexOf("base64,");
  return idx >= 0 ? s.slice(idx + "base64,".length) : s;
}

function approxBase64Bytes(b64: string) {
  return Math.floor((b64.length * 3) / 4);
}

export function validateGeneratePayload(input: any): GeneratePayload {
  if (!input || typeof input !== "object") {
    throw new Error("INVALID_PAYLOAD: body must be JSON object");
  }

  const prompt = input.prompt;
  if (!isString(prompt) || !prompt.trim()) {
    throw new Error("INVALID_PAYLOAD: prompt is required");
  }
  if (prompt.length > MAX_PROMPT_CHARS) {
    throw new Error("INVALID_PAYLOAD: prompt too large");
  }

  const imagesRaw = input.images;
  let images: string[] = [];
  if (Array.isArray(imagesRaw)) {
    images = imagesRaw.filter(isString).slice(0, MAX_IMAGES);
  }

  for (const img of images) {
    const b64 = stripDataUrlPrefix(img);
    const bytes = approxBase64Bytes(b64);
    if (bytes > MAX_IMAGE_BYTES) {
      throw new Error("INVALID_PAYLOAD: image too large");
    }
  }

  return {
    prompt: prompt.trim(),
    images,
    module: input.module,
    selectors: input.selectors ?? {},
  };
}
