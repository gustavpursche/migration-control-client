import _ from 'underscore';
import NavigationEntry from 'view/navigationEntry';
import NavigationCollection from 'collection/navigation';
import NAVIGATION_ENTRIES from 'fixtures/navigation-entries';

export default Backbone.View.extend({
  tagName: 'nav',

  className: 'navigation',

  initialize(options) {
    this.options = options;
    this.collection = new NavigationCollection(NAVIGATION_ENTRIES);
  },

  render() {
    this.$el.html(this.template());

    /* render each entry */
    this.collection.forEach(model => {
      const view = new NavigationEntry({
        model: model,
        i18n: this.options.i18n,
        application: this.options.application,
        _router: this.options._router,
      });
      view.render().$el.appendTo(this.$el.find('.navigation__list'));
    });

    return this;
  },

  template: _.template(`
    <ul class="navigation__list"></ul>
  `),
});
