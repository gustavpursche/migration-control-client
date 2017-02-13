import _ from 'underscore';
import {renderTreatyList} from 'lib/render-treaties';
import {renderAuthors} from 'lib/render-authors';

export default Backbone.View.extend({
  className: 'background',

  subnav: 'background',

  initialize(options) {
    this.options = options;
    return this;
  },

  render() {
    if (this.template) {
      this.$el.html(this.template({
        model: this.model,
        i18n: this.options.i18n,
        renderTreatyList,
        renderAuthors,
      }));
    }

    return this;
  },
});
