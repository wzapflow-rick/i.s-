import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SmoothAnchors } from "@/components/layout/smooth-anchors";
import { ProductExperience } from "@/components/sections/product-experience";
import { ChocolateTransition } from "@/components/sections/chocolate-transition";
import { Products } from "@/components/sections/products";
import { Quality } from "@/components/sections/quality";
import { BrandStory } from "@/components/sections/brand-story";
import { CombinationExperience } from "@/components/sections/combination-experience";
import { PartnerForm } from "@/components/partner-form/partner-form";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SmoothAnchors />
      <SiteHeader />
      <main className="flex-1">
        {/* Fluxo objetivo: PRODUTO → DIFERENCIAL → MARCA → EXPERIÊNCIA → FORMULÁRIO */}
        <ProductExperience asHero />
        <ChocolateTransition />
        <Products />
        <Quality />
        <BrandStory />
        <CombinationExperience />
        <PartnerForm />
      </main>
      <SiteFooter />
    </div>
  );
}
