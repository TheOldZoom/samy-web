"use client";

import {
  Music2,
  Shield,
  Zap,
  BarChart3,
  MessageSquare,
  Users,
  ShieldCheck,
  Settings2,
  MessageSquareText,
  UserRound,
  Sparkles,
  Languages,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features1 = [
  {
    icon: ShieldCheck,
    title: "moderation",
    description: "ban, kick, timeout, purge messages, and manage your server.",
  },
  {
    icon: Settings2,
    title: "server management",
    description: "set up welcome and leave messages for your server.",
  },
  {
    icon: MessageSquareText,
    title: "message builder",
    description: "create messages, embeds, and Components V2 with ease.",
  },
];

const features2 = [
  {
    icon: UserRound,
    title: "user utilities",
    description: "view profiles, avatars, banners, birthdays, and timezones.",
  },
  {
    icon: Sparkles,
    title: "server utilities",
    description:
      "view server, channel, role, emoji, invite, and bot information.",
  },
  {
    icon: Languages,
    title: "personal settings",
    description: "set your language, timezone, birthday, and Last.fm account.",
  },
];

function FeatureTile({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <Card className="group h-full border-border-subtle bg-bg-card/80 transition-all hover:border-border-hover hover:shadow-[0_0_30px_rgba(168,85,247,0.08)]">
      <CardContent className="p-6">
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-semibold text-text-primary">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

export default function FeatureGrid() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            everything your server needs
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            15+ modules, all in one bot.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features1.map((f) => (
            <FeatureTile key={f.title} {...f} />
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features2.map((f) => (
            <FeatureTile key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
