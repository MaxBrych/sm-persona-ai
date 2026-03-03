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
