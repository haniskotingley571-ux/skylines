import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Plus, Search, BarChart3, BookOpen, Tag } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch data
  const articlesQuery = trpc.articles.list.useQuery({ limit: 10 });
  const tagsQuery = trpc.tags.list.useQuery();
  const statsQuery = trpc.articles.stats.useQuery();
  const recentQuery = trpc.articles.recent.useQuery({ limit: 5 });

  if (!isAuthenticated) {
    setLocation("/");
    return null;
  }

  const articles = articlesQuery.data || [];
  const tags = tagsQuery.data || [];
  const stats = statsQuery.data;
  const recent = recentQuery.data || [];

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
            <span className="text-sm text-foreground/70">{user?.name || user?.email}</span>
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">
            仪表盘
          </h1>
          <p className="text-foreground/60">
            欢迎回来，{user?.name || "用户"}。管理您的知识库内容。
          </p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60 mb-1">总文章数</p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats.totalArticles}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60 mb-1">总阅读数</p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats.totalViews}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-accent" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60 mb-1">标签数</p>
                  <p className="text-3xl font-bold text-foreground">
                    {tags.length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                  <Tag className="w-6 h-6 text-primary" />
                </div>
              </div>
            </Card>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Search and Create */}
            <div className="mb-8 flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground/40" />
                <Input
                  placeholder="搜索文章..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => setLocation("/articles/new")}
              >
                <Plus className="w-4 h-4 mr-2" />
                新建文章
              </Button>
            </div>

            {/* Articles List */}
            <div className="space-y-4">
              <h2 className="font-semibold text-foreground mb-4">所有文章</h2>
              {articlesQuery.isLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 rounded-full border-4 border-primary border-t-accent animate-spin mx-auto mb-2"></div>
                  <p className="text-foreground/60">加载中...</p>
                </div>
              ) : articles.length === 0 ? (
                <Card className="p-12 text-center border border-border">
                  <BookOpen className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
                  <p className="text-foreground/60 mb-4">还没有文章</p>
                  <Button
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => setLocation("/articles/new")}
                  >
                    创建第一篇文章
                  </Button>
                </Card>
              ) : (
                articles.map((article) => (
                  <Card
                    key={article.id}
                    className="p-6 border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => setLocation(`/articles/${article.slug}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-foreground/60 line-clamp-2">
                          {article.excerpt || "暂无摘要"}
                        </p>
                        <div className="flex items-center gap-4 mt-4 text-xs text-foreground/50">
                          <span>
                            {new Date(article.updatedAt).toLocaleDateString()}
                          </span>
                          <span>{article.viewCount} 次阅读</span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLocation(`/articles/${article.slug}/edit`);
                          }}
                        >
                          编辑
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recent Articles */}
            <Card className="p-6 border border-border">
              <h3 className="font-semibold text-foreground mb-4">最近编辑</h3>
              <div className="space-y-3">
                {recentQuery.isLoading ? (
                  <p className="text-sm text-foreground/60">加载中...</p>
                ) : recent.length === 0 ? (
                  <p className="text-sm text-foreground/60">暂无最近编辑的文章</p>
                ) : (
                  recent.map((article) => (
                    <div
                      key={article.id}
                      className="p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors cursor-pointer"
                      onClick={() => setLocation(`/articles/${article.slug}`)}
                    >
                      <p className="text-sm font-medium text-foreground line-clamp-1">
                        {article.title}
                      </p>
                      <p className="text-xs text-foreground/60">
                        {new Date(article.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Tags */}
            <Card className="p-6 border border-border">
              <h3 className="font-semibold text-foreground mb-4">标签</h3>
              <div className="flex flex-wrap gap-2">
                {tagsQuery.isLoading ? (
                  <p className="text-sm text-foreground/60">加载中...</p>
                ) : tags.length === 0 ? (
                  <p className="text-sm text-foreground/60">暂无标签</p>
                ) : (
                  tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: tag.color }}
                    >
                      {tag.name}
                    </span>
                  ))
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4"
                onClick={() => setLocation("/tags")}
              >
                管理标签
              </Button>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 border border-border">
              <h3 className="font-semibold text-foreground mb-4">快速操作</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setLocation("/articles/new")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  新建文章
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setLocation("/tags/new")}
                >
                  <Tag className="w-4 h-4 mr-2" />
                  新建标签
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
