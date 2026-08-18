import type { Metadata } from "next";
import { ProductExperience } from "@/components/sections/product-experience";

export const metadata: Metadata = {
  title: "Experiência i.sí — Escolha a sua combinação",
  description:
    "Uma experiência de produto: arraste para percorrer as combinações i.sí. Componente isolado para futura integração ao Hero.",
};

// Preview isolado do componente PRODUCT EXPERIENCE.
// Não integra ao restante do site — apenas renderiza o componente sozinho.
export default function ExperienciaPage() {
  return (
    <main className="bg-ink">
      <ProductExperience />
    </main>
  );
}
