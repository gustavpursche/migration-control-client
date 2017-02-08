import _ from 'underscore';
import $ from 'jquery';
import Chart from 'view/chart';
import i18n from 'lib/i18n';

export default Chart.extend({
  className: 'chart',

  type: 'hdi',

  renderChart(data) {
    if (!data || data.length === 0) {
      return;
    }

    const c3Options = {
      axis: {
        x: {
          type: 'category',
          categories: [],
        },
        y: {
          show: true,
        },
        y2: {
          show: true,
        },
      },
      bindto: this.$el.get(0),
      data: {
        axes: {},
        columns: [
          [i18n('Migrationintensity')],
          [i18n('Payments from EU countries')],
        ],
        types: {},
      },
      color: {
        pattern: [
          'rgb(128, 127, 128)',
          'rgb(255, 253, 56)',
        ],
      },
      tooltip: {
        format: {
          value: function (value, ratio, id) {
            if (id === i18n('Payments from EU countries')) {
              const dollar = (Math.round(value * 100)/100).toFixed(2);
              const label = i18n('Dollar per capita');
              return  `${dollar} ${label}`;
            }

            return value;
          }
        }
      },
      legend: {
        show: false,
      },
    };

    data.forEach(country => {
      country.data.migrationIntensity.forEach(item => {
        c3Options.axis.x.categories.push(_.keys(item)[0]);
        c3Options.data.columns[0].push(_.values(item)[0]);
      });

      country.data.oda.forEach(item => {
        c3Options.data.columns[1].push(_.values(item)[0]);
      });
    });

    c3Options.data.axes[c3Options.data.columns[0][0]] = 'y';
    c3Options.data.axes[c3Options.data.columns[1][0]] = 'y2';

    c3Options.data.types[c3Options.data.columns[0][0]] = 'area-spline';
    c3Options.data.types[c3Options.data.columns[1][0]] = 'area-spline';

    this.chart = this.buildChart(c3Options);

    /* custom label */
    const selection = d3.select(this.$el.eq(0).parent().get(0))
      .selectAll('span')
      .data([
        i18n('Migrationintensity'),
        i18n('Payments from EU countries')
      ])
        .enter();

    const label = selection.append('span').attr('class', 'chart__label');

    label
      .append('span')
        .attr('class', 'chart__label-color')
        .attr('style', id => `background-color: ${this.chart.color(id)}`);

    label
      .append('span')
        .attr('class', 'chart__label-text')
        .html(id => id);

    return this.chart;
  },

});
