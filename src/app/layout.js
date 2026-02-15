import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/hooks/theme-context";
import { Header, Footer } from "@/components";
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Frame & Phrase | Where Prose Finds Its Home",
  description: "A premium blogging platform where snapshots tell stories and prose finds its tranquil home.",
  icons: {
    icon: "/assets/frame_phrase_favicon_v1_1771129805341.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider>
            <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
