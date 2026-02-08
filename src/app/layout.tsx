import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "A Taste of Miraval | Life in Balance, Beyond the Desert",
    template: "%s | A Taste of Miraval",
  },
  description:
    "Extend your Miraval journey. Interactive, immersive wellness experiences from world-class teachers — accessible anywhere, anytime.",
  keywords: [
    "Miraval",
    "wellness",
    "meditation",
    "qigong",
    "holographic memory",
    "mindfulness",
    "spirituality",
    "self-discovery",
  ],
  openGraph: {
    title: "A Taste of Miraval",
    description:
      "Interactive, immersive wellness experiences from Miraval's world-class teachers.",
    type: "website",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  themeColor: "#F5EDE3",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="font-body antialiased">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
