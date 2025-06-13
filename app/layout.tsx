import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "批量地址距离计算 - 高德地图工具",
  description:
    "基于高德地图API的批量地址距离计算与地图标注应用，支持自动定位、距离排序和CSV导出",
  generator: "v0.dev",
  keywords: "高德地图,距离计算,批量地址,地图标注,GPS定位,CSV导出",
  authors: [{ name: "MapDistancePro" }],
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
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
