// ChalkScript AI landing page. The route (app/page.tsx) only renders this.
// Story: recognition → transformation → understanding → possibilities →
// belief → action.
import "./landing.css";
import { AudienceSection } from "./audience/AudienceSection";
import { BeforeAfterSection } from "./before-after/BeforeAfterSection";
import { DemoSection } from "./demo/DemoSection";
import { FinalCta } from "./final/FinalCta";
import { Hero } from "./hero/Hero";
import { PipelineSection } from "./inside/PipelineSection";
import { MotionRuntime } from "./MotionRuntime";
import { ProcessSection } from "./process/ProcessSection";
import { Seam } from "./seam/Seam";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { UseCasesSection } from "./use-cases/UseCasesSection";

export function LandingPage() {
  return (
    <div className="landing flex flex-1 flex-col">
      <a href="#main" className="cs-skip">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className="flex-1">
        {/* recognition */}
        <Hero />

        {/* transformation */}
        <div data-theme="light" className="bg-paper pt-6">
          <Seam seed={9101} label="boundary · resolved" />
        </div>
        <DemoSection />

        {/* understanding */}
        <ProcessSection />

        {/* possibilities */}
        <div data-theme="light" className="bg-chalk pt-6">
          <Seam seed={9202} label="boundary · resolved" />
        </div>
        <UseCasesSection />
        <PipelineSection />

        {/* belief */}
        <BeforeAfterSection />
        <div data-theme="light" className="bg-paper pt-6">
          <Seam seed={9303} label="boundary · resolved" />
        </div>
        <AudienceSection />

        {/* action */}
        <FinalCta />
      </main>
      <SiteFooter />
      <MotionRuntime />
    </div>
  );
}
