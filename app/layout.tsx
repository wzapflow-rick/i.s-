import type { Metadata, Viewport } from "next";
import { Geist, Fraunces } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

export const metadata: Metadata = {
  title: "i.sí Gelato — Novas combinações. Novas possibilidades.",
  description:
    "Marca premium B2B de gelatos, açaí e sobremesas para negócios que querem ampliar seu mix e criar novas experiências. Parcerias comerciais selecionadas.",
  keywords: [
    "gelato",
    "açaí",
    "sorvete",
    "sobremesas",
    "fornecedor B2B",
    "parceria comercial",
    "i.sí",
  ],
  openGraph: {
    title: "i.sí Gelato — Novas combinações. Novas possibilidades.",
    description:
      "Produtos premium para negócios que querem ampliar seu mix e criar novas experiências.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f3eee4",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${fraunces.variable} bg-background antialiased`}
    >
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
