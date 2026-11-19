import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";
import "@/styles/rich-content.css";
import FirebaseAnalytics from "@/components/providers/firebase-analytics";

const harveySans = localFont({
  src: "../../public/fonts/HarveySans.woff2",
  variable: "--font-sans-family",
  display: "swap",
  weight: "100 900",
});

const harveySerif = localFont({
  src: [
    {
      path: "../../public/fonts/HarveySerif-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/HarveySerif-Italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-serif-family",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Barristrly | Legal Services for UAE & GCC",
  description:
    "Find the right legal help in the UAE and GCC. Free lawyer matching, fixed-fee consultations, retainers, contracts, wills, and more — with clear prices.",
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
      data-scroll-behavior="smooth"
      className={`${harveySans.variable} ${harveySerif.variable} antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-dvh flex flex-col bg-ivory text-ink font-sans"
        suppressHydrationWarning
      >
        <FirebaseAnalytics />
        {children}
      </body>
    </html>
  );
}
