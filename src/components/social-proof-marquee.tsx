"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Server {
  id: string;
  name: string;
  icon: string | null;
  memberCount: number;
}

interface ServerResponse {
  servers: Server[];
  totalServers: number;
  totalMembers: number;
  userInstallCount: number;
}

function formatCount(count: number | undefined | null) {
  if (typeof count !== "number" || !Number.isFinite(count)) {
    return "—";
  }

  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}M`;
  }

  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1)}K`;
  }

  return count.toLocaleString();
}

const skeletons = Array.from({ length: 8 });

export default function SocialProofMarquee() {
  const [data, setData] = useState<ServerResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/servers")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch servers");
        }

        return res.json();
      })
      .then((data: ServerResponse) => {
        setData(data);
      })
      .catch(() => {
        setData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const servers = data?.servers ?? [];

  return (
    <section className="overflow-hidden border-y border-border-subtle py-10">
      <p className="mb-7 text-center text-sm text-text-muted">
        trusted by{" "}
        <span className="font-medium text-text-primary">
          {formatCount(data?.totalMembers)}
        </span>{" "}
        users across{" "}
        <span className="font-medium text-text-primary">
          {formatCount(data?.totalServers)}
        </span>{" "}
        communities and{" "}
        <span className="font-medium text-text-primary">
          {formatCount(data?.userInstallCount)}
        </span>{" "}
        app users
      </p>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-bg to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-bg to-transparent" />

        {loading ? (
          <div className="flex w-max gap-3">
            {skeletons.map((_, i) => (
              <div
                key={i}
                className="flex h-14 w-52 shrink-0 animate-pulse items-center gap-3 rounded-xl border border-border-subtle bg-bg-card px-3.5"
              >
                <div className="h-9 w-9 shrink-0 rounded-lg bg-bg-elevated" />

                <div className="flex flex-col gap-2">
                  <div className="h-3 w-24 rounded bg-bg-elevated" />
                  <div className="h-2.5 w-16 rounded bg-bg-elevated" />
                </div>
              </div>
            ))}
          </div>
        ) : servers.length > 0 ? (
          <motion.div
            className="flex w-max"
            animate={{
              x: ["0%", "-50%"],
            }}
            transition={{
              duration: Math.max(servers.length * 3, 25),
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[...servers, ...servers].map((server, i) => (
              <div
                key={`${server.id}-${i}`}
                className="mr-3 flex h-14 shrink-0 items-center gap-3 rounded-xl border border-border-subtle bg-bg-card px-3.5 pr-5"
              >
                <div className="relative">
                  {server.icon ? (
                    <img
                      src={server.icon}
                      alt=""
                      className="h-9 w-9 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-sm font-semibold text-accent">
                      {server.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-bg-card bg-green-500" />
                </div>

                <div className="min-w-0 leading-tight">
                  <p className="max-w-40 truncate text-sm font-medium text-text-primary">
                    {server.name}
                  </p>

                  <p className="mt-0.5 text-xs text-text-muted">
                    {formatCount(server.memberCount)} members
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <div className="flex justify-center">
            <p className="text-sm text-text-muted">
              Unable to load communities.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
