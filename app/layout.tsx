import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vendari Studio",
  description: "Engine de geração por módulos • presets • histórico"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
