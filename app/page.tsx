"use client";


import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wand2, Sparkles, Image as ImageIcon, Layers, Settings, Copy, Check, Trash2,
  Download, History, Search, Plus, ChevronRight, ChevronLeft, AlertTriangle
} from "lucide-react";

/* ---------------------------
   Minimal UI primitives (Tailwind)
---------------------------- */

function cx(...v: Array<string | false | undefined | null>) {
  return v.filter(Boolean).join(" ");
}

function Button({
  children,
  variant = "primary",
  className,
  onClick,
  disabled,
  type = "button"
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "destructive";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed";
  const styles: Record<string, string> = {
    primary: "bg-white text-black hover:bg-white/90",
    secondary: "bg-white/10 text-white hover:bg-white/15 border border-white/10",
    outline: "bg-transparent text-white hover:bg-white/10 border border-white/15",
    destructive: "bg-red-500/90 text-white hover:bg-red-500 border border-red-500/40"
  };
  return (
    <button
      type={type}
      className={cx(base, styles[variant], className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cx(
        "w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none",
        "focus:border-white/20 focus:bg-white/7",
        props.className
      )}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cx(
        "w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none",
        "focus:border-white/20 focus:bg-white/7",
        props.className
      )}
    />
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-xs font-semibold text-white/80">{children}</div>;
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cx("rounded-3xl border border-white/10 bg-white/[0.03] shadow-sm", className)}>
      {children}
    </div>
  );
}

function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="px-5 pt-5">{children}</div>;
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return <div className="text-base font-semibold">{children}</div>;
}

function CardDescription({ children }: { children: React.ReactNode }) {
  return <div className="mt-1 text-xs text-white/55">{children}</div>;
}

function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cx("px-5 pb-5 pt-4", className)}>{children}</div>;
}

function Separator() {
  return <div className="my-5 h-px w-full bg-white/10" />;
}

function Badge({ children, variant = "secondary" }: { children: React.ReactNode; variant?: "secondary" | "outline" | "danger" }) {
  const base = "inline-flex items-center rounded-2xl px-2 py-0.5 text-[11px] font-semibold";
  const styles: Record<string, string> = {
    secondary: "bg-white/10 text-white/80 border border-white/10",
    outline: "bg-transparent text-white/70 border border-white/15",
    danger: "bg-red-500/15 text-red-200 border border-red-500/20"
  };
  return <span className={cx(base, styles[variant])}>{children}</span>;
}

function Switch({
  checked,
  onChange
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cx(
        "h-8 w-14 rounded-full border border-white/15 p-1 transition",
        checked ? "bg-white/20" : "bg-white/5"
      )}
      aria-pressed={checked}
    >
      <div
        className={cx(
          "h-6 w-6 rounded-full bg-white transition",
          checked ? "translate-x-6" : "translate-x-0"
        )}
      />
    </button>
  );
}

function Select({
  value,
  onChange,
  options
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/20"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-[#0b0f17]">
          {o.label}
        </option>
      ))}
    </select>
  );
}

function Modal({
  open,
  onClose,
  title,
  subtitle,
  children
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-[#0b0f17] shadow-xl">
        <div className="px-5 pt-5">
          <div className="text-base font-semibold">{title}</div>
          {subtitle ? <div className="mt-1 text-xs text-white/55">{subtitle}</div> : null}
        </div>
        <div className="px-5 py-4">{children}</div>
        <div className="flex justify-end gap-2 border-t border-white/10 px-5 py-4">
          <Button variant="secondary" onClick={onClose}>Fechar</Button>
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition",
        active ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/15 border border-white/10"
      )}
    >
      {children}
    </button>
  );
}

/* ---------------------------
   Types
---------------------------- */

type Modulo =
  | "CAPA_ANUNCIO"
  | "INFOGRAFICO_PROMOCIONAL"
  | "FUNDO_BRANCO_ML"
  | "FOTO_NO_PE_LIFESTYLE";

type AnguloML =
  | "FRONT_45_CAPA"
  | "LATERAL_PERFIL"
  | "TOP_DOWN"
  | "TRASEIRA"
  | "SOLADO_MACRO"
  | "PERSPECTIVA_3_4_PREMIUM";

type Enquadramento = "JOELHO_PRA_BAIXO" | "PESCOCO_PRA_BAIXO";
type CenarioLifestyle =
  | "URBANO_MINIMAL"
  | "ACADEMIA_REAL"
  | "STREET_SKT"
  | "CASUAL_TRABALHO"
  | "FASHION_FEMININO";

type JobStatus = "queued" | "running" | "done" | "error";

type GenerationStep = {
  id: string;
  modulo: Modulo;
  selectors?: {
    anguloML?: AnguloML;
    enquadramento?: Enquadramento;
    cenarioLifestyle?: CenarioLifestyle;
  };
};

type GenerationResult = {
  stepId: string;
  modulo: Modulo;
  prompt: string;
  seed: number;
  createdAt: number;
  imageDataUrl?: string;
};

type Job = {
  id: string;
  createdAt: number;
  name: string;
  status: JobStatus;
  steps: GenerationStep[];
  results: GenerationResult[];
  error?: string;
};

type PresetKey =
  | "PACOTE_SHOPEE_PADRAO"
  | "PACOTE_ML_PADRAO"
  | "PACOTE_3_CAPAS"
  | "SO_FUNDO_BRANCO_ANGULOS"
  | "CUSTOM";

