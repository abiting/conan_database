import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SpyFamilyList from '@/components/SpyFamilyList';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SpyFamily() {
  const { isSimplified } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
      {/* Language Switcher - Positioned for iframe */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-2 flex justify-end">
        <LanguageSwitcher />
      </div>

      {/* Main Content */}
      <main className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-t-0">
        <div className="container py-8 pb-8 md:pb-32">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-white dark:bg-slate-950 border-b">
              <CardTitle>
                {isSimplified ? '集数查询' : '集數查詢'}
              </CardTitle>
              <CardDescription>
                {isSimplified ? '支持动画集数、标题等关键词查询' : '支援動畫集數、標題等關鍵詞查詢'}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <SpyFamilyList />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
