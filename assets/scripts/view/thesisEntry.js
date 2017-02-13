import _ from 'underscore';
import $ from 'jquery';
import ChartHDIView from 'view/chart-migration-hdi';
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
          i18n: this.options.i18n,
          countries: [
            'sn',
          ],
        }));
        break;

      case 'remittances':
        let charts = [];

        [
          'eg',
          'dz',
          'et',
          'bj',
          'bf',
          'dj',
          'ci',
          'gm',
          'gh',
          'gn',
          'cm',
          'cv',
          'ke',
          'ml',
          'ma',
          'ne',
          'ng',
          'sn',
          'sd',
          'ug',
        ].forEach(country => views.push(
          new RemittancesView({
            api: this.options.api,
            i18n: this.options.i18n,
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
        label: this.options.i18n.load('Remittances'),
        color: 'rgb(128, 127, 128)',
      },

      {
        label: this.options.i18n.load('International aid'),
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
      const $wrapper = $('<div/>');

      $container.append($color, $label);
      $wrapper.append($container);
      this.$el.find('.thesis__chart').append($wrapper);
    })
  },

  render() {
    this.$el.html(this.template({
      this,
      suffix: this.options.i18n.load('Thesis'),
    }));

    if (this.model.has('diagramType')) {
      this.renderChart();
    }

    return this;
  },

  template: _.template(`
    <h2 class="thesis__item-title">
      <span class="thesis__item-count">
        <%= suffix %> <%= this.model.get('count') %>
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
