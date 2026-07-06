import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "N Launcher",
  description: "Novart desktop helper companion utility",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-transparent selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
