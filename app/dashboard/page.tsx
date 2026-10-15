import type { Metadata } from "next";
import { getSnapshot } from "@/lib/domain/snapshot";
import { breadcrumbLd, ldScript } from "@/lib/seo/jsonld";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "See your current Claude window status, activation state, next refresh, estimated time remaining, activation history, and your working and sleep schedule.",
  alternates: { canonical: "/dashboard" },
};

export default async function DashboardPage() {
  const snapshot = await getSnapshot();

  return (
    <section className="min-h-screen bg-paper pt-36 pb-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: ldScript(
            breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "Dashboard", path: "/dashboard" },
            ]),
          ),
        }}
      />
      <div className="mx-auto mb-10 w-full max-w-6xl px-6 lg:px-8">
        <h1 className="font-serif text-[40px] leading-tight font-normal tracking-[-0.02em] text-ink md:text-[52px]">
          Dashboard
        </h1>
        <p className="mt-4 max-w-2xl font-serif text-[19px] leading-relaxed text-ink-soft">
          A live view of your usage window and everything the automation is doing
          on your behalf.
        </p>
      </div>
      <DashboardClient initial={snapshot} />
    </section>
  );
}