type FormState = {
  nichoEstilo: string;
  categoria: string;
  usoPrincipal: string;
  tamanhos: string;
  cores: string;
  nomeModelo: string;
  beneficios: string;
  detalheExtra: string;
  restricoes: string;

  productImages: { id: string; name: string; dataUrl: string }[];

  modulo: Modulo;
  anguloML: AnguloML;
  enquadramento: Enquadramento;
  cenarioLifestyle: CenarioLifestyle;

  negativeGlobalOn: boolean;
  safeMobileLegibilityOn: boolean;

  preset: PresetKey;
};

/* ---------------------------
   Prompts (Router + modules)
---------------------------- */

const MASTER_ROUTER = `MASTER ROUTER — Gemini (SaaS)
Você é um Diretor de Arte + Fotógrafo de E-commerce + Designer Sênior.
Você cria imagens premium, com qualidade de marca global, alta conversão e hierarquia impecável.

REGRAS UNIVERSAIS (sempre ativas)

Use o(s) produto(s) anexado(s) como referência absoluta.

LOCK ABSOLUTE PRODUCT + BRAND DETAIL: preserve 100%: forma, proporções, materiais, textura, costuras, recortes, sola, logo (posição/espessura/fonte), cores e geometria.
Não redesenhe, não reconstrua, não “reinterprete”, não suavize detalhes.

Você pode ajustar apenas: luz, contraste, nitidez, composição, fundo e elementos gráficos (quando permitido).

Sempre gerar em 1200×1200 (1:1), ultra nítido, sem watermark, sem erros.

Tudo deve ficar legível no celular.

Se existir {RESTRICOES}, elas têm prioridade.

DADOS DO JOB (campos do SaaS)

Módulo selecionado: {MODULO}

Nicho/estilo: {NICHO_ESTILO}
Categoria: {CATEGORIA}
Uso principal: {USO}
Tamanhos/medidas: {TAMANHOS}
Cores disponíveis: {CORES}
Nome do modelo: {NOME_MODELO}
Benefícios: {BENEFICIOS}
Detalhe extra: {DETALHE_EXTRA}
Restrições: {RESTRICOES}

Agora execute SOMENTE o módulo {MODULO} correspondente, com máxima qualidade.`;

const MODULES: Record<Modulo, string> = {
  CAPA_ANUNCIO: `CAPA_ANUNCIO (1200×1200)
Crie uma CAPA DE ANÚNCIO com foco em clique imediato. Visual sportwear/consumer premium, clean, forte e extremamente legível.

Layout
- Produto em hero shot gigante (65–80% da arte), ângulo mais impactante (3/4 ou lateral), sombra suave realista.
- Fundo: escolha automaticamente o melhor para {NICHO_ESTILO}.
- Tipografia moderna, premium, com respiro.

Texto (mínimo e estratégico)
- Headline curta e forte (com base em {CATEGORIA}/{USO}/{NICHO_ESTILO}).
- 1 benefício curto (2–4 palavras) de {BENEFICIOS} ou inferido.
- Se {TAMANHOS} existir: “TAM: {TAMANHOS}”.
- 1 selo pequeno adaptado ao uso.
- CTA discreto opcional: “VEJA DETALHES”.

Regras
- Máximo 3 blocos de texto.
- Nada de parágrafos.
- Produto 100% fiel (LOCK).
Entregar 1 arte final CAPA.`,

  INFOGRAFICO_PROMOCIONAL: `INFOGRAFICO_PROMOCIONAL (1200×1200)
Crie um infográfico comercial premium (alto ticket visual), organizado e persuasivo.

Estrutura
- Topo: Headline + subheadline curta (benefício principal).
- Centro: produto grande + (se fizer sentido) 2 mini variações de cor.
- Benefícios com ícones minimalistas: 4–6 bullets (usar {BENEFICIOS} + adaptar para {USO}).
- Zoom/close técnico: recorte ampliado do material (sem inventar padrões).
- Se {TAMANHOS}: “Tamanhos: {TAMANHOS}”.
- Rodapé: frase curta de fechamento + CTA leve.

Direção de arte
- Fundo/elements adequados ao {NICHO_ESTILO} sem poluir.
- Produto sempre protagonista.
Entregar 1 arte final INFOGRAFICO.`,

  FUNDO_BRANCO_ML: `FUNDO_BRANCO_ML — PADRÃO ABSOLUTO (1200×1200)

LOCK ABSOLUTE PRODUCT + BRAND DETAIL (OBRIGATÓRIO)
Preserve 100% do produto anexado: shape, proporções, cores, textura, costuras, recortes, geometria da sola, e logo.
Proibido: reconstruir, redesenhar, suavizar, inventar detalhes, alterar material, alterar logo, deformar perspectiva.

Padrão do Estúdio
- Fundo: branco puro seamless (#FFFFFF), sem textura
- Luz: softbox difusa (topo + frontal leve), cor neutra
- Sombra: natural, suave, sem “fake shadow”
- Nitidez: alta, foco perfeito
- 1:1 (1200×1200), e-commerce premium

Seletor de Ângulo: {ANGULO_ML}
Execute SOMENTE o ângulo selecionado e entregue 1 imagem final no ângulo escolhido.`,

  FOTO_NO_PE_LIFESTYLE: `FOTO_NO_PE_LIFESTYLE — CALÇANDO (1200×1200)

Entrada: produto anexado (LOCK ABSOLUTE PRODUCT).
Objetivo: foto comercial realista “de marca grande” com o produto calçado.

Seletores
- Enquadramento: {ENQUADRAMENTO}
- Cenário: {CENARIO_LIFESTYLE}

Roupa adaptativa
- Escolha vestimenta coerente com {NICHO_ESTILO}.

Direção fotográfica
- Foto ultra realista, luz natural ou estúdio suave.
- Textura do produto extremamente nítida.
- Pose natural (passo leve, pé apoiado), sem parecer 3D.

Regras
- Não mostrar rosto.
- Sem marcas de terceiros evidentes no ambiente/roupa.
Entregar 1 imagem final lifestyle conforme seletores.`
};

