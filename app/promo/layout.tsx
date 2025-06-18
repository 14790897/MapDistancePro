import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "MapDistancePro - 专业地址距离计算工具 | 宣传页",
  description: "MapDistancePro是基于高德地图API的专业级批量地址距离计算工具，支持批量处理、实时地图标注、数据导出等功能。免费开源，安全可靠。",
  keywords: "MapDistancePro,地址距离计算,批量地址处理,高德地图API,地图标注,距离排序,GPS定位,CSV导出,开源工具",
  authors: [{ name: "MapDistancePro Team" }],
  openGraph: {
    title: "MapDistancePro - 专业地址距离计算工具",
    description: "基于高德地图API的批量地址距离计算专家，为您提供精确、快速、安全的地理信息处理服务",
    type: "website",
    locale: "zh_CN",
    siteName: "MapDistancePro",
  },
  twitter: {
    card: "summary_large_image",
    title: "MapDistancePro - 专业地址距离计算工具",
    description: "基于高德地图API的批量地址距离计算专家，为您提供精确、快速、安全的地理信息处理服务",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function PromoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
