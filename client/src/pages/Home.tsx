import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AnimeList from '@/components/AnimeList';
import MangaList from '@/components/MangaList';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const { isSimplified } = useLanguage();
  const [activeTab, setActiveTab] = useState('anime');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white dark:bg-slate-950 sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isSimplified ? '名侦探柯南集数整理' : '名偵探柯南集數整理'}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isSimplified ? '动画 + 漫画全集数查询' : '動畫 + 漫畫全集數查詢'}
            </p>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-b">
            <CardTitle>
              {isSimplified ? '集数查询' : '集數查詢'}
            </CardTitle>
            <CardDescription>
              {isSimplified ? '搜索动画集数或漫画卷数，支持按集数、卷数、标题等关键词查询' : '搜尋動畫集數或漫畫卷數，支援按集數、卷數、標題等關鍵詞查詢'}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="anime">
                  {isSimplified ? '动画' : '動畫'}
                </TabsTrigger>
                <TabsTrigger value="manga">
                  {isSimplified ? '漫画' : '漫畫'}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="anime" className="mt-6">
                <AnimeList />
              </TabsContent>

              <TabsContent value="manga" className="mt-6">
                <MangaList />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            {isSimplified ? '数据仅供参考，请以官方发布为准' : '資料僅供參考，請以官方發佈為準'}
          </p>
        </div>
      </main>
    </div>
  );
}
