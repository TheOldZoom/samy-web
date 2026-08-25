import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import privacy from "@/content/legal/privacy.json";

type PrivacySection = {
  title: string;
  body: string;
  list?: string[];
};

type PrivacyDoc = {
  lastUpdated: string;
  intro: string;
  sections: PrivacySection[];
};

export default function PrivacyPage() {
  const doc = privacy as PrivacyDoc;

  return (
    <main className="relative min-h-[calc(100vh-4rem)]">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-10 flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border-subtle/60 bg-bg-card/40 text-accent backdrop-blur-sm">
            <ShieldCheck className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
              Privacy Policy
            </h1>

            <p className="mt-1.5 text-sm text-text-secondary">
              Last updated: {doc.lastUpdated}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border-subtle/60 bg-bg-card/60 p-6 text-left backdrop-blur-xl sm:p-8">
          <div className="prose prose-invert max-w-none space-y-6 text-sm leading-7 text-text-secondary">
            <p>{doc.intro}</p>

            {doc.sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-base font-semibold tracking-tight text-text-primary">
                  {section.title}
                </h2>
                <p>{section.body}</p>

                {section.list && section.list.length > 0 && (
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 text-text-secondary">
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border-hover bg-bg-card/50 px-6 py-3 text-sm font-medium text-text-primary transition-all hover:bg-bg-elevated"
          >
            <ArrowLeft className="h-4 w-4" />
            back home
          </Link>
        </div>
      </div>
    </main>
  );
}
