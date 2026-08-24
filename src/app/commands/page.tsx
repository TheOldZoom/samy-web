"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  ChevronDown,
  Terminal,
  Copy,
  Check,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface CommandArgument {
  name: string;
  aliases?: string[];
  type: "string" | "integer" | "user" | "channel" | "role" | "boolean";
  description: string;
  required?: boolean;
  default?: string | number | boolean;
}

export interface CommandSubcommand {
  name: string;
  aliases?: string[];
  description: string;
  arguments: CommandArgument[];
  examples?: string[];
}

export interface Command {
  name: string;
  aliases: string[];
  description: string;
  category: string;
  arguments: CommandArgument[];
  examples: string[];
  cooldown: number | null;
  guildOnly: boolean;
  ownerOnly: boolean;
  userPermissions: string[];
  botPermissions: string[];
  hasExecute: boolean;
  subcommands: CommandSubcommand[];
}

interface CommandsResponse {
  commands: Command[];
  categories?: Record<string, Command[]>;
}

function formatType(type: CommandArgument["type"]) {
  return type.toUpperCase();
}

function formatCooldown(cooldown: number | null) {
  if (!cooldown) return null;

  if (cooldown < 1000) {
    return `${cooldown}ms`;
  }

  const seconds = cooldown / 1000;

  if (seconds < 60) {
    return `${seconds}s`;
  }

  return `${Math.round(seconds / 60)}m`;
}

function normalizeArgument(arg: Partial<CommandArgument>): CommandArgument {
  return {
    name: arg.name ?? "",
    aliases: arg.aliases ?? [],
    type: arg.type ?? "string",
    description: arg.description ?? "",
    required: arg.required ?? false,
    default: arg.default,
  };
}

function normalizeSubcommand(
  sub: Partial<CommandSubcommand>,
): CommandSubcommand {
  return {
    name: sub.name ?? "",
    aliases: sub.aliases ?? [],
    description: sub.description ?? "",
    arguments: (sub.arguments ?? []).map(normalizeArgument),
    examples: sub.examples ?? [],
  };
}

function normalizeCommand(command: Partial<Command>): Command {
  return {
    name: command.name ?? "unknown",
    aliases: command.aliases ?? [],
    description: command.description ?? "No description provided.",
    category: command.category ?? "Utility",
    arguments: (command.arguments ?? []).map(normalizeArgument),
    examples: command.examples ?? [],
    cooldown: command.cooldown ?? null,
    guildOnly: command.guildOnly ?? false,
    ownerOnly: command.ownerOnly ?? false,
    userPermissions: command.userPermissions ?? [],
    botPermissions: command.botPermissions ?? [],
    hasExecute: command.hasExecute ?? true,
    subcommands: (command.subcommands ?? []).map(normalizeSubcommand),
  };
}

interface FlatCommand {
  id: string;
  segments: string[];
  description: string;
  category: string;
  arguments: CommandArgument[];
  examples: string[];
  aliases: string[];
  cooldown: number | null;
  guildOnly: boolean;
  ownerOnly: boolean;
  userPermissions: string[];
  botPermissions: string[];
}

function flattenCommand(command: Command): FlatCommand[] {
  const entries: FlatCommand[] = [];

  if (command.hasExecute || command.subcommands.length === 0) {
    entries.push({
      id: command.name,
      segments: [command.name],
      description: command.description,
      category: command.category,
      arguments: command.arguments,
      examples: command.examples,
      aliases: command.aliases,
      cooldown: command.cooldown,
      guildOnly: command.guildOnly,
      ownerOnly: command.ownerOnly,
      userPermissions: command.userPermissions,
      botPermissions: command.botPermissions,
    });
  }

  for (const sub of command.subcommands) {
    entries.push({
      id: `${command.name}-${sub.name}`,
      segments: [command.name, sub.name],
      description: sub.description,
      category: command.category,
      arguments: sub.arguments,
      examples: sub.examples ?? [],
      aliases: sub.aliases ?? [],
      cooldown: command.cooldown,
      guildOnly: command.guildOnly,
      ownerOnly: command.ownerOnly,
      userPermissions: command.userPermissions,
      botPermissions: command.botPermissions,
    });
  }

  return entries;
}

const PAGE_SIZE = 60;

function MetaBox({
  label,
  value,
  full = false,
}: {
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        {label}
      </p>

      <div className="truncate rounded-lg border border-border-subtle/60 bg-bg-card/40 px-3 py-2 font-mono text-xs text-text-secondary backdrop-blur-sm">
        {value}
      </div>
    </div>
  );
}

