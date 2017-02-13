import I18n from 'lib/i18n';
import limax from 'limax';

export default Backbone.Model.extend({
  defaults: {
    active: false,
  },

  getSlug() {
    let label = this.get('label').toLowerCase();
    const i18n = new I18n();

    if (i18n.loadFrom(label, 'en') === 'theses') {
      return '';
    }

    return limax(label);
  },
});
