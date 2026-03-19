import { SideNav } from "@/components/nav/SideNav";
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
  title: "Omne Showcase",
  description: "A dashboard shell for Omne Showcase UI work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full overflow-x-hidden bg-slate-100 text-slate-950">
        <div className="flex min-h-screen w-full flex-col lg:flex-row">
          <SideNav />
          <main className="flex min-w-0 flex-1 flex-col">{children}</main>
        </div>
      </body>
    </html>
  );
}
