import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type {
  DocFrontmatter,
  DocItem,
  NavSection,
  SearchDocItem,
  TocItem,
} from "@/types/docs";

const DOCS_DIRECTORY = path.join(process.cwd(), "src", "content", "docs");

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function extractToc(rawContent: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(rawContent)) !== null) {
    const level = match[1].length;
    let title = match[2].trim();

    title = title
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
    const id = slugify(title);

    items.push({
      id,
      title,
      level,
    });
  }

  return items;
}

function getMdxFiles(dir: string, baseDir = dir): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getMdxFiles(fullPath, baseDir));
    } else if (
      entry.isFile() &&
      (entry.name.endsWith(".mdx") || entry.name.endsWith(".md"))
    ) {
      files.push(path.relative(baseDir, fullPath));
    }
  }

  return files;
}

function formatSectionTitle(raw: string): string {
  if (!raw || raw === "root") return "Overview";
  return raw
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getAllDocs(): DocItem[] {
  const relativeFiles = getMdxFiles(DOCS_DIRECTORY);

  const docs: DocItem[] = relativeFiles.map((relPath) => {
    const fullPath = path.join(DOCS_DIRECTORY, relPath);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    const normalized = relPath.replace(/\.(mdx|md)$/, "");
    const parts = normalized.split(path.sep);

    const slugParts = parts.filter((p) => p !== "index");
    const slugPath = slugParts.join("/");
    const href = slugPath.length > 0 ? `/docs/${slugPath}` : "/docs";

    const section =
      data.section ||
      (parts.length > 1 ? formatSectionTitle(parts[0]) : "Overview");

    const frontmatter: DocFrontmatter = {
      title: data.title || formatSectionTitle(parts[parts.length - 1]),
      description: data.description || "",
      order: typeof data.order === "number" ? data.order : 99,
      section,
    };

    const toc = extractToc(content);

    return {
      slug: slugParts,
      slugPath,
      href,
      frontmatter,
      content,
      toc,
    };
  });

  return docs.sort((a, b) => {
    const orderA = a.frontmatter.order ?? 99;
    const orderB = b.frontmatter.order ?? 99;
    if (orderA !== orderB) return orderA - orderB;
    return a.frontmatter.title.localeCompare(b.frontmatter.title);
  });
}

export function getDocBySlug(slug: string[] = []): DocItem | null {
  const allDocs = getAllDocs();
  const targetPath = slug.join("/");

  if (targetPath === "" || targetPath === "introduction") {
    const rootDoc =
      allDocs.find(
        (doc) => doc.slugPath === "" || doc.slugPath === "introduction",
      ) || allDocs[0];
    return rootDoc || null;
  }

  return allDocs.find((doc) => doc.slugPath === targetPath) || null;
}

export function getDocsNavigation(): NavSection[] {
  const allDocs = getAllDocs();
  const sectionMap = new Map<string, { order: number; items: DocItem[] }>();

  const sectionPriority: Record<string, number> = {
    Overview: 1,
    "Getting Started": 2,
    Commands: 3,
    Configuration: 4,
    Guides: 5,
    API: 6,
  };

  for (const doc of allDocs) {
    const sectionName = doc.frontmatter.section || "Overview";
    const existing = sectionMap.get(sectionName);
    if (!existing) {
      sectionMap.set(sectionName, {
        order: sectionPriority[sectionName] ?? 99,
        items: [doc],
      });
    } else {
      existing.items.push(doc);
    }
  }

  const sections: NavSection[] = [];

  for (const [sectionTitle, { order, items }] of sectionMap.entries()) {
    items.sort((a, b) => {
      const ordA = a.frontmatter.order ?? 99;
      const ordB = b.frontmatter.order ?? 99;
      if (ordA !== ordB) return ordA - ordB;
      return a.frontmatter.title.localeCompare(b.frontmatter.title);
    });

    sections.push({
      title: sectionTitle,
      order,
      items: items.map((doc) => ({
        title: doc.frontmatter.title,
        href: doc.href,
        order: doc.frontmatter.order ?? 99,
      })),
    });
  }

  return sections.sort((a, b) => a.order - b.order);
}

export function getDocPager(currentHref: string): {
  prev: { title: string; href: string } | null;
  next: { title: string; href: string } | null;
} {
  const allDocs = getAllDocs();
  const currentIndex = allDocs.findIndex(
    (doc) =>
      doc.href === currentHref ||
      (currentHref === "/docs" &&
        (doc.slugPath === "" || doc.slugPath === "introduction")),
  );

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  const prevDoc = currentIndex > 0 ? allDocs[currentIndex - 1] : null;
  const nextDoc =
    currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null;

  return {
    prev: prevDoc
      ? { title: prevDoc.frontmatter.title, href: prevDoc.href }
      : null,
    next: nextDoc
      ? { title: nextDoc.frontmatter.title, href: nextDoc.href }
      : null,
  };
}

export function getDocsSearchIndex(): SearchDocItem[] {
  const allDocs = getAllDocs();
  return allDocs.map((doc) => ({
    title: doc.frontmatter.title,
    description: doc.frontmatter.description || "",
    href: doc.href,
    section: doc.frontmatter.section || "Overview",
    headings: doc.toc.map((t) => t.title),
  }));
}
