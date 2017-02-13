import _ from 'underscore';
import $ from 'jquery';
import {icon} from 'lib/icon';
import Entry from 'view/footer-entry';
import FooterCollection from 'collection/footer';

export default Backbone.View.extend({
  tagName: 'footer',

  className: 'footer',

  events: {
    'click [data-module="link"]': 'navigateTo',
  },

  initialize(options) {
    this.options = options;
    this.collection = new FooterCollection([], this.options);
    this.listenTo(this.collection, 'sync', this.render);
    return this;
  },

  navigateTo(event) {
    if (event) {
      event.preventDefault();
    }

    const target = $(event.target).attr('href');
    this.options._router.navigate(target, {trigger: true});

    return this;
  },

  render() {
    this.$el.html(this.template({
      i18n: this.options.i18n.load,
      icon,
      language: this.options.application.get('language'),
    }));

    this.collection.models.forEach(model => {
      const options = Object.assign(this.options, {
        model,
      });
      const view = new Entry(options);
      view.$el.insertBefore(this.$el.find('.footer__list').children().eq(-1));
    });

    return this;
  },

  template: _.template(`
    <ul class="footer__list">
      <li class="footer__list-item">
        <a href="http://www.taz.de/"
           class="footer__item">
          <%= i18n('A project of') %>

          <span class="visually-hidden">
            <%= i18n('taz, the daily newspaper') %>
          </span>

          <%= icon('logo-taz', 'footer__taz-logo') %>
        </a>
      </li>

      <li class="footer__list-item">
        <a href="https://www.facebook.com/migcontrol/"
           class="sm-button">
          <span class="visually-hidden">
            <%= i18n('Follow on Facebook') %>
          </span>
          <%= icon('facebook', 'sm-button__logo') %>
        </a>

        <a href="https://twitter.com/MigControl"
           class="sm-button">
          <span class="visually-hidden">
            <%= i18n('Follow on Twitter') %>
          </span>
          <%= icon('twitter', 'sm-button__logo') %>
        </a>
      </li>
    </ul>
  `),
});
