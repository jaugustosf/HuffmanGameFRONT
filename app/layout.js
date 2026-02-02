import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"; // ou onde estiver seu provider
import { Toaster } from "sonner"; // Importante para os Toasts funcionarem

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Huffman Game",
  description: "Aprenda o algoritmo de Huffman jogando.",
};

export default function RootLayout({ children }) {
  return (
    // 1. ADICIONE suppressHydrationWarning AQUI
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
