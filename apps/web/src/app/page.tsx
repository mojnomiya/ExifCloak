import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/sections/hero";
import { ProblemSection } from "@/components/sections/problem";
import { DemoSection } from "@/components/sections/demo";
import { CapabilitiesSection } from "@/components/sections/capabilities";
import { WorkflowSection } from "@/components/sections/workflow";
import { SeoBlock } from "@/components/sections/seo-block";
import { SeoFaqSection } from "@/components/sections/seo-faq";
import { BottomCta } from "@/components/sections/bottom-cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <DemoSection />
      <CapabilitiesSection />
      <WorkflowSection />
      <SeoBlock />
      <SeoFaqSection />
      <BottomCta />
      <Footer />
    </main>
  );
}
