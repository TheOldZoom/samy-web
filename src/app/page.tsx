import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import SocialProofMarquee from "@/components/social-proof-marquee";
import FeatureGrid from "@/components/feature-grid";
import IntegrationsStrip from "@/components/integrations-strip";
import ClosingCta from "@/components/closing-cta";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <SocialProofMarquee />
        <FeatureGrid />
        <IntegrationsStrip />
        <ClosingCta />
      </main>
      <Footer />
    </>
  );
}
