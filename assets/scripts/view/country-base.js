import {renderCountryTreaties} from 'lib/render-treaties';
import {renderAuthors} from 'lib/render-authors';

export default Backbone.View.extend({
  className: 'countries',

  subnav: 'countries',

  initialize(options) {
    this.options = options;
    return this;
  },

  render() {
    if (this.template) {
      this.$el.html(this.template({
        this,
        i18n: this.options.i18n,
        renderCountryTreaties,
        renderAuthors,
      }));
    }

    return this;
  },
});