const NEGATIVE_GLOBAL = `NEGATIVE GLOBAL:
Evitar sempre: poluição visual, texto longo, fontes ruins, sombras pesadas, distorção do produto, logo inventado, render 3D fake, fundo chamativo, erros de ortografia, watermark, baixa resolução, recortes tortos, perspectiva deformada.`;

/* ---------------------------
   Presets
---------------------------- */

const PRESETS: Record<
  Exclude<PresetKey, "CUSTOM">,
  { name: string; hint: string; steps: GenerationStep[] }
> = {
  PACOTE_SHOPEE_PADRAO: {
    name: "Pacote Shopee (Capa + Info + Lifestyle)",
    hint: "1 clique → 3 artes (capa, infográfico, foto no pé).",
    steps: [
      { id: "s1", modulo: "CAPA_ANUNCIO" },
      { id: "s2", modulo: "INFOGRAFICO_PROMOCIONAL" },
      {
        id: "s3",
        modulo: "FOTO_NO_PE_LIFESTYLE",
        selectors: { enquadramento: "JOELHO_PRA_BAIXO", cenarioLifestyle: "URBANO_MINIMAL" }
      }
    ]
  },
  PACOTE_ML_PADRAO: {
    name: "Pacote Mercado Livre (Capa + 2x Fundo Branco + Info)",
    hint: "ML costuma pedir mais ângulos de estúdio.",
    steps: [
      { id: "s1", modulo: "CAPA_ANUNCIO" },
      { id: "s2", modulo: "INFOGRAFICO_PROMOCIONAL" },
      { id: "s3", modulo: "FUNDO_BRANCO_ML", selectors: { anguloML: "FRONT_45_CAPA" } },
      { id: "s4", modulo: "FUNDO_BRANCO_ML", selectors: { anguloML: "LATERAL_PERFIL" } }
    ]
  },
  PACOTE_3_CAPAS: {
    name: "3 Capas (variações de impacto)",
    hint: "Para testar criativos rapidamente.",
    steps: [
      { id: "s1", modulo: "CAPA_ANUNCIO" },
      { id: "s2", modulo: "CAPA_ANUNCIO" },
      { id: "s3", modulo: "CAPA_ANUNCIO" }
    ]
  },
  SO_FUNDO_BRANCO_ANGULOS: {
    name: "Fundo Branco (todos ângulos)",
    hint: "Gera 6 imagens: padrão ML completo.",
    steps: [
      { id: "s1", modulo: "FUNDO_BRANCO_ML", selectors: { anguloML: "FRONT_45_CAPA" } },
      { id: "s2", modulo: "FUNDO_BRANCO_ML", selectors: { anguloML: "LATERAL_PERFIL" } },
      { id: "s3", modulo: "FUNDO_BRANCO_ML", selectors: { anguloML: "TOP_DOWN" } },
      { id: "s4", modulo: "FUNDO_BRANCO_ML", selectors: { anguloML: "TRASEIRA" } },
      { id: "s5", modulo: "FUNDO_BRANCO_ML", selectors: { anguloML: "SOLADO_MACRO" } },
      { id: "s6", modulo: "FUNDO_BRANCO_ML", selectors: { anguloML: "PERSPECTIVA_3_4_PREMIUM" } }
    ]
  }
};

/* ---------------------------
   Utils
---------------------------- */

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function clampText(v: string, max = 4000) {
  if (!v) return "";
  return v.length > max ? v.slice(0, max) : v;
}

function formatDate(ts: number) {
  const d = new Date(ts);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadJson(filename: string, obj: any) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function applyVars(template: string, vars: Record<string, string>) {
  let out = template;
  for (const [k, v] of Object.entries(vars)) out = out.split(`{${k}}`).join(v ?? "");
  return out;
}

function buildPrompt(step: GenerationStep, form: FormState) {
  const vars: Record<string, string> = {
    MODULO: step.modulo,
    NICHO_ESTILO: form.nichoEstilo || "(não informado)",
    CATEGORIA: form.categoria || "(não informado)",
    USO: form.usoPrincipal || "(não informado)",
    TAMANHOS: form.tamanhos || "(não informado)",
    CORES: form.cores || "(não informado)",
    NOME_MODELO: form.nomeModelo || "(não informado)",
    BENEFICIOS: form.beneficios || "(não informado)",
    DETALHE_EXTRA: form.detalheExtra || "(não informado)",
    RESTRICOES: form.restricoes || "(nenhuma)",
    ANGULO_ML: step.selectors?.anguloML || form.anguloML,
    ENQUADRAMENTO: step.selectors?.enquadramento || form.enquadramento,
    CENARIO_LIFESTYLE: step.selectors?.cenarioLifestyle || form.cenarioLifestyle
  };

  const router = applyVars(MASTER_ROUTER, vars);
  const moduleText = applyVars(MODULES[step.modulo], vars);

  const parts = [router, "\n\n---\n\n", moduleText];

  if (form.safeMobileLegibilityOn) {
    parts.push(
      "\n\nMOBILE LEGIBILITY CHECK: mantenha textos grandes, alto contraste, máximo 3 blocos (quando aplicável), sem microtexto."
    );
  }
  if (form.negativeGlobalOn) parts.push("\n\n---\n\n", NEGATIVE_GLOBAL);

  return parts.join("");
}

/* ---------------------------
   Mock image generator (fallback)
---------------------------- */

function canvasMockImage(label: string, seed: number) {
  const c = document.createElement("canvas");
  c.width = 1200;
  c.height = 1200;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#0b0f17";
  ctx.fillRect(0, 0, 1200, 1200);

  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = "#ffffff";
  for (let x = 0; x <= 1200; x += 80) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1200); ctx.stroke();
  }
  for (let y = 0; y <= 1200; y += 80) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1200, y); ctx.stroke();
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = "rgba(255,255,255,0.06)";
  (ctx as any).roundRect(80, 120, 1040, 960, 40);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.font = "700 52px system-ui, -apple-system, Segoe UI";
  ctx.fillText("VENDARI STUDIO — MOCK", 140, 220);

  ctx.fillStyle = "rgba(255,255,255,0.78)";
  ctx.font = "500 34px system-ui, -apple-system, Segoe UI";
  ctx.fillText(label.slice(0, 50), 140, 290);

  ctx.fillStyle = "rgba(255,255,255,0.65)";
  ctx.font = "500 28px system-ui, -apple-system, Segoe UI";
  ctx.fillText(`seed: ${seed}`, 140, 350);

  ctx.fillStyle = "rgba(255,255,255,0.10)";
  (ctx as any).roundRect(140, 420, 920, 560, 34);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = "600 40px system-ui";
  ctx.fillText("(substituir pela imagem gerada)", 240, 720);

  return c.toDataURL("image/png");
}

