import "./globals.css";
import Header from "./header";

import { inter, geologica } from "@/lib/fonts";
import { ThemeProvider } from "@/components/darkmode/themeprovider";
import Footer from "./footer";
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "James Patrick Talamo",
  icons: {
    icon: "/pfp.png",
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${inter.className} pt-[65px] overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
