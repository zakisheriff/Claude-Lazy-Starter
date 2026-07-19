import type { Metadata } from "next";
import { store } from "@/lib/store/file-store";
import { breadcrumbLd, ldScript } from "@/lib/seo/jsonld";
import { SettingsClient } from "@/components/settings/SettingsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Settings",
  description:
    "Configure automatic activation, the activation message and model, your window length, and your working and sleep hours.",
  alternates: { canonical: "/settings" },
};

export default async function SettingsPage() {
  const state = await store.read();

  return (
    <section className="min-h-screen pt-28 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: ldScript(
            breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "Settings", path: "/settings" },
            ]),
          ),
        }}
      />
      <div className="mx-auto mb-10 w-full max-w-4xl px-6 lg:px-8">
        <h1 className="text-4xl font-semibold tracking-tight text-ink md:text-5xl">
          Settings
        </h1>
        <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-ink-soft">
          Tell Lazy Starter how you work and how you want windows opened.
          Changes are saved to your own local store.
        </p>
      </div>
      <SettingsClient initial={state.settings} />
    </section>
  );
}
