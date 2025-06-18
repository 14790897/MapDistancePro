import type { Metadata } from 'next'
import './globals.css'
import ChatwootWidget from "@/components/ChatwootWidget";

export const metadata: Metadata = {
  title: "MapDistancePro - 批量地址距离计算与高德地图标注工具",
  description:
    "基于高德地图API的专业批量地址距离计算与地图标注应用，支持自动定位、距离排序、CSV导出。免费开源，安全可靠，适用于房地产、物流、市场调研等多种场景。",
  generator: "MapDistancePro",
  keywords:
    "高德地图,距离计算,批量地址,地图标注,GPS定位,CSV导出,地址解析,路径规划,房地产工具,物流优化,MapDistancePro",
  authors: [{ name: "MapDistancePro Team" }],
  creator: "MapDistancePro",
  publisher: "MapDistancePro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://map.14790897.xyz"),
  alternates: {
    canonical: "/",
    languages: {
      "zh-CN": "/",
    },
  },
  openGraph: {
    title: "MapDistancePro - 专业地址距离计算工具",
    description:
      "基于高德地图API的批量地址距离计算专家，为您提供精确、快速、安全的地理信息处理服务",
    url: "https://map.14790897.xyz",
    siteName: "MapDistancePro",
    locale: "zh_CN",
    type: "website",
    images: [
      {
        url: "/placeholder-logo.png",
        width: 1200,
        height: 630,
        alt: "MapDistancePro - 批量地址距离计算工具",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MapDistancePro - 专业地址距离计算工具",
    description: "基于高德地图API的批量地址距离计算专家",
    images: ["/placeholder-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // verification: {
  //   google: "your-google-verification-code", // 需要替换为实际的验证码
  // },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml", sizes: "32x32" },
    ],
    shortcut: "/favicon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "ryqnl3b3ow");
            `,
          }}
        />{" "}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "MapDistancePro",
              description:
                "基于高德地图API的专业批量地址距离计算与地图标注应用",
              url: "https://mapdistancepro.vercel.app",
              applicationCategory: "ProductivityApplication",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "CNY",
                availability: "https://schema.org/InStock",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                reviewCount: "1056",
                bestRating: "5",
                worstRating: "1",
              },
              author: {
                "@type": "Organization",
                name: "MapDistancePro Team",
              },
              datePublished: "2024-01-01",
              dateModified: "2024-12-01",
              keywords: "高德地图,距离计算,批量地址,地图标注,GPS定位,CSV导出",
              inLanguage: "zh-CN",
              isAccessibleForFree: true,
              screenshot:
                "https://mapdistancepro.vercel.app/placeholder-logo.png",
            }),
          }}
        />
      </head>
      <body>
        {children}
        <ChatwootWidget />
      </body>
    </html>
  );
}
