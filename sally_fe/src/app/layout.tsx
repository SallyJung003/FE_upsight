import type { Metadata } from "next";
import { Providers } from "./providers";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/shared/ui/Navbar";
import { Container } from "@chakra-ui/react";
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
  title: "업사이트 프론트 과제 sally",
  description: "업사이트 프론트 과제 sally",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kr">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <Navbar />
          <Container maxW="container.xl" py={16}>
            {children}
          </Container>
        </Providers>
      </body>
    </html>
  );
}
