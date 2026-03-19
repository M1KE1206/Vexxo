import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
});

export const metadata: Metadata = {
  title: "Vexxo — Web design & development studio",
  description:
    "Vexxo is een web design & development studio uit België. Wij bouwen moderne, snelle websites voor ondernemers in België en Nederland.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body
        className={`${urbanist.variable} min-h-screen bg-[color:var(--background)] font-sans text-[color:var(--text-primary)]`}
      >
        <Navbar />
        <main className="mx-auto mt-4 max-w-6xl px-6 pb-16 pt-6 md:pt-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

