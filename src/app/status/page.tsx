"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

interface ShardStatus {
  latency: number;
  server_count: number;
  member_count: number;
  is_ready: boolean;
  uptime: number;
}

interface ShardCardProps {
  shard: ShardStatus;
  index: number;
}

function formatUptime(milliseconds: number) {
  const seconds = Math.floor(milliseconds / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts = [];

  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);

  if (!parts.length) return "just now";

  return parts.join(" ");
}

function TotalCard({
  title,
  value,
  accent = false,
}: {
  title: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="group flex flex-col gap-2 rounded-2xl border border-border-subtle/60 bg-bg-card/60 p-5 text-left transition-all hover:border-border-hover hover:bg-bg-card/80 hover:shadow-[0_0_30px_rgba(168,85,247,0.08)]"
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        {title}
      </p>

      <p
        className={`text-2xl font-semibold tracking-tight ${
          accent ? "text-text-primary" : "text-text-primary"
        }`}
      >
        {value}
      </p>
    </motion.div>
  );
}

function ShardCard({ shard, index }: ShardCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="group flex h-full flex-col gap-4 rounded-2xl border border-border-subtle/60 bg-bg-card/60 p-5 text-left transition-all hover:border-border-hover hover:bg-bg-card/80 hover:shadow-[0_0_30px_rgba(168,85,247,0.08)]"
    >
      <div className="flex items-center justify-between gap-3">
        <code className="text-base font-semibold text-text-primary">
          Shard #{index}
        </code>

        <span className="shrink-0 rounded-full border border-border-subtle/60 bg-bg-elevated/60 px-2.5 py-1 text-[10px] font-medium text-accent">
          {shard.is_ready ? "Online" : "Offline"}
        </span>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-3">
        <div>
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Latency
          </p>
          <div className="truncate rounded-lg border border-border-subtle/60 bg-bg-card/40 px-3 py-2 font-mono text-xs text-text-secondary backdrop-blur-sm">
            {shard.latency}ms
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Servers
          </p>
          <div className="truncate rounded-lg border border-border-subtle/60 bg-bg-card/40 px-3 py-2 font-mono text-xs text-text-secondary backdrop-blur-sm">
            {shard.server_count.toLocaleString()}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Members
          </p>
          <div className="truncate rounded-lg border border-border-subtle/60 bg-bg-card/40 px-3 py-2 font-mono text-xs text-text-secondary backdrop-blur-sm">
            {shard.member_count.toLocaleString()}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Uptime
          </p>
          <div className="truncate rounded-lg border border-border-subtle/60 bg-bg-card/40 px-3 py-2 font-mono text-xs text-text-secondary backdrop-blur-sm">
            {formatUptime(shard.uptime)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
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
        Failed to load status
      </p>

      <p className="mt-1.5 text-sm text-text-muted">
        The status API could not be reached.
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

export default function StatusPage() {
  const [shards, setShards] = useState<ShardStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadStatus() {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch("/api/status", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch status");
        }

        const data: ShardStatus[] = await response.json();

        if (!cancelled && Array.isArray(data)) {
          setShards(data);
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

    loadStatus();

    return () => {
      cancelled = true;
    };
  }, []);

  const totals = useMemo(() => {
    const totalLatency = shards.reduce((sum, shard) => sum + shard.latency, 0);
    const totalServers = shards.reduce(
      (sum, shard) => sum + shard.server_count,
      0,
    );
    const totalMembers = shards.reduce(
      (sum, shard) => sum + shard.member_count,
      0,
    );
    const allReady =
      shards.length > 0 && shards.every((shard) => shard.is_ready);
    const maxUptime = shards.reduce(
      (max, shard) => Math.max(max, shard.uptime),
      0,
    );

    return {
      totalLatency,
      totalServers,
      totalMembers,
      allReady,
      maxUptime,
    };
  }, [shards]);

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
            <Activity className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
              Status
            </h1>

            <p className="mt-1.5 text-sm text-text-secondary">
              Real-time health and metrics for each shard.
            </p>
          </div>
        </motion.header>

        {loading && <LoadingSkeleton />}

        {!loading && error && (
          <ErrorState onRetry={() => window.location.reload()} />
        )}

        {!loading && !error && (
          <>
            <motion.div
              layout
              className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              <TotalCard
                title="Average Latency"
                value={`${Math.round(totals.totalLatency / shards.length)}ms`}
              />

              <TotalCard
                title="Total Servers"
                value={totals.totalServers.toLocaleString()}
              />

              <TotalCard
                title="Total Members"
                value={totals.totalMembers.toLocaleString()}
              />
            </motion.div>

            <motion.div
              layout
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {shards.map((shard, index) => (
                <ShardCard key={index} shard={shard} index={index} />
              ))}
            </motion.div>
          </>
        )}
      </div>
    </main>
  );
}
