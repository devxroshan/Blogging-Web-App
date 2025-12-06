import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";

import QueryWrapper from "./Wrapper/QueryWrapper";

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "BlogIt.",
  description: "Modern Bloggin Web App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <QueryWrapper>
        <body className={`antialiased ${poppins.className}`}>{children}</body>
      </QueryWrapper>
    </html>
  );
}
