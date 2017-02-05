import _ from 'underscore';
import {icon} from 'lib/icon';
import i18n from 'lib/i18n';
import LanguagesCollection from 'collection/language';
import LanguageView from 'view/language';

export default Backbone.View.extend({
  tagName: 'header',

  className: 'header',

  events: {
    'click [data-toggle-map]': '_showMap',
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
      i18n,
    }));

    /* create language switch */
    //const languageSwitch = new LanguageView(this.options);
    //languageSwitch.render().$el.appendTo(this.$el);

    return this;
  },

  _showMap(event) {
    event.preventDefault();
    this.options.application.set('map-shown', true);
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
        <%= i18n('Map') %>
      </span>
    </button>

    <strong class="header__title">
      <%= i18n('Migration Control') %>
    </strong>
  `),
});
