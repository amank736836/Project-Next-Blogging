import "./globals.css";
import { ThemeProvider } from "@/hooks/theme-context";
import { Header, Footer } from "@/components";
import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from '@vercel/analytics/next';
import Ambient from "@/components/ui/Ambient";
import ScrollProgress from "@/components/ui/ScrollProgress";
import PageShell from "@/components/ui/PageShell";

/**
 * Paints the saved theme before first frame so there is no white flash on a
 * dark visit. Runs once, synchronously, before hydration.
 */
const themeInit = `try{var s=localStorage.getItem("themeMode");var d=s?s:window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";var r=document.documentElement;r.classList.toggle("dark",d==="dark");r.style.colorScheme=d;}catch(e){}`;

export const metadata = {
  title: {
    default: "Frame & Phrase | Where Prose Finds Its Home",
    template: "%s · Frame & Phrase",
  },
  description:
    "A premium blogging platform where snapshots tell stories and prose finds its tranquil home.",
  applicationName: "Frame & Phrase",
  icons: {
    icon: "/assets/frame_phrase_favicon_v1_1771129805341.png",
  },
  openGraph: {
    title: "Frame & Phrase | Where Prose Finds Its Home",
    description:
      "Shoot the moment, write it while it is still warm, and let a quiet archive do the remembering.",
    type: "website",
    siteName: "Frame & Phrase",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frame & Phrase",
    description: "Where prose finds its tranquil home.",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eaeff6" },
    { media: "(prefers-color-scheme: dark)", color: "#060e1a" },
  ],
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        </head>
        <body className="min-h-screen font-sans">
          <ThemeProvider>
            <a href="#main" className="skip-link">
              Skip to content
            </a>
            <Ambient />
            <ScrollProgress />
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main id="main" className="flex-grow">
                <PageShell>{children}</PageShell>
              </main>
              <Footer />
            </div>
          </ThemeProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
