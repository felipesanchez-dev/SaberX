import "./globals.css";
import { Poppins, Josefin_Sans } from "next/font/google";
import { ThemeProvider } from "./utils/theme-provider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins",
});

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Josefin",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${poppins.variable} ${josefin.variable} !bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black duration-300`}>
        <ThemeProvider attribute='class' defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );  
};