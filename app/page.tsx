import { Hero } from "@/components/home/Hero";
import { Problem } from "@/components/home/Problem";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Faq } from "@/components/home/Faq";
import { Cta } from "@/components/home/Cta";
import { faq } from "@/content/faq";
import { faqLd, ldScript } from "@/lib/seo/jsonld";

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: ldScript(faqLd(faq.map((f) => ({ ...f })))),
        }}
      />
      <Hero />
      <Problem />
      <HowItWorks />
      <Faq />
      <Cta />
    </>
  );
}
