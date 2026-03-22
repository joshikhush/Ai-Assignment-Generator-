import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VedaAI - Assignment Creator",
  description: "AI-powered assessment creator and evaluator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f4f5f7]`}
      >
        <div className="flex min-h-screen">
          {/* Sidebar takes fixed width */}
          <Sidebar />
          
          {/* Main Content takes the remaining space */}
          <main className="flex-1 ml-[280px] p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