// @ts-ignore
(CanvasRenderingContext2D.prototype as any).roundRect =
  (CanvasRenderingContext2D.prototype as any).roundRect ||
  function (this: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    const min = Math.min(w, h);
    if (r > min / 2) r = min / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
  };

async function mockGenerateImage(prompt: string, seed: number): Promise<string> {
  await new Promise((r) => setTimeout(r, 650 + Math.random() * 650));
  return canvasMockImage(prompt.split("\n")[0] || "Vendari", seed);
}

/* ---------------------------
   Real generator (calls /api/generate)
---------------------------- */

async function realGenerateImage(prompt: string, images: string[]): Promise<string> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, images })
  });

  const data = await res.json();
  if (!res.ok || !data?.ok) throw new Error(data?.error || "Falha ao gerar imagem");
  return `data:${data.mimeType};base64,${data.imageBase64}`;
}

/* ---------------------------
   LocalStorage persistence
---------------------------- */

const LS_KEY = "vendari_studio_next_mvp_v1";

type Persisted = { form: FormState; jobs: Job[] };

function defaultForm(): FormState {
  return {
    nichoEstilo: "street/skate",
    categoria: "tênis",
    usoPrincipal: "dia a dia",
    tamanhos: "34–43",
    cores: "preto, branco",
    nomeModelo: "",
    beneficios: "conforto, leveza, durabilidade",
    detalheExtra: "",
    restricoes: "",
    productImages: [],
    modulo: "CAPA_ANUNCIO",
    anguloML: "FRONT_45_CAPA",
    enquadramento: "JOELHO_PRA_BAIXO",
    cenarioLifestyle: "URBANO_MINIMAL",
    negativeGlobalOn: true,
    safeMobileLegibilityOn: true,
    preset: "PACOTE_SHOPEE_PADRAO"
  };
}

function safeJsonParse<T>(s: string | null, fallback: T): T {
  if (!s) return fallback;
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}

function loadState(): Persisted {
  return safeJsonParse(localStorage.getItem(LS_KEY), { form: defaultForm(), jobs: [] });
}

function saveState(p: Persisted) {
  localStorage.setItem(LS_KEY, JSON.stringify(p));
}

/* ---------------------------
   Page
---------------------------- */

