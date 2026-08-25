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
    <div className="relative min-h-[calc(100vh-4rem)]">
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
