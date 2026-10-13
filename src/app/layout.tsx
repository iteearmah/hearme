import type { Metadata, Viewport } from "next";
import "../styles.css";

const SITE_URL = "https://hearme.vercel.app";

const TITLE =
  "HearMe — rewrite blunt messages so she'll actually want to hear them";
const DESCRIPTION =
  "HearMe rewrites blunt, logical messages into warm, emotionally intelligent ones — keeping your point but leading with feeling. Works as an installable PWA, needs no account, and runs on free AI providers with no API key required.";

const themeScript = `(function(){try{var s=JSON.parse(localStorage.getItem("hearme.settings.v1")||"{}");var t=s.theme||"system";var d=t==="dark"||(t==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme=d?"dark":"light";}catch(e){}})();`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · HearMe",
  },
  description: DESCRIPTION,
  applicationName: "HearMe",
  manifest: "/manifest.webmanifest",
  keywords: [
    "rewrite message",
    "emotionally intelligent messages",
    "communication with partner",
    "relationship communication",
    "apologize text",
    "blunt message rewrite",
    "say it softer",
    "AI message rewriter",
    "PWA",
    "works offline",
    "free no API key",
  ],
  authors: [{ name: "HearMe" }],
  creator: "HearMe",
  publisher: "HearMe",
  category: "lifestyle",
  alternates: { canonical: "/" },
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
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "HearMe",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
    // images are injected automatically by src/app/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    // twitter:image is injected automatically from the same file
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

/** Rich result for the app itself + the FAQ-style questions the page answers. */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/#app`,
      name: "HearMe",
      url: SITE_URL,
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Any (web, PWA)",
      description: DESCRIPTION,
      inLanguage: "en",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: [
        "Rewrites blunt messages into warm, emotionally intelligent ones",
        "Six tones and a softening dial",
        "Installable PWA that works offline",
        "Configurable AI providers, keyless by default",
        "On-device history, no account required",
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "What does HearMe do with my message?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "It keeps your intent and every concrete point you made — the facts, the boundaries, the requests — and rewrites only the delivery so the feeling lands first. It will not invent apologies, guilt-trip you, or claim to know how she feels.",
          },
        },
        {
          "@type": "Question",
          name: "Do I need an API key or an account?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. HearMe works out of the box on a free, keyless AI provider. If you prefer, you can paste your own key for OpenCode Zen, Groq, Google AI Studio or OpenRouter, or point it at a local Ollama or LM Studio server.",
          },
        },
        {
          "@type": "Question",
          name: "Is my data private?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "There is no account and no analytics. Your history is stored only in your own browser, and you can clear it at any time. Requests go through the app's own proxy, and no key is ever bundled into the app.",
          },
        },
        {
          "@type": "Question",
          name: "Can I install it on my phone?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. HearMe is an installable PWA. Use your browser's Add to Home Screen option and it launches full-screen, with an app icon and offline access to the app shell.",
          },
        },
      ],
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="canonical" href={SITE_URL} />
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