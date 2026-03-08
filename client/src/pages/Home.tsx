import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { BookOpen, Search, Tag, BarChart3, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-accent animate-spin mx-auto mb-4"></div>
          <p className="text-foreground/60">加载中...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
        {/* Navigation */}
        <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-white font-bold text-sm">SK</span>
              </div>
              <span className="font-display text-xl font-bold text-foreground">SKYLINES</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-foreground/70">{user.name || user.email}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  window.location.href = "/api/oauth/logout";
                }}
              >
                退出
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              欢迎回来，{user.name || "知识探索者"}
            </h1>
            <p className="text-lg text-foreground/70 mb-8">
              开启您的个人知识库之旅，记录、整理、分享您的思想与见解
            </p>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => setLocation("/dashboard")}
            >
              进入仪表盘 <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              {
                icon: BookOpen,
                title: "文章管理",
                description: "创建、编辑、删除您的知识库文章",
              },
              {
                icon: Tag,
                title: "标签分类",
                description: "使用标签组织和分类您的内容",
              },
              {
                icon: Search,
                title: "全文搜索",
                description: "快速检索您的知识库中的任何内容",
              },
              {
                icon: BarChart3,
                title: "数据统计",
                description: "查看您的知识库增长和阅读统计",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={idx}
                  className="p-6 border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                  onClick={() => setLocation("/dashboard")}
                >
                  <div className="w-12 h-12 rounded-lg bg-secondary group-hover:bg-primary/10 flex items-center justify-center mb-4 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-foreground/60">{feature.description}</p>
                </Card>
              );
            })}
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl border border-primary/20 p-12 text-center">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              准备好开始了吗？
            </h2>
            <p className="text-foreground/70 mb-8 max-w-2xl mx-auto">
              SKYLINES 是您的个人知识库平台，帮助您记录、组织和分享您的思想。立即开始构建您的知识体系。
            </p>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
                 onClick={() => setLocation("/dashboard")}
            >
              开始探索 <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-24">
          <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="text-white font-bold text-sm">SK</span>
                  </div>
                  <span className="font-display font-bold text-foreground">SKYLINES</span>
                </div>
                <p className="text-sm text-foreground/60">
                  您的个人专属知识库
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">功能</h4>
                <ul className="space-y-2 text-sm text-foreground/60">
                  <li><a href="#" className="hover:text-primary transition">文章管理</a></li>
                  <li><a href="#" className="hover:text-primary transition">标签分类</a></li>
                  <li><a href="#" className="hover:text-primary transition">全文搜索</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">资源</h4>
                <ul className="space-y-2 text-sm text-foreground/60">
                  <li><a href="#" className="hover:text-primary transition">文档</a></li>
                  <li><a href="#" className="hover:text-primary transition">帮助</a></li>
                  <li><a href="#" className="hover:text-primary transition">关于</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">法律</h4>
                <ul className="space-y-2 text-sm text-foreground/60">
                  <li><a href="#" className="hover:text-primary transition">隐私政策</a></li>
                  <li><a href="#" className="hover:text-primary transition">服务条款</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-border pt-8 text-center text-sm text-foreground/60">
              <p>&copy; 2026 SKYLINES. 保留所有权利。</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Login Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-white font-display font-bold text-2xl">SK</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">SKYLINES</h1>
          <p className="text-lg text-foreground/70">个人专属知识库</p>
        </div>

        {/* Login Card */}
        <Card className="p-8 border border-border shadow-xl">
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">欢迎</h2>
          <p className="text-foreground/60 mb-8">
            登录您的账户以开始管理您的知识库
          </p>

          <Button
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold mb-4"
            onClick={() => {
              window.location.href = getLoginUrl();
            }}
          >
            使用 Manus 登录
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-foreground/60">或</span>
            </div>
          </div>

          <p className="text-center text-sm text-foreground/60">
            首次访问？无需注册，直接使用 Manus 账户登录
          </p>
        </Card>

        {/* Features */}
        <div className="mt-12 grid grid-cols-3 gap-4">
          {[
            { icon: "📝", label: "记录想法" },
            { icon: "🏷️", label: "智能分类" },
            { icon: "🔍", label: "快速查找" },
          ].map((item, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="text-xs text-foreground/60">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-xs text-foreground/50">
          <p>© 2026 SKYLINES. 保留所有权利。</p>
        </div>
      </div>
    </div>
  );
}
