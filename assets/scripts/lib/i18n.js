import _ from 'underscore';
import translations from 'fixtures/translations';

export default class I18n {
  constructor(language) {
    this.language = language;
  }

  load(str) {
    if (!this.language) {
      console.log('translation', this.language, str, translations[str][this.language] || str);
    }

    const entity = translations[str];

    if (!entity) {
      console.log('missing:', str);
      return str;
    }

    return entity[this.language] || str;
  }

  loadFrom(str, language)  {
    let opts = {};
    opts[language] = str;

    return _.findKey(translations, opts) || str;
  }
}
