import type { Metadata, Viewport } from "next";
import "../styles.css";

const themeScript = `(function(){try{var s=JSON.parse(localStorage.getItem("hearme.settings.v1")||"{}");var t=s.theme||"system";var d=t==="dark"||(t==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme=d?"dark":"light";}catch(e){}})();`;

export const metadata: Metadata = {
  title: "HearMe — say what you mean, in a way she'll actually hear",
  description:
    "Rewrite blunt, logical messages into warm, emotionally intelligent ones she will actually want to hear. Installable PWA, works offline, free AI providers.",
  applicationName: "HearMe",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "HearMe",
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "HearMe",
    description:
      "Turn blunt logic into warmth. A private, installable PWA.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#141017" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}

function ServiceWorker() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `if('serviceWorker' in navigator){addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(){})})}`,
      }}
    />
  );
}