function CodeLine({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(code);

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1200);
  }

  return (
    <div className="group/code flex items-center justify-between gap-3 rounded-xl border border-border-subtle/60 bg-bg-card/40 px-4 py-3 backdrop-blur-sm transition-colors hover:border-border-subtle hover:bg-bg-card/60">
      <code className="overflow-x-auto whitespace-pre text-xs text-accent">
        {code}
      </code>

      <button
        onClick={copy}
        aria-label="Copy example"
        className="shrink-0 text-text-muted opacity-0 transition-all hover:text-text-primary group-hover/code:opacity-100"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-emerald-400" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}

function ArgumentTable({ arguments: args }: { arguments: CommandArgument[] }) {
  if (!args.length) return null;

  return (
    <div>
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        Arguments
      </p>

      <div className="space-y-3">
        {args.map((arg) => (
          <div
            key={arg.name}
            className="group rounded-xl border border-border-subtle/60 bg-bg-card/30 px-4 py-3.5 transition-colors hover:border-border-subtle hover:bg-bg-card/50"
          >
            <div className="flex items-center gap-2.5">
              <code className="text-sm font-semibold text-text-primary">
                {arg.name}
              </code>

              <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">
                {formatType(arg.type)}
              </span>

              {arg.required && (
                <span className="text-[10px] font-medium uppercase tracking-wider text-red-400">
                  required
                </span>
              )}

              {arg.aliases?.map((alias) => (
                <span key={alias} className="text-[10px] text-text-muted">
                  --{alias}
                </span>
              ))}
            </div>

            <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
              {arg.description}
            </p>

            {arg.default !== undefined && (
              <p className="mt-1.5 text-xs text-text-muted">
                default{" "}
                <code className="rounded bg-bg-elevated/60 px-1.5 py-0.5 font-mono text-xs text-text-secondary">
                  {String(arg.default)}
                </code>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PermissionGroup({
  label,
  permissions,
  tone,
}: {
  label: string;
  permissions: string[];
  tone: "user" | "bot";
}) {
  if (!permissions.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        {label}
      </span>

      {permissions.map((permission) => (
        <span
          key={`${tone}-${permission}`}
          className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium backdrop-blur-sm ${
            tone === "bot"
              ? "border-accent/20 bg-accent/5 text-accent"
              : "border-border-subtle/60 bg-bg-card/40 text-text-secondary"
          }`}
        >
          {permission}
        </span>
      ))}
    </div>
  );
}

function CommandCard({
  entry,
  onOpen,
}: {
  entry: FlatCommand;
  onOpen: () => void;
}) {
  const permissions = [...entry.userPermissions, ...entry.botPermissions];

  const permissionsValue = permissions.length ? permissions.join(", ") : "N/A";

  const argumentsValue = entry.arguments.length
    ? entry.arguments.map((arg) => arg.name).join(", ")
    : "N/A";

  return (
    <motion.button
      onClick={onOpen}
      whileHover={{ y: -2 }}
      className="group flex h-full flex-col gap-4 rounded-2xl border border-border-subtle/60 bg-bg-card/60 p-5 text-left transition-all hover:border-border-hover hover:bg-bg-card/80 hover:shadow-[0_0_30px_rgba(168,85,247,0.08)]"
    >
      <div className="flex items-start justify-between gap-3">
        <code className="text-base font-semibold text-text-primary">
          ,{entry.segments.join(" ")}
        </code>

        <span className="shrink-0 rounded-full border border-border-subtle/60 bg-bg-elevated/60 px-2.5 py-1 text-[10px] font-medium text-accent">
          {entry.category}
        </span>
      </div>

      <p className="line-clamp-2 text-sm leading-relaxed text-text-secondary">
        {entry.description}
      </p>

      <div className="mt-auto space-y-3 pt-1">
        <div className="grid grid-cols-2 gap-3">
          <MetaBox label="Permissions" value={permissionsValue} />

          {entry.aliases.length > 0 && (
            <MetaBox label="Aliases" value={entry.aliases.join(", ")} />
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <MetaBox label="Arguments" value={argumentsValue} full />
        </div>
      </div>
    </motion.button>
  );
}

function CommandModal({
  entry,
  onClose,
}: {
  entry: FlatCommand;
  onClose: () => void;
}) {
  const cooldown = formatCooldown(entry.cooldown);

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-h-[85vh] overflow-y-auto border-border-subtle/60 bg-bg-elevated/90 backdrop-blur-2xl p-0 sm:max-w-2xl">
        <DialogHeader className="border-b border-border-subtle/60 px-6 py-5">
          <div className="flex flex-wrap items-center gap-3">
            <DialogTitle className="font-mono text-xl font-semibold text-text-primary">
              ,{entry.segments.join(" ")}
            </DialogTitle>

            <span className="rounded-full border border-border-subtle/60 bg-bg-card/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent">
              {entry.category}
            </span>
          </div>
        </DialogHeader>

        <div className="px-6 py-6">
          <p className="text-sm leading-relaxed text-text-secondary">
            {entry.description}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {entry.aliases.length > 0 && (
              <span className="rounded-lg border border-border-subtle/60 bg-bg-card/40 px-2.5 py-1.5 text-xs font-medium text-text-secondary backdrop-blur-sm">
                {entry.aliases.map((alias) => `/${alias}`).join(", ")}
              </span>
            )}

            {cooldown && (
              <span className="rounded-lg border border-border-subtle/60 bg-bg-card/40 px-2.5 py-1.5 text-xs font-medium text-text-secondary backdrop-blur-sm">
                {cooldown}
              </span>
            )}

            <span className="rounded-lg border border-border-subtle/60 bg-bg-card/40 px-2.5 py-1.5 text-xs font-medium text-text-secondary backdrop-blur-sm">
              {entry.guildOnly ? "server only" : "anywhere"}
            </span>

            {entry.ownerOnly && (
              <span className="rounded-lg border border-accent/20 bg-accent/5 px-2.5 py-1.5 text-xs font-semibold text-accent backdrop-blur-sm">
                owner only
              </span>
            )}
          </div>

          <div className="mt-8 space-y-8">
            <ArgumentTable arguments={entry.arguments} />

            {(entry.userPermissions.length > 0 ||
              entry.botPermissions.length > 0) && (
              <div className="space-y-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Permissions
                </p>

                <PermissionGroup
                  label="you need"
                  permissions={entry.userPermissions}
                  tone="user"
                />

                <PermissionGroup
                  label="samy needs"
                  permissions={entry.botPermissions}
                  tone="bot"
                />
              </div>
            )}

            {entry.examples.length > 0 && (
              <div>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Examples
                </p>

                <div className="space-y-2">
                  {entry.examples.map((example, index) => (
                    <CodeLine key={`${example}-${index}`} code={example} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CategorySelect({
  activeCategory,
  categories,
  totalCount,
  onChange,
}: {
  activeCategory: string;
  categories: [string, number][];
  totalCount: number;
  onChange: (category: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onClickOutside);

    return () => {
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen((value) => !value)}
        className="flex h-11 items-center gap-2 rounded-xl border border-border-subtle/60 bg-bg-card/60 px-4 text-sm text-text-primary transition-colors hover:border-border-hover backdrop-blur-sm"
      >
        <Terminal className="h-3.5 w-3.5 text-accent" />

        {activeCategory === "All" ? "All Commands" : activeCategory}

        <ChevronDown
          className={`h-3.5 w-3.5 text-text-muted transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-border-subtle/60 bg-bg-elevated/90 backdrop-blur-xl shadow-xl">
          <button
            onClick={() => {
              onChange("All");
              setOpen(false);
            }}
            className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
              activeCategory === "All"
                ? "bg-bg-elevated text-text-primary"
                : "text-text-secondary hover:bg-bg-elevated/60"
            }`}
          >
            All Commands
            <span className="text-xs text-text-muted">{totalCount}</span>
          </button>

          {categories.map(([category, count]) => (
            <button
              key={category}
              onClick={() => {
                onChange(category);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                activeCategory === category
                  ? "bg-bg-elevated text-text-primary"
                  : "text-text-secondary hover:bg-bg-elevated/60"
              }`}
            >
              {category}

              <span className="text-xs text-text-muted">{count}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, index) => (
        <div
          key={index}
          className="h-48 animate-pulse rounded-2xl border border-border-subtle/40 bg-bg-card/30"
        />
      ))}
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border-subtle/60 bg-bg-card/40 p-8 text-center backdrop-blur-xl">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[200px] w-[200px] rounded-full bg-red-500/10 blur-[80px]" />
      </div>

      <p className="text-sm font-semibold text-text-primary">
        Failed to load commands
      </p>

      <p className="mt-1.5 text-sm text-text-muted">
        The command API could not be reached.
      </p>

      <button
        onClick={onRetry}
        className="mt-5 rounded-lg border border-border-subtle/60 bg-bg-elevated/60 px-4 py-2 text-xs font-medium text-text-primary transition-colors hover:border-border-hover backdrop-blur-sm"
      >
        Try again
      </button>
    </div>
  );
}

function EmptyState({
  search,
  activeCategory,
  onClear,
}: {
  search: string;
  activeCategory: string;
  onClear: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border-subtle/60 py-20 text-center">
      <Search className="mx-auto h-8 w-8 text-text-muted" />

      <h2 className="mt-4 text-sm font-medium text-text-primary">
        No commands found
      </h2>

      <p className="mt-1 text-sm text-text-muted">
        Try another search or category.
      </p>

      {(search || activeCategory !== "All") && (
        <button
          onClick={onClear}
          className="mt-5 text-xs font-medium text-accent hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPrev,
  onNext,
}: {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-10 flex items-center justify-center gap-3">
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className="rounded-lg border border-border-subtle/60 bg-bg-card/60 px-3.5 py-2 text-xs font-medium text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary disabled:opacity-40 disabled:hover:border-border-subtle/60 backdrop-blur-sm"
      >
        Previous
      </button>

      <span className="text-xs text-text-muted font-medium">
        page {currentPage} of {totalPages}
      </span>

      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="rounded-lg border border-border-subtle/60 bg-bg-card/60 px-3.5 py-2 text-xs font-medium text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary disabled:opacity-40 disabled:hover:border-border-subtle/60 backdrop-blur-sm"
      >
        Next
      </button>
    </div>
  );
}

export default function CommandsPage() {
  const [entries, setEntries] = useState<FlatCommand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [selectedEntry, setSelectedEntry] = useState<FlatCommand | null>(null);

  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCommands() {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch("/api/commands", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch commands");
        }

        const data: CommandsResponse = await response.json();

        if (!cancelled) {
          const raw = Array.isArray(data.commands) ? data.commands : [];

          setEntries(raw.map(normalizeCommand).flatMap(flattenCommand));
        }
      } catch {
        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCommands();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function onKeydown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;

      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }

    window.addEventListener("keydown", onKeydown);

    return () => {
      window.removeEventListener("keydown", onKeydown);
    };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, activeCategory]);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();

    for (const entry of entries) {
      counts.set(entry.category, (counts.get(entry.category) ?? 0) + 1);
    }

    return Array.from(counts.entries()).sort((a, b) =>
      a[0].localeCompare(b[0]),
    );
  }, [entries]);

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = entries.filter((entry) => {
      if (activeCategory !== "All" && entry.category !== activeCategory) {
        return false;
      }

      if (!query) {
        return true;
      }

      const searchable = [
        entry.segments.join(" "),
        entry.category,
        entry.description,
        ...entry.aliases,
        ...entry.examples,
        ...entry.arguments.map((arg) => arg.name),
        ...entry.arguments.flatMap((arg) => arg.aliases ?? []),
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });

    return filtered.sort((a, b) =>
      a.segments.join(" ").localeCompare(b.segments.join(" "), undefined, {
        numeric: true,
        sensitivity: "base",
      }),
    );
  }, [entries, search, activeCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / PAGE_SIZE));

  const currentPage = Math.min(page, totalPages);

  const pageStart = (currentPage - 1) * PAGE_SIZE;

  const pagedEntries = filteredEntries.slice(pageStart, pageStart + PAGE_SIZE);

  const rangeStart = filteredEntries.length === 0 ? 0 : pageStart + 1;

  const rangeEnd = Math.min(pageStart + PAGE_SIZE, filteredEntries.length);

  return (
    <main className="relative min-h-[calc(100vh-4rem)]">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-accent/10 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex items-start gap-4"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border-subtle/60 bg-bg-card/40 text-accent backdrop-blur-sm">
            <Terminal className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
              Commands
            </h1>

            <p className="mt-1.5 text-sm text-text-secondary">
              Explore all available commands and their usage.
            </p>
          </div>
        </motion.header>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />

            <input
              ref={searchRef}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search commands..."
              className="h-11 w-full rounded-xl border border-border-subtle/60 bg-bg-elevated/40 pl-10 pr-9 text-sm text-text-primary outline-none placeholder:text-text-muted/70 focus:border-accent/40 backdrop-blur-sm"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-text-muted hover:text-text-primary"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <CategorySelect
            activeCategory={activeCategory}
            categories={categories}
            totalCount={entries.length}
            onChange={setActiveCategory}
          />
        </div>

        {!loading && !error && (
          <p className="mb-6 text-xs font-medium uppercase tracking-wider text-text-muted">
            Showing {rangeStart}-{rangeEnd} of {filteredEntries.length} commands
          </p>
        )}

        {loading && <LoadingSkeleton />}

        {!loading && error && (
          <ErrorState onRetry={() => window.location.reload()} />
        )}

        {!loading && !error && (
          <>
            {filteredEntries.length === 0 ? (
              <EmptyState
                search={search}
                activeCategory={activeCategory}
                onClear={() => {
                  setSearch("");
                  setActiveCategory("All");
                }}
              />
            ) : (
              <>
                <motion.div
                  layout
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                  <AnimatePresence mode="popLayout">
                    {pagedEntries.map((entry) => (
                      <CommandCard
                        key={entry.id}
                        entry={entry}
                        onOpen={() => setSelectedEntry(entry)}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPrev={() => setPage((p) => Math.max(1, p - 1))}
                  onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
                />
              </>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {selectedEntry && (
          <CommandModal
            entry={selectedEntry}
            onClose={() => setSelectedEntry(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
