"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function ClosingCta() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-accent/15 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
            ready to add Samy to your server?
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            add Samy to your server today!
          </p>
          <div className="mt-10">
            <Link
              href="/invite"
              className="inline-flex items-center justify-center rounded-full bg-primary px-10 py-4 text-lg font-semibold text-primary-foreground shadow-[0_0_40px_rgba(168,85,247,0.35)] transition-all hover:bg-primary/90 hover:shadow-[0_0_60px_rgba(168,85,247,0.5)]"
            >
              add Samy to your server
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
