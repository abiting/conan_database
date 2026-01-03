import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AnimeList from '@/components/AnimeList';
import MangaList from '@/components/MangaList';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const { isSimplified } = useLanguage();
  const [activeTab, setActiveTab] = useState<'official' | 'overseas'>('official');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white dark:bg-slate-950 sticky top-0 z-50 hidden">
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

      {/* Language Switcher - Positioned for iframe */}
      <div className="sticky top-0 z-50 bg-white dark:bg-slate-950 border-b p-2 flex justify-end">
        <LanguageSwitcher />
      </div>

      {/* Main Content */}
      <main className="container py-8 pb-32">
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600 border-b">
            <CardTitle className="text-white">
              {isSimplified ? '集数查询' : '集數查詢'}
            </CardTitle>
            <CardDescription className="text-blue-100">
              {isSimplified ? '支持动画集数、标题等关键词查询' : '支援動畫集數、標題等關鍵詞查詢'}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {/* Custom Tab Navigation */}
            <div className="flex gap-2 mb-6 border-b">
              <button
                onClick={() => setActiveTab('official')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'official'
                    ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {isSimplified ? '官方版动画' : '官方版動畫'}
              </button>
              <button
                onClick={() => setActiveTab('overseas')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'overseas'
                    ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {isSimplified ? '海外版动画' : '海外版動畫'}
              </button>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === 'official' && <AnimeList key="official" version="official" />}
              {activeTab === 'overseas' && <AnimeList key="overseas" version="overseas" />}
            </div>
          </CardContent>
        </Card>


      </main>
    </div>
  );
}
