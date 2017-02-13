import _ from 'underscore';
import {renderTreatyList} from 'lib/render-treaties';
import {renderAuthors} from 'lib/render-authors';

export default Backbone.View.extend({
  className: 'background',

  subnav: 'background',

  render() {
    if (this.template) {
      this.$el.html(this.template({
        this,
        i18n: this.options.i18n.load,
        renderTreatyList,
        renderAuthors,
      }));
    }

    return this;
  },
});
