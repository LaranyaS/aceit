import { ClerkProvider } from "@clerk/nextjs";
import { DM_Sans, Lora } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
});

export const metadata = {
  title: "AceIt",
  description: "Practice smarter. Interview better. Land your dream job.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${lora.variable} ${dmSans.variable} font-sans`}>
        <ClerkProvider>
          <ThemeProvider>
            <main className="min-h-screen">{children}</main>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}