export default function Page() {
  const [persisted, setPersisted] = useState<Persisted>(() => ({ form: defaultForm(), jobs: [] }));
  const [tab, setTab] = useState<"studio" | "history" | "settings">("studio");
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [promptOpen, setPromptOpen] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState("");
  const [useMock, setUseMock] = useState(false);
  const runningRef = useRef(false);

  useEffect(() => {
    setPersisted(loadState());
  }, []);

  useEffect(() => {
    saveState(persisted);
  }, [persisted]);

  useEffect(() => {
    // Você pode forçar mock com env USE_MOCK_GENERATION=1 no build (Vercel/Next)
    // No client, a única forma é via UI switch (Settings) ou query param.
    const q = new URLSearchParams(window.location.search);
    if (q.get("mock") === "1") setUseMock(true);
  }, []);

  const form = persisted.form;
  const jobs = persisted.jobs;

  const derivedSteps = useMemo(() => {
    if (form.preset !== "CUSTOM") return PRESETS[form.preset].steps;

    return [
      {
        id: "custom_step",
        modulo: form.modulo,
        selectors:
          form.modulo === "FUNDO_BRANCO_ML"
            ? { anguloML: form.anguloML }
            : form.modulo === "FOTO_NO_PE_LIFESTYLE"
              ? { enquadramento: form.enquadramento, cenarioLifestyle: form.cenarioLifestyle }
              : {}
      }
    ];
  }, [form.preset, form.modulo, form.anguloML, form.enquadramento, form.cenarioLifestyle]);

  const previewPrompt = useMemo(() => buildPrompt(derivedSteps[0], form), [derivedSteps, form]);

  const stats = useMemo(() => {
    const total = jobs.length;
    const done = jobs.filter((j) => j.status === "done").length;
    const running = jobs.filter((j) => j.status === "running").length;
    const queued = jobs.filter((j) => j.status === "queued").length;
    return { total, done, running, queued };
  }, [jobs]);

  const activeJob = useMemo(() => {
    if (!activeJobId) return null;
    return jobs.find((j) => j.id === activeJobId) || null;
  }, [activeJobId, jobs]);

  const filteredJobs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return jobs;
    return jobs.filter((j) => {
      if (j.name.toLowerCase().includes(q)) return true;
      if (j.id.toLowerCase().includes(q)) return true;
      return j.results?.some((r) => r.modulo.toLowerCase().includes(q));
    });
  }, [jobs, search]);

  function updateForm(patch: Partial<FormState>) {
    setPersisted((p) => ({ ...p, form: { ...p.form, ...patch } }));
  }

  async function onAddImages(files: FileList | null) {
    if (!files || files.length === 0) return;
    const arr = Array.from(files).slice(0, 8);
    const mapped = await Promise.all(
      arr.map(async (f) => ({
        id: uid("img"),
        name: f.name,
        dataUrl: await fileToDataUrl(f)
      }))
    );
    updateForm({ productImages: [...form.productImages, ...mapped].slice(0, 12) });
  }

  function removeImage(id: string) {
    updateForm({ productImages: form.productImages.filter((x) => x.id !== id) });
  }

  function clearAll() {
    const fresh = { form: defaultForm(), jobs: [] };
    setPersisted(fresh);
    setActiveJobId(null);
    setTab("studio");
  }

  function enqueueGeneration() {
    const name =
      `${form.categoria || "Produto"} • ` +
      (form.preset !== "CUSTOM" ? PRESETS[form.preset].name : form.modulo);

    const job: Job = {
      id: uid("job"),
      createdAt: Date.now(),
      name,
      status: "queued",
      steps: derivedSteps.map((s, idx) => ({ ...s, id: `${s.id}_${idx}` })),
      results: []
    };

    setPersisted((p) => ({ ...p, jobs: [job, ...p.jobs] }));
    setActiveJobId(job.id);
  }

  function deleteJob(id: string) {
    setPersisted((p) => ({ ...p, jobs: p.jobs.filter((j) => j.id !== id) }));
    if (activeJobId === id) setActiveJobId(null);
  }

  async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 900);
  }

  // Runner (processa fila)
  useEffect(() => {
    if (runningRef.current) return;
    const next = jobs.find((j) => j.status === "queued");
    if (!next) return;

    runningRef.current = true;
    (async () => {
      try {
        setPersisted((p) => ({
          ...p,
          jobs: p.jobs.map((j) => (j.id === next.id ? { ...j, status: "running", error: undefined } : j))
        }));

        const results: GenerationResult[] = [];
        for (const step of next.steps) {
          const prompt = buildPrompt(step, form);
          const seed = Math.floor(Math.random() * 1_000_000);

          let imageDataUrl: string;
          try {
            if (useMock) throw new Error("FORCED_MOCK");
            imageDataUrl = await realGenerateImage(prompt, form.productImages.map(x => x.dataUrl));
          } catch (e: any) {
            // fallback para mock (útil quando ainda não configurou .env.local / modelo)
            imageDataUrl = await mockGenerateImage(prompt, seed);
          }

          results.push({ stepId: step.id, modulo: step.modulo, prompt, seed, createdAt: Date.now(), imageDataUrl });
        }

        setPersisted((p) => ({
          ...p,
          jobs: p.jobs.map((j) => (j.id === next.id ? { ...j, status: "done", results } : j))
        }));
        setActiveJobId(next.id);
        setTab("history");
      } catch (e: any) {
        setPersisted((p) => ({
          ...p,
          jobs: p.jobs.map((j) => (j.id === next.id ? { ...j, status: "error", error: String(e?.message || e) } : j))
        }));
      } finally {
        runningRef.current = false;
      }
    })();
  }, [jobs, form, useMock]);

  const bg =
    "bg-[radial-gradient(80%_60%_at_50%_0%,rgba(56,189,248,0.18),rgba(0,0,0,0))]";

  return (
    <div className={cx("min-h-screen w-full", bg)}>
      <div className="mx-auto max-w-7xl px-4 py-7 md:px-6 md:py-10">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500/25 via-sky-500/25 to-fuchsia-500/25 blur" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03]">
                  <Sparkles className="h-5 w-5" />
                </div>
              </div>
              <div>
                <div className="text-lg font-semibold tracking-tight">Vendari Studio</div>
                <div className="text-xs text-white/55">Engine por módulos • 1200×1200 • presets • histórico</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  downloadJson(`vendari_export_${Date.now()}.json`, {
                    exportedAt: Date.now(),
                    version: "vendari-studio-next-mvp-v1",
                    form,
                    jobs
                  });
                }}
              >
                <Download className="h-4 w-4" /> Exportar
              </Button>

              <label className="inline-flex cursor-pointer">
                <input
                  type="file"
                  accept="application/json"
                  className="hidden"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    const text = await f.text();
                    try {
                      const parsed = JSON.parse(text);
                      if (!parsed?.form || !parsed?.jobs) throw new Error("Arquivo inválido");
                      setPersisted({ form: parsed.form, jobs: parsed.jobs });
                      setTab("history");
                    } catch (err: any) {
                      alert(String(err?.message || err));
                    }
                  }}
                />
                <span>
                  <Button variant="outline">
                    <Plus className="h-4 w-4" /> Importar
                  </Button>
                </span>
              </label>

              <Button variant="destructive" onClick={clearAll}>
                <Trash2 className="h-4 w-4" /> Reset
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Card className="rounded-2xl">
              <CardContent className="pt-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{derivedSteps.length} etapa(s) no pacote</div>
                    <div className="truncate text-xs text-white/55">
                      {form.preset !== "CUSTOM" ? PRESETS[form.preset].name : "Custom"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardContent className="pt-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                    <History className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{stats.done}/{stats.total} jobs finalizados</div>
                    <div className="truncate text-xs text-white/55">{stats.running} rodando • {stats.queued} na fila</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardContent className="pt-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                    <ImageIcon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{form.productImages.length} imagem(ns) anexada(s)</div>
                    <div className="truncate text-xs text-white/55">{form.productImages.length ? "LOCK ativo" : "Pode testar sem anexar (mock) / com prompt puro"}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          <TabButton active={tab === "studio"} onClick={() => setTab("studio")}>
            <Wand2 className="h-4 w-4" /> Studio
          </TabButton>
          <TabButton active={tab === "history"} onClick={() => setTab("history")}>
            <History className="h-4 w-4" /> Histórico
          </TabButton>
          <TabButton active={tab === "settings"} onClick={() => setTab("settings")}>
            <Settings className="h-4 w-4" /> Config
          </TabButton>
        </div>

        {/* Studio */}
        {tab === "studio" ? (
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Brief do Produto</CardTitle>
                <CardDescription>Preencha uma vez. O engine injeta nos módulos e gera o pacote completo.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Nicho/estilo</Label>
                    <Input value={form.nichoEstilo} onChange={(e) => updateForm({ nichoEstilo: clampText(e.target.value, 120) })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Input value={form.categoria} onChange={(e) => updateForm({ categoria: clampText(e.target.value, 120) })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Uso principal</Label>
                    <Input value={form.usoPrincipal} onChange={(e) => updateForm({ usoPrincipal: clampText(e.target.value, 160) })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Nome do modelo (opcional)</Label>
                    <Input value={form.nomeModelo} onChange={(e) => updateForm({ nomeModelo: clampText(e.target.value, 140) })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Tamanhos (opcional)</Label>
                    <Input value={form.tamanhos} onChange={(e) => updateForm({ tamanhos: clampText(e.target.value, 140) })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Cores (opcional)</Label>
                    <Input value={form.cores} onChange={(e) => updateForm({ cores: clampText(e.target.value, 220) })} />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Benefícios</Label>
                    <Textarea className="min-h-[90px]" value={form.beneficios} onChange={(e) => updateForm({ beneficios: clampText(e.target.value, 900) })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Detalhe extra</Label>
                    <Textarea className="min-h-[90px]" value={form.detalheExtra} onChange={(e) => updateForm({ detalheExtra: clampText(e.target.value, 700) })} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Restrições (prioridade máxima)</Label>
                  <Textarea className="min-h-[90px]" value={form.restricoes} onChange={(e) => updateForm({ restricoes: clampText(e.target.value, 1200) })} />
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">Imagens do produto</div>
                      <div className="text-xs text-white/55">Anexe 1–8 fotos (referência absoluta).</div>
                    </div>
                    <div className="flex gap-2">
                      <label className="inline-flex cursor-pointer">
                        <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => onAddImages(e.target.files)} />
                        <span><Button><Plus className="h-4 w-4" /> Adicionar</Button></span>
                      </label>
                      <Button variant="outline" onClick={() => updateForm({ productImages: [] })} disabled={!form.productImages.length}>
                        Limpar
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {form.productImages.map((img) => (
                      <div key={img.id} className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                        <img src={img.dataUrl} alt={img.name} className="h-28 w-full object-cover" />
                        <div className="p-2">
                          <div className="truncate text-[11px] text-white/55">{img.name}</div>
                        </div>
                        <button
                          className="absolute right-2 top-2 rounded-2xl border border-white/10 bg-white/10 p-2 hover:bg-white/15"
                          onClick={() => removeImage(img.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    {!form.productImages.length ? (
                      <div className="col-span-2 rounded-2xl border border-dashed border-white/10 p-4 text-xs text-white/55 md:col-span-4">
                        Você pode testar o fluxo sem anexar imagens (fallback mock). Para produção, anexe pelo menos 1 foto.
                      </div>
                    ) : null}
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Card className="rounded-3xl">
                    <CardContent className="pt-5 space-y-2">
                      <Label>Preset</Label>
                      <Select
                        value={form.preset}
                        onChange={(v) => updateForm({ preset: v as PresetKey })}
                        options={[
                          { value: "PACOTE_SHOPEE_PADRAO", label: "Pacote Shopee (3 artes)" },
                          { value: "PACOTE_ML_PADRAO", label: "Pacote Mercado Livre (4 artes)" },
                          { value: "PACOTE_3_CAPAS", label: "3 Capas (testes)" },
                          { value: "SO_FUNDO_BRANCO_ANGULOS", label: "Fundo Branco (6 ângulos)" },
                          { value: "CUSTOM", label: "Custom (1 módulo)" }
                        ]}
                      />
                      <div className="text-xs text-white/55">
                        {form.preset !== "CUSTOM" ? PRESETS[form.preset].hint : "Custom gera apenas 1 módulo selecionado."}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {derivedSteps.map((s, i) => (
                          <Badge key={`${s.modulo}_${i}`} variant="outline">
                            {s.modulo}
                            {s.selectors?.anguloML ? ` • ${s.selectors.anguloML}` : ""}
                            {s.selectors?.enquadramento ? ` • ${s.selectors.enquadramento}` : ""}
                            {s.selectors?.cenarioLifestyle ? ` • ${s.selectors.cenarioLifestyle}` : ""}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-3xl">
                    <CardContent className="pt-5 space-y-3">
                      <div className="text-sm font-semibold">Custom: seletores</div>

                      <div className="space-y-2">
                        <Label>Módulo</Label>
                        <Select
                          value={form.modulo}
                          onChange={(v) => updateForm({ modulo: v as Modulo, preset: "CUSTOM" })}
                          options={[
                            { value: "CAPA_ANUNCIO", label: "CAPA_ANUNCIO" },
                            { value: "INFOGRAFICO_PROMOCIONAL", label: "INFOGRAFICO_PROMOCIONAL" },
                            { value: "FUNDO_BRANCO_ML", label: "FUNDO_BRANCO_ML" },
                            { value: "FOTO_NO_PE_LIFESTYLE", label: "FOTO_NO_PE_LIFESTYLE" }
                          ]}
                        />
                      </div>

                      <AnimatePresence mode="wait">
                        {form.modulo === "FUNDO_BRANCO_ML" ? (
                          <motion.div
                            key="ml"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="space-y-2"
                          >
                            <Label>Ângulo ML</Label>
                            <Select
                              value={form.anguloML}
                              onChange={(v) => updateForm({ anguloML: v as AnguloML, preset: "CUSTOM" })}
                              options={[
                                { value: "FRONT_45_CAPA", label: "FRONT_45_CAPA" },
                                { value: "LATERAL_PERFIL", label: "LATERAL_PERFIL" },
                                { value: "TOP_DOWN", label: "TOP_DOWN" },
                                { value: "TRASEIRA", label: "TRASEIRA" },
                                { value: "SOLADO_MACRO", label: "SOLADO_MACRO" },
                                { value: "PERSPECTIVA_3_4_PREMIUM", label: "PERSPECTIVA_3_4_PREMIUM" }
                              ]}
                            />
                          </motion.div>
                        ) : null}

                        {form.modulo === "FOTO_NO_PE_LIFESTYLE" ? (
                          <motion.div
                            key="life"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="space-y-2"
                          >
                            <Label>Enquadramento</Label>
                            <Select
                              value={form.enquadramento}
                              onChange={(v) => updateForm({ enquadramento: v as Enquadramento, preset: "CUSTOM" })}
                              options={[
                                { value: "JOELHO_PRA_BAIXO", label: "JOELHO_PRA_BAIXO" },
                                { value: "PESCOCO_PRA_BAIXO", label: "PESCOCO_PRA_BAIXO" }
                              ]}
                            />
                            <Label>Cenário</Label>
                            <Select
                              value={form.cenarioLifestyle}
                              onChange={(v) => updateForm({ cenarioLifestyle: v as CenarioLifestyle, preset: "CUSTOM" })}
                              options={[
                                { value: "URBANO_MINIMAL", label: "URBANO_MINIMAL" },
                                { value: "ACADEMIA_REAL", label: "ACADEMIA_REAL" },
                                { value: "STREET_SKT", label: "STREET_SKT" },
                                { value: "CASUAL_TRABALHO", label: "CASUAL_TRABALHO" },
                                { value: "FASHION_FEMININO", label: "FASHION_FEMININO" }
                              ]}
                            />
                          </motion.div>
                        ) : null}
                      </AnimatePresence>

                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-xs text-white/55">
                        Custom é ótimo pra testes. Pra operação, use Presets (pacotes) pra escalar.
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <Card className="rounded-3xl">
                    <CardContent className="pt-5 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold">Negative Global</div>
                        <div className="text-xs text-white/55">Anexa o bloco de negativos no final do prompt.</div>
                      </div>
                      <Switch checked={form.negativeGlobalOn} onChange={(v) => updateForm({ negativeGlobalOn: v })} />
                    </CardContent>
                  </Card>
                  <Card className="rounded-3xl">
                    <CardContent className="pt-5 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold">Legibilidade Mobile</div>
                        <div className="text-xs text-white/55">Força heurística de contraste e tamanho.</div>
                      </div>
                      <Switch checked={form.safeMobileLegibilityOn} onChange={(v) => updateForm({ safeMobileLegibilityOn: v })} />
                    </CardContent>
                  </Card>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-white/55">
                    Clique em <b>Gerar Pacote</b> → entra na fila e salva no histórico.
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPromptText(previewPrompt);
                        setPromptOpen(true);
                      }}
                    >
                      Ver prompt
                    </Button>
                    <Button onClick={enqueueGeneration}>
                      <Wand2 className="h-4 w-4" /> Gerar Pacote
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right: prompt preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview do Prompt</CardTitle>
                <CardDescription>Isso é o que o backend envia para a IA.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => copyToClipboard(previewPrompt)}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copiado" : "Copiar prompt"}
                </Button>

                <div className="h-[460px] overflow-auto rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                  <pre className="whitespace-pre-wrap text-xs leading-relaxed text-white/60">{previewPrompt}</pre>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-xs text-white/55">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4" />
                    <div>
                      <b className="text-white/85">Dica rápida</b><br />
                      Se ainda não configurou <b>.env.local</b> com sua chave/modelo, o app cai em <b>mock</b> automaticamente.
                      Você também pode ativar mock em Config.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* History */}
        {tab === "history" ? (
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Jobs</CardTitle>
                <CardDescription>Fila + histórico persistente.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <div className="pointer-events-none absolute left-3 top-2.5 text-white/50">
                    <Search className="h-4 w-4" />
                  </div>
                  <Input className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nome/módulo" />
                </div>

                <div className="h-[560px] overflow-auto space-y-2 pr-1">
                  {filteredJobs.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 p-4 text-xs text-white/55">
                      Nenhum job ainda. Gere um pacote no Studio.
                    </div>
                  ) : null}

                  {filteredJobs.map((j) => (
                    <button
                      key={j.id}
                      onClick={() => setActiveJobId(j.id)}
                      className={cx(
                        "w-full rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-left transition hover:bg-white/[0.05]",
                        activeJobId === j.id && "ring-2 ring-sky-500/30"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold">{j.name}</div>
                          <div className="truncate text-[11px] text-white/55">{formatDate(j.createdAt)}</div>
                        </div>
                        <Badge variant={j.status === "error" ? "danger" : j.status === "done" ? "secondary" : "outline"}>
                          {j.status}
                        </Badge>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {j.steps.slice(0, 4).map((s, idx) => (
                          <span key={idx} className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] text-white/55">
                            {s.modulo}
                          </span>
                        ))}
                        {j.steps.length > 4 ? (
                          <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] text-white/55">
                            +{j.steps.length - 4}
                          </span>
                        ) : null}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Detalhes do Job</CardTitle>
                <CardDescription>Resultados e prompts por etapa.</CardDescription>
              </CardHeader>
              <CardContent>
                {!activeJob ? (
                  <div className="rounded-2xl border border-dashed border-white/10 p-6 text-sm text-white/55">
                    Selecione um job para ver os resultados.
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="text-sm font-semibold">{activeJob.name}</div>
                        <div className="text-xs text-white/55">{activeJob.id} • {formatDate(activeJob.createdAt)}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => copyToClipboard(JSON.stringify(activeJob, null, 2))}>
                          <Copy className="h-4 w-4" /> Copiar JSON
                        </Button>
                        <Button variant="destructive" onClick={() => deleteJob(activeJob.id)}>
                          <Trash2 className="h-4 w-4" /> Excluir
                        </Button>
                      </div>
                    </div>

                    {activeJob.status !== "done" ? (
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-semibold">Status: {activeJob.status}</div>
                            <div className="text-xs text-white/55">Quando finalizar, as imagens aparecem aqui.</div>
                          </div>
                          <motion.div
                            animate={{ rotate: activeJob.status === "running" ? 360 : 0 }}
                            transition={{ duration: 1.2, repeat: activeJob.status === "running" ? Infinity : 0, ease: "linear" }}
                            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5"
                          >
                            <Sparkles className="h-4 w-4" />
                          </motion.div>
                        </div>
                      </div>
                    ) : null}

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {activeJob.results.map((r, idx) => (
                        <Card key={idx} className="overflow-hidden">
                          <div className="relative">
                            <img src={r.imageDataUrl} alt={r.modulo} className="h-64 w-full object-cover" />
                            <div className="absolute left-3 top-3 flex gap-2">
                              <Badge>{r.modulo}</Badge>
                              <Badge variant="outline">seed {r.seed}</Badge>
                            </div>
                          </div>
                          <CardContent className="space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <Button variant="secondary" onClick={() => copyToClipboard(r.prompt)}>
                                <Copy className="h-4 w-4" /> Copiar prompt
                              </Button>
                              <Button variant="outline" onClick={() => downloadText(`prompt_${r.modulo}_${r.seed}.txt`, r.prompt)}>
                                <Download className="h-4 w-4" /> Baixar
                              </Button>
                            </div>
                            <details className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                              <summary className="cursor-pointer text-sm font-semibold">Ver prompt</summary>
                              <pre className="mt-3 whitespace-pre-wrap text-xs text-white/60">{r.prompt}</pre>
                            </details>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* Settings */}
        {tab === "settings" ? (
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Config do Engine</CardTitle>
                <CardDescription>Plug da API + fallback mock.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 text-sm">
                  <b>Endpoint</b>
                  <div className="mt-2 text-xs text-white/55 leading-relaxed">
                    POST <b>/api/generate</b> recebe <b>prompt</b> + <b>images[]</b> e devolve <b>base64</b>.
                    Para produção em escala, o ideal é salvar em storage (S3/R2) e retornar URL.
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">Forçar Mock</div>
                    <div className="text-xs text-white/55">Útil se ainda não configurou .env.local ou está testando UI.</div>
                  </div>
                  <Switch checked={useMock} onChange={setUseMock} />
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-sm font-semibold">Master Router</div>
                  <div className="mt-2 text-xs text-white/55">Neste MVP ele está fixo no código.</div>
                  <Textarea className="mt-3 min-h-[240px]" value={MASTER_ROUTER} readOnly />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Atalhos</CardTitle>
                <CardDescription>Operação rápida.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={() => setTab("studio")}>
                  <ChevronLeft className="h-4 w-4" /> Voltar ao Studio
                </Button>
                <Button variant="secondary" className="w-full" onClick={() => setTab("history")}>
                  <ChevronRight className="h-4 w-4" /> Ver Histórico
                </Button>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-xs text-white/55">
                  Se estiver rodando na Vercel:
                  <div className="mt-2">
                    Project Settings → Environment Variables → add <b>GEMINI_API_KEY</b>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}

        <footer className="mt-10 text-center text-xs text-white/45">
          Vendari Studio MVP • Next.js • /api/generate • fallback mock
        </footer>

        <Modal
          open={promptOpen}
          onClose={() => setPromptOpen(false)}
          title="Prompt da Etapa"
          subtitle="Preview completo do prompt (router + módulo + negative)."
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Button
              variant="secondary"
              onClick={() => copyToClipboard(promptText)}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copiado" : "Copiar"}
            </Button>
          </div>
          <div className="mt-3 h-[520px] overflow-auto rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <pre className="whitespace-pre-wrap text-xs leading-relaxed text-white/60">{promptText}</pre>
          </div>
        </Modal>
      </div>
    </div>
  );
}
