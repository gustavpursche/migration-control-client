import _ from 'underscore';
import $ from 'jquery';
import Background from 'model/background';
import BaseView from 'view/background-base';
import {toggle} from 'lib/icon';
import {setPageTitle} from 'lib/title';

export default BaseView.extend({
  events: {
    'click [data-module="treaties-toggle"]': 'toggleTreaties',
  },

  toggleTreaties(event) {
    event.preventDefault();

    const $eventTarget = $(event.target);
    const $target = $eventTarget.next();
    const $icon = $eventTarget.children('.treaties__country-toggle-icon');

    if (this.isTreatyOpen($target)) {
      this.closeTreaty($target, $icon);
    } else {
      this.openTreaty($target, $icon);
    }
  },

  openTreaty($treaty, $icon) {
    toggle($icon, 'chevron-up');
    return $treaty.addClass('treaties__item-treaties--open');
  },

  closeTreaty($treaty, $icon) {
    toggle($icon, 'chevron-down');
    return $treaty.removeClass('treaties__item-treaties--open');
  },

  isTreatyOpen($treaty) {
    return $treaty.hasClass('treaties__item-treaties--open');
  },

  template: _.template(`
    <div class="app__content">
      <div class="article">
        <% if (model.get('headline')) { %>
          <h1 class="article__title">
            <%= model.get('headline') %>
          </h1>
        <% } %>

        <% if (model.get('lead')) { %>
          <p class="article__lead">
            <%= model.get('lead') %>
          </p>
        <% } %>

        <% if (model.get('corpus')) { %>
          <div class="article__corpus article__corpus--open">
            <%= model.get('corpus') %>

            <% if (model.get('authors')) { %>
              <small class="article__authors-container">
                <strong>
                  <%= i18n.load('Authors') %>:
                </strong>
                <%= renderAuthors(model.get('authors')) %>
              </small>
            <% } %>
          </div>
        <% } %>

        <% if (model.get('treaties')) { %>
          <h2 class="visually-hidden">
            <%= i18n.load('Treaties') %>
          </h2>
          <%= renderTreatyList(model.get('treaties')) %>
        <% } %>
      </div>
    </div>
  `),

  initialize(options) {
    const slug = options.application.get('entry');

    options.api.findBackgroundBySlug(slug)
      .then(background => {
        this.model = new Background(background);
        setPageTitle(this.model.get('headline'));
        this.render();
      });

    return BaseView.prototype.initialize.call(this, options);
  },
});
