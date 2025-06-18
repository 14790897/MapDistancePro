"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Navigation,
  Download,
  Zap,
  Shield,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  Globe,
  Clock,
  Target,
  BarChart3,
  Github,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export default function PromoPage() {
  const [animatedCounter, setAnimatedCounter] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (animatedCounter < 1056) {
        setAnimatedCounter(prev => Math.min(prev + 47, 1056));
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [animatedCounter]);

  const features = [
    {
      icon: <MapPin className="w-8 h-8 text-blue-600" />,
      title: "批量地址处理",
      description: "一次性处理多达50个地址，自动计算距离并按远近排序",
      highlight: "高效批处理"
    },
    {
      icon: <Navigation className="w-8 h-8 text-green-600" />,
      title: "精准定位计算",
      description: "基于高德地图API，提供精确的GPS坐标和距离计算",
      highlight: "精度保证"
    },
    {
      icon: <Download className="w-8 h-8 text-purple-600" />,
      title: "数据导出功能",
      description: "支持CSV格式导出，方便数据分析和后续处理",
      highlight: "便捷导出"
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: "实时地图标注",
      description: "动态显示所有地址位置，直观查看地理分布",
      highlight: "可视化展示"
    },
    {
      icon: <Shield className="w-8 h-8 text-red-600" />,
      title: "本地数据存储",
      description: "所有数据本地保存，保护隐私安全",
      highlight: "隐私保护"
    },
    {
      icon: <Clock className="w-8 h-8 text-indigo-600" />,
      title: "快速响应",
      description: "平均响应时间<2秒，提升工作效率",
      highlight: "高速处理"
    }
  ];

  const useCases = [
    {
      title: "房地产经纪",
      description: "快速筛选符合客户距离要求的房源",
      icon: "🏠"
    },
    {
      title: "物流配送",
      description: "优化配送路线，降低运输成本",
      icon: "🚚"
    },
    {
      title: "市场调研",
      description: "分析目标区域内的商业分布",
      icon: "📊"
    },
    {
      title: "旅游规划",
      description: "制定最优的景点游览路线",
      icon: "🗺️"
    }
  ];

  const stats = [
    { number: "1,056+", label: "活跃用户", icon: <Users className="w-6 h-6" /> },
    { number: "4.8", label: "用户评分", icon: <Star className="w-6 h-6" /> },
    { number: "50+", label: "批量处理", icon: <Target className="w-6 h-6" /> },
    { number: "99.9%", label: "服务可用性", icon: <Shield className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
              🚀 全新升级版本已发布
            </Badge>
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MapDistancePro
              </span>
              <br />
              <span className="text-3xl sm:text-4xl text-gray-700">
                智能地址距离计算专家
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              基于高德地图API的专业级批量地址距离计算工具，为您提供精确、快速、安全的地理信息处理服务
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg rounded-xl shadow-lg">
                立即体验
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="https://github.com/14790897/MapDistancePro" target="_blank">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg rounded-xl border-2">
                <Github className="mr-2 w-5 h-5" />
                查看源码
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-2 text-blue-600">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.label === "活跃用户" ? animatedCounter + "+" : stat.number}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              强大功能，一应俱全
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              专为效率而生，为专业而设计
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-gray-50 group-hover:bg-blue-50 transition-colors">
                      {feature.icon}
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {feature.highlight}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              适用场景
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              无论您从事什么行业，我们都能为您提供专业的解决方案
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 bg-white border-0 shadow-md">
                <CardContent className="p-8">
                  <div className="text-4xl mb-4">{useCase.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {useCase.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {useCase.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Advantages */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                技术优势
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">高德地图API集成</h3>
                    <p className="text-gray-600">采用高德地图官方API，确保数据准确性和服务稳定性</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Next.js 现代架构</h3>
                    <p className="text-gray-600">基于React和Next.js构建，提供流畅的用户体验</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">响应式设计</h3>
                    <p className="text-gray-600">完美适配桌面端、平板和手机，随时随地使用</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">开源免费</h3>
                    <p className="text-gray-600">完全开源，持续更新，社区驱动发展</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:text-center">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 inline-block">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-900">99.9%</div>
                    <div className="text-sm text-gray-600">准确率</div>
                  </div>
                  <div className="text-center">
                    <Clock className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-900">&lt;2s</div>
                    <div className="text-sm text-gray-600">响应时间</div>
                  </div>
                  <div className="text-center">
                    <Globe className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-900">24/7</div>
                    <div className="text-sm text-gray-600">在线服务</div>
                  </div>
                  <div className="text-center">
                    <Shield className="w-12 h-12 text-red-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-900">100%</div>
                    <div className="text-sm text-gray-600">数据安全</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            准备开始您的高效地址处理之旅？
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            立即体验 MapDistancePro，让地址距离计算变得简单高效
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-xl shadow-lg">
                立即开始使用
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="https://github.com/14790897/MapDistancePro" target="_blank">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg rounded-xl">
                <ExternalLink className="mr-2 w-5 h-5" />
                了解更多
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">MapDistancePro</span>
          </div>
          <p className="text-gray-400 mb-6">
            专业的批量地址距离计算工具 • 开源免费 • 持续更新
          </p>
          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <Link href="https://github.com/14790897/MapDistancePro" target="_blank" className="hover:text-white transition-colors">
              GitHub
            </Link>
            <Link href="https://github.com/14790897/MapDistancePro/issues" target="_blank" className="hover:text-white transition-colors">
              问题反馈
            </Link>
            <Link href="https://github.com/14790897/MapDistancePro/releases" target="_blank" className="hover:text-white transition-colors">
              版本发布
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
