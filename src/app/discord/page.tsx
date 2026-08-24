import Link from "next/link";
import { ArrowLeft, ArrowUpRight, MessageCircle } from "lucide-react";

interface DiscordMember {
  id: string;
  username: string;
  avatar_url: string;
  status: string;
}

interface DiscordWidget {
  id: string;
  name: string;
  instant_invite: string;
  presence_count: number;
  members: DiscordMember[];
}

async function getDiscordServer(): Promise<DiscordWidget | null> {
  try {
    const response = await fetch(
      "https://canary.discord.com/api/guilds/1292257240299999355/widget.json",
      {
        next: {
          revalidate: 60,
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}

export default async function DiscordPage() {
  const server = await getDiscordServer();

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[550px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]" />
      </div>

      <div className="mx-auto w-full max-w-2xl px-6 py-24 text-center">
        <div className="text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            come hang out with <span className="text-accent">Samy.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-text-secondary sm:text-lg">
            Get support, report bugs, suggest features, or just hang out with
            the people using Samy.
          </p>
        </div>

        {server && server.members.length > 0 && (
          <div className="mx-auto mt-10 max-w-md rounded-2xl border border-border-subtle bg-bg-card/70 p-4 text-left backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium text-text-muted">
                members online
              </span>

              <span className="text-xs text-text-muted">
                {server.presence_count.toLocaleString()} online
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {server.members.slice(0, 12).map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-2 rounded-xl border border-border-subtle bg-bg-elevated/40 px-2.5 py-2"
                >
                  <img
                    src={member.avatar_url}
                    alt={member.username}
                    title={member.username}
                    className="h-7 w-7 rounded-full object-cover"
                  />

                  <span className="max-w-32 truncate text-xs font-medium text-text-primary">
                    {member.username}
                  </span>
                </div>
              ))}

              {server.members.length > 12 && (
                <div className="flex items-center rounded-xl border border-border-subtle bg-bg-elevated/40 px-2.5 py-2 text-xs text-text-muted">
                  +{server.members.length - 12} more online
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={server?.instant_invite ?? "https://discord.gg/SBx3mn4r8e"}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_rgba(168,85,247,0.25)] transition-all hover:bg-primary/90 hover:shadow-[0_0_45px_rgba(168,85,247,0.4)]"
          >
            <MessageCircle className="h-4 w-4" />
            join discord
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border-hover bg-bg-card/50 px-7 py-3.5 text-sm font-medium text-text-primary transition-all hover:bg-bg-elevated"
          >
            <ArrowLeft className="h-4 w-4" />
            back home
          </Link>
        </div>
      </div>
    </div>
  );
}
