import { configurationLoader } from 'shared/configuration-loader';

/* istanbul ignore next */
export class LocaleHelper {
  public static locale: any;
  /* istanbul ignore next */
  public static async getLocaleAndContext() {
    const savedLanguage = localStorage.getItem('language');
    const { uiLocale: language } = await configurationLoader.loadConfiguration(savedLanguage);

    this.locale = language;
  }
  /* istanbul ignore next */
  public static getNavigatorLanguages() {
    let lang = null;
    let languages = this.getCommonNavLangs();

    if (!languages) {
      const existingProperty = [ 'language', 'browserLanguage', 'userLanguage', 'systemLanguage']
        .find((property) => this.getNavigatorProperty(property));
      lang = this.getNavigatorProperty(existingProperty);
    }

    if (lang !== null) {
      languages = [lang.slice(0, 2)];
    }
    return languages;
  }
  /* istanbul ignore next */
  public static getCommonNavLangs() {
    return navigator.languages;
  }
  /* istanbul ignore next */
  public static getNavigatorProperty(property: string) {
    return (navigator as any)[property];
  }
}