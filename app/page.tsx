import { Hero } from "@/components/home/Hero";
import { Introduction } from "@/components/home/Introduction";
import { SetItUp } from "@/components/home/SetItUp";
import { SectionRail } from "@/components/home/SectionRail";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Faq } from "@/components/home/Faq";
import { Cta } from "@/components/home/Cta";
import { faq } from "@/content/faq";
import { faqLd, howToLd, ldScript } from "@/lib/seo/jsonld";

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: ldScript(faqLd(faq.map((f) => ({ ...f })))),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ldScript(howToLd()) }}
      />
      <Hero />
      <SectionRail />
      <Introduction />
      <HowItWorks />
      <SetItUp />
      <Faq />
      <Cta />
    </>
  );
}
