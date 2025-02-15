import I18n from '@/shared/lib/i18n';

import { PancakeAPIs } from '../../apis/pancake-apis';
import { PancakeResponse } from '../types/pancake/pancake-response';

export async function initI18n() {
  const i18nInstance = new I18n(async (locale: string) => {
    try {
      return (await import(`@/src/translations/${locale}.json`)).default;
    } catch (error) {
      console.error(`Error loading translations for locale ${locale}:`, error);
      return {};
    }
  });
  const pancake: PancakeResponse = await PancakeAPIs.getListPages();
  const pluginLocale = pancake.categorized.activated[0]?.settings?.chatPlugin?.locale || 'en';
  await i18nInstance.loadTranslations(pluginLocale);
  return { i18n: i18nInstance, locale: pluginLocale };
}
