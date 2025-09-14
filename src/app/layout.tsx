import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IndPak Cricket Live | Live Streaming & Commentary",
  description: "Watch India vs Pakistan cricket matches live with real-time commentary, scores, and statistics.",
  keywords: "cricket, india, pakistan, live streaming, commentary, scores",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.className} bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 min-h-screen`}>
        <div className="min-h-screen bg-gradient-to-br from-slate-900/95 via-blue-900/95 to-emerald-900/95">
          {children}
        </div>
      </body>
    </html>
  );
}