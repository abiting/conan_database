import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-2">
      <Button
        variant={language === 'zh-TW' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('zh-TW')}
      >
        繁體中文
      </Button>
      <Button
        variant={language === 'zh-CN' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('zh-CN')}
      >
        简体中文
      </Button>
    </div>
  );
}
