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
    const displayValue = $next.css('display');
    let currentText;

    if (displayValue === 'none') {
      $next.css('display', 'block');
    } else {
      $next.css('display', 'none');

      // calculate new position of toggle element and force scroll
      // see https://trello.com/c/pKUynkoZ/26-einklappen-button-erzeugt-springen
      setTimeout(() => {
        const updatedTopOffset = $target.offset().top;
        const offsetTop = 150;
        $(window).scrollTop(updatedTopOffset - offsetTop);
      }, 150);
    }

    currentText = $target.text();
    $target.text(toggleText);
  },

  template: _.template(`
    <h2 class="visually-hidden">
      <%= i18n.load('Introduction') %>
    </h2>

    <% if (this.model.attributes.finding) { %>
      <article class="article article--finding">
        <div class="app__content">
          <h2 class="countries__block-title countries__block-title--no-spacing">
            <%= i18n.load('Finding') %>
          </h2>

          <div class="countries__block">
            <h3 class="article__title">
              <%= this.model.getFinding('headline') %>
            </h3>

            <% if (this.model.attributes.finding.images) { %>
              <% _.forEach(this.model.attributes.finding.images, function(image) { %>
                <figure class="article__image">
                  <img src="<%= image.src %>"
                       alt="<%= image.alt %>"
                        class="fluid-image" />

                  <figcaption class="article__image-caption">
                    <%= image.caption %>

                    <% if (image.credit) { %>
                      <span class="article__image-credit">
                        <%= i18n.load('Photo') %>: <%= image.credit %>
                      </span>
                    <% } %>
                  </figcaption>
                </figure>
              <% }) %>
            <% } %>

            <p class="article__lead">
              <%= this.model.getFinding('lead') %>
            </p>

            <div class="article__corpus">
              <%= this.model.getFinding('corpus') %>

              <% if (this.model.getFinding('authors')) { %>
                <small class="features__item-authors-container">
                  <strong>
                    <%= i18n.load('Authors') %>:
                  </strong>
                  <%= renderAuthors(this.model.getFinding('authors')) %>
                </small>
              <% } %>
            </div>

            <button type="button"
                    data-module="read-more"
                    class="read-more"
                    data-toggle="<%= i18n.load('Show less') %>">
              <%= i18n.load('Read More') %>
            </button>

          </div>
        </div>
      </article>
    <% } %>

    <div class="app__content">
      <% if (this.model.getFeatures()) { %>
        <div class="countries__block">
          <h2 class="countries__block-title">
            <%= i18n.load('Features') %>
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
                          <%= i18n.load('Photo') %>: <%= image.credit %>
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
                        <%= i18n.load('Authors') %>:
                      </strong>
                      <%= renderAuthors(feature.authors) %>
                    </small>
                  <% } %>
                </div>

                <button type="button"
                        data-module="read-more"
                        class="read-more"
                        data-toggle="<%= i18n.load('Show less') %>">
                  <%= i18n.load('Read More') %>
                </button>
              </li>
            <% }); %>
          </ul>
        </div>
      <% } %>

      <% if (this.model.attributes.factSheet) { %>
        <div class="countries__block">
          <h2 class="countries__block-title">
            <%= i18n.load('Information') %>
          </h2>

          <dl class="facts">
            <% _.mapObject(this.model.attributes.factSheet, function(item, index) { %>
              <dt class="facts__term">
                <%= i18n.load(index) %>
              </dt>
              <dd class="facts__value">
                <% switch (index) {
                  case 'frontexCooperation':
                    if (item.state) {
                      print(i18n.load(item.state));
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
                      print(i18n.load('yes'));

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
          <%= i18n.load('Treaties') %>
        </h2>

        <%= renderCountryTreaties(this.model.attributes.treaties, true) %>
      <% } %>
    </div>
  `),

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
