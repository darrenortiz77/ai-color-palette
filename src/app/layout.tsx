import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Color Palette Generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="antialiased bg-neutral-300 h-full">
        {children}
      </body>
    </html>
  );
}
