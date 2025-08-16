import { Geist, Geist_Mono } from "next/font/google";
import { Box, ColorModeScript, Container, Flex, VStack } from "@yamada-ui/react";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <ColorModeScript type="cookie" nonce="testing" />
      </head>
      <body>
        <Providers>
          <VStack minH="100vh" display="flex" flexDirection="column" top="md" p="24">
            <Header />
            <Flex flex="1">
              <Box as="main" flex="1" p="6">
                <Container maxW="container.xl">
                  {children}
                </Container>
              </Box>
            </Flex>
          </VStack>
        </Providers>
      </body>
    </html>
  );
}
