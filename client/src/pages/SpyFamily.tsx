import { Card, CardContent } from '@/components/ui/card';
import SpyFamilyList from '@/components/SpyFamilyList';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function SpyFamily() {
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
            <CardContent>
              <SpyFamilyList />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
