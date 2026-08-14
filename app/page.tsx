import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SmoothAnchors } from "@/components/layout/smooth-anchors";
import { Hero } from "@/components/sections/hero";
import { BrandConcept } from "@/components/sections/brand-concept";
import { Audience } from "@/components/sections/audience";
import { Quality } from "@/components/sections/quality";
import { Products } from "@/components/sections/products";
import { BusinessValue } from "@/components/sections/business-value";
import { HowItWorks } from "@/components/sections/how-it-works";
import { BrandStory } from "@/components/sections/brand-story";
import { CombinationExperience } from "@/components/sections/combination-experience";
import { FirstPartners } from "@/components/sections/first-partners";
import { PartnerForm } from "@/components/partner-form/partner-form";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SmoothAnchors />
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <BrandConcept />
        <Audience />
        <Quality />
        <Products />
        <BusinessValue />
        <HowItWorks />
        <BrandStory />
        <CombinationExperience />
        <FirstPartners />
        <PartnerForm />
      </main>
      <SiteFooter />
    </div>
  );
}
