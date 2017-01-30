import _ from 'underscore';
import $ from 'jquery';
import Country from 'model/country';
import CountryBaseView from './country-base';
import {setPageTitle} from 'lib/title';

export default CountryBaseView.extend({
  events: {
    'click [data-module="read-more"]': 'readMore',
  },

  readMore(event) {
    event.preventDefault();

    const $target = $(event.currentTarget);
    const $next = $target.prev('.article__corpus, .features__item-corpus');
    const toggleText = $target.data('toggle');
    let currentText;

    if ($next.css('display') === 'none') {
      $next.css('display', 'block');
    } else {
      $next.css('display', 'none');
    }

    currentText = $target.text();
    $target.text(toggleText);
  },

  template: _.template(`
    <h2 class="visually-hidden">
      <%= i18n('Introduction') %>
    </h2>

    <div class="article">
      <% if (this.model.attributes.finding) { %>
        <div class="countries__block">
          <h3 class="article__title">
            <%= this.model.getFinding('headline') %>
          </h3>

          <p class="article__lead">
            <%= this.model.getFinding('lead') %>
          </p>

          <div class="article__corpus">
            <%= this.model.getFinding('corpus') %>

            <% if (this.model.getFinding('authors')) { %>
              <small class="features__item-authors-container">
                <strong>
                  <%= i18n('Authors') %>:
                </strong>
                <%= renderAuthors(this.model.getFinding('authors')) %>
              </small>
            <% } %>
          </div>

          <button type="button"
                  data-module="read-more"
                  class="read-more"
                  data-toggle="<%= i18n('Show less') %>">
            <%= i18n('Read More') %>
          </button>

        </div>
      <% } %>

      <% if (this.model.getFeatures()) { %>
        <div class="countries__block">
          <h2 class="countries__block-title">
            <%= i18n('Features') %>
          </h2>

          <ul class="features">
            <% _.forEach(this.model.getFeatures(), function(feature) { %>
              <li class="features__item">
                <h3 class="features__item-title">
                  <span class="features__item-title-dossier">
                    <%= feature.kicker %>
                  </span>

                  <%= feature.headline %>
                </h3>

                <% _.forEach(feature.images, function(image) { %>
                  <figure class="features__item-image">
                    <img src="<%= image.src %>"
                         alt="<%= image.alt %>"
                          class="fluid-image" />

                    <figcaption class="features__item-caption">
                      <%= image.caption %>

                      <% if (image.credit) { %>
                        <span class="features__item-credit">
                          <%= i18n('Photo') %>: <%= image.credit %>
                        </span>
                      <% } %>
                    </figcaption>
                  </figure>
                <% }) %>

                <p class="features__item-lead">
                  <%= feature.lead %>
                </p>

                <div class="features__item-corpus">
                  <%= feature.corpus %>

                  <% if (feature.authors) { %>
                    <small class="features__item-authors-container">
                      <strong>
                        <%= i18n('Authors') %>:
                      </strong>
                      <%= renderAuthors(feature.authors) %>
                    </small>
                  <% } %>
                </div>

                <button type="button"
                        data-module="read-more"
                        class="read-more"
                        data-toggle="<%= i18n('Show less') %>">
                  <%= i18n('Read More') %>
                </button>
              </li>
            <% }); %>
          </ul>
        </div>
      <% } %>

      <% if (this.model.attributes.factSheet) { %>
        <div class="countries__block">
          <h2 class="countries__block-title">
            <%= i18n('Information') %>
          </h2>

          <dl class="facts">
            <% _.mapObject(this.model.attributes.factSheet, function(item, index) { %>
              <dt class="facts__term">
                <%= i18n(index) %>
              </dt>
              <dd class="facts__value">
                <% switch (index) {
                  case 'frontexCooperation':
                    if (item.state) {
                      print(i18n(item.state));
                    }

                    if (item.description) {
                      print(', ' + item.description)
                    }
                    break;

                  case 'detentionCenter':
                    if (item.count !== -1) {
                      print(item.count);

                      if (item.description) {
                        print(', ' + item.description);
                      }
                    } else {
                      print('-');
                    }
                    break;

                  case 'countriesRepatriationAgreement':
                  case 'otherMigrationAgreements':
                    if (_.isArray(item)) {
                      print(item.join(', '));
                    } else if (item) {
                      print(item);
                    } else {
                      print('-');
                    }
                    break;

                  case 'departureLegality':
                    if (item.isIllegal === true) {
                      print(i18n('yes'));

                      if (item.description) {
                        print(', ' + item.description);
                      }
                    } else {
                      print('-');
                    }
                    break;

                  default:
                    if (item) {
                      print(item);
                    } else {
                      print('-');
                    }
                } %>
              </dd>
            <% }) %>
          </dl>
        </div>
      <% } %>

      <% if (this.model.attributes.treaties && this.model.attributes.treaties.length > 0) { %>
        <h2 class="countries__block-title">
          <%= i18n('Treaties') %>
        </h2>

        <%= renderCountryTreaties(this.model.attributes.treaties, true) %>
      <% } %>
    </div>
  `),

  scrollIntoView() {
    $('html').scrollTop(this.$el.offset().top - 120);
  },

  initialize(options) {
    const slug = options.application.get('entry');

    options.api.findCountryBySlug(slug)
      .then(country => {
        this.model = new Country(country);
        setPageTitle(this.model.get('name'));
        this.render();
      });

    return CountryBaseView.prototype.initialize.apply(this, [options]);
  },
});
