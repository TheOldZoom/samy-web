import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import { getAllDocs, getDocBySlug, getDocPager } from "@/lib/docs";
import { mdxComponents } from "@/components/docs/mdx-components";
import { TableOfContents } from "@/components/docs/toc";
import { Breadcrumbs } from "@/components/docs/breadcrumbs";
import { DocPager } from "@/components/docs/pager";

interface DocPageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export async function generateStaticParams() {
  const docs = getAllDocs();
  const params: { slug?: string[] }[] = [{ slug: [] }];

  for (const doc of docs) {
    if (doc.slug.length > 0) {
      params.push({ slug: doc.slug });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: DocPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const doc = getDocBySlug(resolvedParams.slug || []);

  if (!doc) {
    return {
      title: "Page Not Found - Samy Docs",
    };
  }

  return {
    title: `${doc.frontmatter.title} – Samy Docs`,
    description:
      doc.frontmatter.description ||
      `Documentation for ${doc.frontmatter.title} on Samy.`,
    openGraph: {
      title: `${doc.frontmatter.title} – Samy Docs`,
      description:
        doc.frontmatter.description ||
        `Documentation for ${doc.frontmatter.title} on Samy.`,
      type: "article",
    },
  };
}

export default async function DocPage({ params }: DocPageProps) {
  const resolvedParams = await params;
  const doc = getDocBySlug(resolvedParams.slug || []);

  if (!doc) {
    notFound();
  }

  const { prev, next } = getDocPager(doc.href);

  const breadcrumbItems = [];
  if (doc.frontmatter.section && doc.frontmatter.section !== "Overview") {
    breadcrumbItems.push({ label: doc.frontmatter.section });
  }
  breadcrumbItems.push({ label: doc.frontmatter.title, href: doc.href });

  return (
    <div className="flex gap-8">
      <article className="min-w-0 max-w-4xl flex-1">
        <div className="relative rounded-2xl border border-purple-500/15 bg-[#0e081c]/95 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbItems} />
          </div>

          <header className="pb-6 border-b border-purple-500/15">
            <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-zinc-50">
              {doc.frontmatter.title}
            </h1>
            {doc.frontmatter.description && (
              <p className="mt-3 text-base sm:text-lg leading-relaxed text-zinc-300">
                {doc.frontmatter.description}
              </p>
            )}
          </header>

          <div className="prose prose-invert max-w-none pt-6 prose-headings:font-heading prose-headings:tracking-tight prose-a:text-purple-300 prose-code:text-purple-200">
            <MDXRemote
              source={doc.content}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  rehypePlugins: [
                    rehypeSlug,
                    [
                      rehypePrettyCode,
                      {
                        theme: "github-dark",
                        keepBackground: false,
                      },
                    ],
                  ],
                },
              }}
            />
          </div>

          <DocPager prev={prev} next={next} />
        </div>
      </article>

      <aside className="hidden xl:block w-64 shrink-0">
        <div className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto pl-1">
          <TableOfContents toc={doc.toc} />
        </div>
      </aside>
    </div>
  );
}
