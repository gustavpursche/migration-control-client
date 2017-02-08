import _ from 'underscore';
import $ from 'jquery';
import ChartHDIView from 'view/chart-migration-hdi';
import ChartPaymentView from 'view/chart-payment';
import i18n from 'lib/i18n';
import RemittancesView from 'view/chart-remittances';
import ThesisCollection from 'collection/thesis';

export default Backbone.View.extend({
  className: 'thesis__item',

  renderChart() {
    let views = [];

    switch (this.model.get('diagramType')) {
      case 'payments':
        views.push(new ChartHDIView({
          api: this.options.api,
          countries: [
            'Senegal',
          ],
        }));
        break;

      case 'hdi':
        views.push(new ChartPaymentView({
          api: this.options.api,
          countries: [
            'Südsudan',
            'Tschad',
            //'Tunesien',
            'Marokko',
            'Kap Verde',
          ],
        }));
        break;

      case 'remittances':
        let charts = [];

        [
          'Ägpten',
          'Algerien',
          'Äthiopien',
          'Benin',
          'Burkina Faso',
          'Dschibuti',
          'Elfenbeinküste',
          'Gambia',
          'Ghana',
          'Guinea',
          'Kamerun',
          'Kap Verde',
          'Kenia',
          'Mali',
          'Marokko',
          'Niger',
          'Nigeria',
          'Senegal',
          'Sierra Leone',
          'Sudan',
          'Uganda'
        ].forEach(country => views.push(
          new RemittancesView({
            api: this.options.api,
            countries: [
              country,
            ]
          })
        ));
        break;
    }

    if (views.length > 0) {
      const $target = this.$el.find('.thesis__chart');
      views.forEach(view => view.$el.appendTo($target));

      if (this.model.get('diagramType') === 'remittances') {
        this.addRemittancesLabels();
      }
    }

    return this;
  },

  initialize(options) {
    this.options = options;
    return this;
  },

  addRemittancesLabels(chart) {
    [
      {
        label: i18n('Remittances'),
        color: 'rgb(128, 127, 128)',
      },

      {
        label: i18n('International aid'),
        color: 'rgb(255, 253, 56)',
      },
    ].forEach(item => {
      const $color = $('<span />')
                      .addClass('chart__label-color')
                      .css('background-color', item.color);
      const $label = $('<span />')
                      .addClass('chart__label-text')
                      .text(item.label);
      const $container = $('<span />')
                          .addClass('chart__label');

      $container.append($color, $label);
      this.$el.find('.thesis__chart').append($container);
    })
  },

  render() {
    this.$el.html(this.template({
      this,
      i18n,
    }));

    if (this.model.has('diagramType')) {
      this.renderChart();
    }

    return this;
  },

  template: _.template(`
    <h2 class="thesis__item-title">
      <span class="thesis__item-count">
        <%= i18n('Thesis') %> <%= this.model.get('count') %>
        <span class="visually-hidden">:</span>
      </span>

      <%= this.model.get('name') %>
    </h2>

    <% if (this.model.get('diagramType')) { %>
      <div class="thesis__chart"></div>
    <% } else if (this.model.get('imageUrl')) { %>
      <img src="<%= this.model.get('imageUrl') %>"
           class="fluid-image thesis__image" />
    <% } %>

    <p class="thesis__item-text">
      <%= this.model.get('text') %>
    </p>

    <% if (this.model.get('contextualisation')) { %>
      <p class="thesis__item-text">
        <%= this.model.get('contextualisation') %>
      </p>
    <% } %>

    <% if (this.model.get('sourceinfo')) { %>
      <p class="thesis__item-context">
        <%= this.model.get('sourceinfo') %>
      </p>
    <% } %>
  `),
});
