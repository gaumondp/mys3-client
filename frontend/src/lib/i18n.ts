
import {
  init,
  register,
  getLocaleFromNavigator,
} from 'svelte-i18n';

register('en', () => import('../locales/en.json'));
register('fr', () => import('../locales/fr.json'));
register('es', () => import('../locales/es.json'));
register('de', () => import('../locales/de.json'));

init({
  fallbackLocale: 'en',
  initialLocale: getLocaleFromNavigator(),
});
