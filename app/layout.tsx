import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Catamarca Pádel Tour | Competencia",
  description: "Torneos, parejas, resultados y posiciones del Catamarca Pádel Tour.",
  applicationName: "Catamarca Pádel Tour",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#101b2c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
