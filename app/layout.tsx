import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Exchange Marathon | Team Dashboard",
  description: "Internal competition tracking platform. Select your team and track performance in real-time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans text-[#F7F7F8] bg-[#051B1D]`}
      >
        {children}
        <div className="fixed bottom-0 left-0 right-0 h-1 bg-[#ffcd00] shadow-[0_-4px_20px_rgba(255,205,0,0.3)] z-[9999] pointer-events-none" />
      </body>
    </html>
  );
}
