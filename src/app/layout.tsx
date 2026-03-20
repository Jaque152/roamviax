import type { Metadata } from "next";
import "./globals.css";
import { ClientBody } from "./ClientBody";

export const metadata: Metadata = {
  title: "Viajes MX - Experiencias Únicas en México",
  description: "Diseñamos experiencias personalizadas para que tú solo te preocupes por disfrutar el camino. Descubre los rincones más auténticos de México.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <ClientBody>{children}</ClientBody>
    </html>
  );
}
