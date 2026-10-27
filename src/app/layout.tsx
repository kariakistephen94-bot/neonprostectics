import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "NeonDentalProstectics | Practice workspace",
  description:
    "Frontend demonstration workspace for dental care and prosthetics.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
