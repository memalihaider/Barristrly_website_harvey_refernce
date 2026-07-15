import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const harveySans = localFont({
  src: "../public/fonts/HarveySans.woff2",
  variable: "--font-sans-family",
  display: "swap",
  weight: "100 900",
});

const harveySerif = localFont({
  src: [
    {
      path: "../public/fonts/HarveySerif-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/HarveySerif-Italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-serif-family",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Barristrly | Privacy-First Legal Intelligence",
  description:
    "AI-powered legal marketplace with double-blind COI vetting, anonymous matching, milestone escrow, and encrypted consultations across UAE, GCC, and Pakistan.",
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${harveySans.variable} ${harveySerif.variable} antialiased`}
    >
      <body className="min-h-dvh flex flex-col bg-ivory text-ink font-sans">
        {children}
      </body>
    </html>
  );
}
