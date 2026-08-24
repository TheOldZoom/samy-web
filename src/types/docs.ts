export interface DocFrontmatter {
  title: string;
  description?: string;
  order?: number;
  section?: string;
}

export interface TocItem {
  id: string;
  title: string;
  level: number;
}

export interface DocItem {
  slug: string[];
  slugPath: string; // e.g. "commands/moderation"
  href: string; // e.g. "/docs/commands/moderation"
  frontmatter: DocFrontmatter;
  content: string;
  toc: TocItem[];
}

export interface NavLink {
  title: string;
  href: string;
  order: number;
}

export interface NavSection {
  title: string;
  order: number;
  items: NavLink[];
}

export interface SearchDocItem {
  title: string;
  description: string;
  href: string;
  section: string;
  headings: string[];
}
