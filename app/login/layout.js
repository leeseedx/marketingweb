import "@/app/globals.css";
import { NextUIProvider } from "@nextui-org/react";

export const metadata = {
  title: "LEESEEDX",
  openGraph: {
    type:'website',
    title: 'LEESEEDX',
    description: '인플루언서 관리 웹 입니다.',
  },
  description: "인플루언서 관리 웹 입니다.",
  keywords:'인플루언서, 관리, 웹',
  icons: {
    icon: "",
  },
  robots: {
    index: true,
    follow: true}
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NextUIProvider>
          <main className="purple-dark text-foreground bg-background">
            {children}
          </main>
        </NextUIProvider>
      </body>
    </html>
  );
}
