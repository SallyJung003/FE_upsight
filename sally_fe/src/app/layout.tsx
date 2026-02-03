import type { Metadata } from "next";
import { Provider } from "@chakra-ui/react/provider";
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
  title: "업사이트 프론트 과제 sally",
  description: "업사이트 프론트 과제 sally",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <Provider>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          {children}
        </body>
      </Provider>
    </html>
  );
}
