import _ from 'underscore';
import $ from 'jquery';
import {icon, toggle} from 'lib/icon';
import SubNavigationColumn from 'view/sub-navigation-column';

export default Backbone.View.extend({
  tagName: 'nav',

  className: 'sub-navigation',

  events: {
    'click [data-module="toggle"]': 'toggleMenu',
  },

  _getListContainer() {
    return this.$el.find('.sub-navigation__list-container');
  },

  _getListToggleIcon() {
    return this.$el.find('.sub-navigation__toggle-icon');
  },

  closeMenu() {
    toggle(this._getListToggleIcon(), 'chevron-down');
    return this._getListContainer().removeClass(this.__containerOpenClass);
  },

  openMenu() {
    toggle(this._getListToggleIcon(), 'chevron-up');
    return this._getListContainer().addClass(this.__containerOpenClass);
  },

  isMenuOpen() {
    return this._getListContainer().hasClass(this.__containerOpenClass);
  },

  toggleMenu(event) {
    event.preventDefault();

    if (this.isMenuOpen()) {
      this.closeMenu();
    } else {
      this.openMenu();
    }

    return this;
  },

  initialize(options) {
    this.options = options;
    this.__containerOpenClass = 'sub-navigation__list-container--open';
    this.columns = [];
    this.listenTo(this.collection, 'sync', this.render);
    return this.render();
  },

  setTitle(title) {
    this.$el
      .find('.sub-navigation__title')
        .children('span')
          .text(title);

    return this;
  },

  render() {
    this.$el.html(this.template({
      this,
      icon,
    }));

    this.collection.models.forEach(model => {
      const options = {
        application: this.options.application,
        _router: this.options._router,
        model,
        slug: this.collection.options.slug,
        subnav: this,
      };

      const view = new SubNavigationColumn(options);
      this.columns.push(view);
      view.$el.appendTo(this.$el.find('.sub-navigation__list-container'));
    });

    // open menu by default on bigger screens
    if ($(window).width() > 768) {
      this.openMenu();
    }

    return this;
  },

  template: _.template(`
    <button class="sub-navigation__title"
            data-module="toggle">
      <span></span>
      <%= icon('chevron-down', 'sub-navigation__toggle-icon') %>
    </button>
    <div class="sub-navigation__list-container"></div>
  `),
});
