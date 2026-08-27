import type { Metadata } from "next";
import { Outfit, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "NLAMS - National Land Acquisition & Management System",
  description:
    "Government of India statutory lifecycle management portal for RFCTLARR-2013, ensuring transparent workflows, GIS cadastral mapping, and fair compensation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body
        className={`${outfit.variable} ${jetbrainsMono.variable} ${playfair.variable} font-sans antialiased bg-background text-on-background min-h-screen flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
