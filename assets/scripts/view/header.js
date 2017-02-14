import _ from 'underscore';
import $ from 'jquery';
import {icon} from 'lib/icon';
import LanguagesCollection from 'collection/language';
import LanguageView from 'view/language';

export default Backbone.View.extend({
  tagName: 'header',

  className: 'header',

  events: {
    'click [data-toggle-map]': '_showMap',
    'click [data-back-to]': '_backToIndex',
  },

  initialize(options) {
    this.options = options;

    this.listenTo(this.options.application, 'change:map-shown', (model, value) => {
      this.toggleMapToggle(value === false);
    });

    return this;
  },

  render() {
    this.$el.html(this.template({
      icon,
      i18n: this.options.i18n.load,
      language: this.options.application.get('language'),
    }));

    /* create language switch */
    const languageSwitch = new LanguageView(this.options);
    languageSwitch.render().$el.appendTo(this.$el);

    return this;
  },

  _showMap(event) {
    event.preventDefault();
    this.options.application.set('map-shown', true);
  },

  _backToIndex(event) {
    event.preventDefault();

    const target = $(event.target).attr('href');

    // TODO: hacky, refactor
    this.options.application.set('slugChanges', 0);
    this.options._router.navigate(target, {trigger: true});
  },

  toggleMapToggle(show) {
    this.$el
      .find('.header__map-toggle')
        .toggleClass('header__map-toggle--visible', show);
  },

  template: _.template(`
    <button class="header__map-toggle"
            type="button"
            data-toggle-map>
      <%= icon('map-o', 'header__map-toggle-icon') %>
      <span class="header__map-toggle-title">
        <%= i18n('Show map') %>
      </span>
    </button>

    <a href="/<%= language %>"
       class="header__title"
       data-back-to>
      <%= i18n('Migration Control') %>
    </a>
  `),
});
