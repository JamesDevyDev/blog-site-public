import "./globals.css";
import Header from "./header";

import { Inter, Geist } from 'next/font/google'
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={cn("font-sans", geist.variable)}>
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
