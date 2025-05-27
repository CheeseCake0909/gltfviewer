import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "3D Viewer",
  description: "Drag and drop 3D models to preview them",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
