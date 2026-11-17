import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400"],
});

import { ThemeProvider } from "./components/ThemeProvider";
import { Web3Provider } from "./components/Web3Provider";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ethshala.com"),
  alternates: {
    canonical: "https://www.ethshala.com",
  },
  title: {
    default: "ETHShala | Ethereum Learning, Partnerships, Events & Communities",
    template: "%s | ETHShala",
  },
  description: "ETHShala brings Ethereum learning to campuses through hands-on workshops, community events, structured learning modules, and student-led initiatives.",
  keywords: [
    "ETHShala",
    "Ethereum Education",
    "Ethereum Learning",
    "Blockchain Education",
    "Web3 Education",
    "Ethereum Workshops",
    "Campus Partnerships",
    "Web3 Community",
    "Smart Contracts",
    "Ethereum Improvement Proposals",
    "EIP Learning",
    "Campus Ambassador Program",
    "Quiz League",
    "Web3 Student Builders",
    "EVM Labs"
  ],
  authors: [{ name: "ETHShala Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.ethshala.com",
    title: "ETHShala | Ethereum Learning, Partnerships, Events & Communities",
    description: "Bringing Ethereum learning, events, and communities to students through campus partnerships, hands-on workshops, and structured learning.",
    siteName: "ETHShala",
    images: [
      {
        url: "https://www.ethshala.com/brand/og-image.png",
        width: 1200,
        height: 630,
        alt: "ETHShala Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ETHShala | Ethereum Learning, Partnerships, Events & Communities",
    description: "Discover Ethereum through campus workshops, hands-on learning, community events, and student-led initiatives.",
    images: ["https://www.ethshala.com/brand/og-image.png"],
    creator: "@Its_EthShala",
  },
  icons: {
    icon: "/brand/ethshala_logo.svg",
    apple: "/brand/ethshala_logo.svg",
  },
};

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "ETHShala",
  alternateName: ["ETH Shala", "EIPs Bootcamp"],
  url: "https://www.ethshala.com",
  logo: "https://www.ethshala.com/brand/ethshala_logo.svg",
  sameAs: [
    "https://x.com/Its_EthShala",
    "https://www.linkedin.com/company/ethshala/",
  ],
  description: "Open Ethereum Education platform for student builders, protocol governance tracks, EVM labs, and campus cohorts.",
  knowsAbout: [
    "Ethereum",
    "Ethereum Improvement Proposals (EIPs)",
    "Smart Contract Development",
    "EVM",
    "Solidity",
    "Web3 Education",
    "Account Abstraction (ERC-4337)",
    "Proto-Danksharding (EIP-4844)",
  ],
};

const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ETHShala",
  url: "https://www.ethshala.com",
};

import { Chatbot } from "./components/Chatbot";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300 font-body">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Web3Provider>
            {children}
            <Chatbot />
            <Toaster position="bottom-right" richColors closeButton />
          </Web3Provider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
