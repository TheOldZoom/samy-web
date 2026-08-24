import React from "react";
import { getDocsNavigation, getDocsSearchIndex } from "@/lib/docs";
import { DocsSidebar } from "@/components/docs/sidebar";
import { DocsMobileNav } from "@/components/docs/mobile-sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigation = getDocsNavigation();
  const searchIndex = getDocsSearchIndex();

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[#080412]/92 backdrop-blur-3xl border-t border-purple-500/15">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[450px] w-[900px] rounded-full bg-purple-600/10 blur-[140px]" />
        <div className="absolute right-10 top-1/3 h-[350px] w-[350px] rounded-full bg-purple-800/8 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:32px_32px] opacity-70" />
      </div>

      <DocsMobileNav sections={navigation} searchIndex={searchIndex} />

      <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          <div className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto py-6 pr-2">
              <DocsSidebar sections={navigation} searchIndex={searchIndex} />
            </div>
          </div>

          <main className="min-w-0 flex-1 py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
