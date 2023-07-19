import { Metadata } from "next";
import { siteConfig } from "@/components/config/site.config";
import { AuthProvider } from "@/components/contexts/useAuthContext";
import LayoutWrapper from "@/components/LayoutWrapper";
import ThemeProvider from "@/components/contexts/ThemeProvider";
import { DataProvider } from "@/components/contexts/useDataContext";
import "./globals.css";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${siteConfig.fontSans.variable} bg-white text-black antialiased dark:bg-black dark:text-white`}
      >
        <AuthProvider>
          <ThemeProvider>
            <DataProvider>
              <LayoutWrapper>{children}</LayoutWrapper>
            </DataProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
