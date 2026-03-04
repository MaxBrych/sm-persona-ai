import type { Metadata } from "next";
import { Ubuntu_Sans, Merriweather } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const fontSans = Ubuntu_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontSerif = Merriweather({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Persona AI - Schwäbisch Media",
  description: "KI-gestützte Persona-Analyse für nutzerzentrierte Produktentscheidungen",
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${fontSans.variable} ${fontSerif.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
