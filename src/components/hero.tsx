"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 lg:pt-40 lg:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            <span className="text-accent">Samy</span> is Discord's best{" "}
            <span className="text-accent">open-source</span> all-in-one app
          </h1>
          <p className="mt-6 text-lg leading-8 text-text-secondary">
            moderation, utility, Last.Fm, server management, and more. only one
            bot for your server.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#invite"
              className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all hover:bg-primary/90 hover:shadow-[0_0_50px_rgba(168,85,247,0.5)]"
            >
              add to your server
            </Link>
            <Link
              href="/docs/"
              aria-disabled="true"
              tabIndex={-1}
              onClick={(e) => e.preventDefault()}
              className="inline-flex cursor-not-allowed items-center justify-center rounded-full border border-border-hover px-8 py-3.5 text-base font-medium text-text-primary opacity-60"
            >
              read docs soon
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-accent/10 blur-[120px]" />
      </div>
    </section>
  );
}
