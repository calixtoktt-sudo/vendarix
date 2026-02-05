# Vendari Studio (Next.js) — MVP com Backend Gemini

## 1) Instalar e rodar local
```bash
npm install
npm run dev
```
Abra: http://localhost:3000

## 2) Configurar Gemini (NÃO coloque chave no código)
Crie um arquivo `.env.local` na raiz:

```env
GEMINI_API_KEY=SUA_CHAVE_REAL_AQUI
GEMINI_IMAGE_MODEL=imagen-3.0-generate-001
# opcional: USE_MOCK_GENERATION=1  (força mock no front)
```

> Se o modelo `imagen-3.0-generate-001` não estiver disponível na sua conta,
> troque `GEMINI_IMAGE_MODEL` pelo modelo de imagem liberado no seu projeto.

## 3) Endpoint
- POST `/api/generate`
- body: `{ prompt: string, images?: string[] }`
- retorno: `{ ok: true, imageBase64, mimeType }`

## 4) Deploy
Suba no GitHub e conecte na Vercel.
Depois, configure as ENV Vars no painel da Vercel (Project Settings → Environment Variables).

---

## Observações
- Este MVP salva histórico no `localStorage`.
- Para escala (muitos jobs): recomenda-se fila (BullMQ/Redis) + storage (S3/R2) retornando URL.
