"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-bg-elevated/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/samy.jpg"
                alt="samy"
                className="h-8 w-8 rounded-full object-cover"
              />

              <span className="text-lg font-semibold tracking-tight text-text-primary">
                Samy
              </span>
            </div>
            <p className="text-sm text-text-muted">
              © 2026 Samy. all rights reserved.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">
              app
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/invite"
                  className="text-sm text-text-muted transition-colors hover:text-accent"
                >
                  invite
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/"
                  className="text-sm text-text-muted transition-colors hover:text-accent"
                >
                  docs
                </Link>
              </li>
              <li>
                <Link
                  href="/discord"
                  className="text-sm text-text-muted transition-colors hover:text-accent"
                >
                  support server
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">
              resources
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://github.com/TheOldZoom/samy"
                  className="text-sm text-text-muted transition-colors hover:text-accent"
                >
                  github
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/TheOldZoom/samy/issues"
                  className="text-sm text-text-muted transition-colors hover:text-accent"
                >
                  suggestions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">
              legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-text-muted transition-colors hover:text-accent"
                >
                  terms
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-text-muted transition-colors hover:text-accent"
                >
                  privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
