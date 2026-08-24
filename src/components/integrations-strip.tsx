"use client";

import { motion } from "framer-motion";
import { FaDiscord, FaLastfm } from "react-icons/fa";

const integrations = [
  {
    icon: FaDiscord,
    name: "discord",
    description: "slash commands, embeds, and buttons.",
  },
  {
    icon: FaLastfm,
    name: "last.fm",
    description: "now playing status, album art, and scrobbling.",
  },
];

export default function IntegrationsStrip() {
  return (
    <section
      id="integrations"
      className="border-y border-border-subtle bg-bg-elevated/30 py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            integrations
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            connects to the platforms your community already uses.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {integrations.map((integration, i) => (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group rounded-2xl border border-border-subtle bg-bg-card/60 p-6 transition-all hover:border-border-hover"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <integration.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-text-primary capitalize">
                    {integration.name}
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary">
                    {integration.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
