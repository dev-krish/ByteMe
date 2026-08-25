import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
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
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-background text-on-background min-h-screen flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
