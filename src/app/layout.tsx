import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CatBackground from "@/components/cat-background";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { CatBackgroundProvider } from "@/components/cat-background-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Samy",
  description:
    "moderation, utility, Last.Fm, server management, and more. only one bot for your server.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-base text-text-primary">
        <CatBackgroundProvider>
          <CatBackground />
          <>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </>
        </CatBackgroundProvider>
      </body>
    </html>
  );
}
