import "./globals.css";
import { Cairo } from "next/font/google";
import { SidebarProvider } from "@/components/ui/sidebar";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
});

export const metadata = {
  title: "Nutri Panel",
  description: "",
};

export default function RootLayout({ children })
{
  return (
    <html lang="ar" dir="rtl" className={cairo.variable} suppressHydrationWarning>
      <body className="antialiased ">
        {children}
      </body>
    </html>
  );
}