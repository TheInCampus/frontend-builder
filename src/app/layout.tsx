import type { Metadata } from "next";
import { cookies } from "next/headers";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { isLocale } from "@/i18n/messages";
import { SiteHeader } from "@/components/SiteHeader";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Canvas — Visual App Builder",
    template: "%s | Canvas",
  },
  description: "Design and preview applications with a visual builder.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localeCookie = (await cookies()).get("canvas_locale")?.value;
  const locale = isLocale(localeCookie) ? localeCookie : "en";

  return (
    <html lang={locale}>
      <body>
        <LocaleProvider initialLocale={locale}>
          <SiteHeader />
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
