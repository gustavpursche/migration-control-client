import _ from 'underscore';
import $ from 'jquery';
import Chart from 'view/chart';
import i18n from 'lib/i18n';

export default Chart.extend({
  className: 'chart',

  type: 'hdi',

  renderChart(data) {
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
          [i18n('EU Money')],
        ],
        types: {},
      },
      color: {
        pattern: [
          'rgb(51, 51, 51)',
          'rgb(255, 253, 56)',
        ],
      }
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

    return this.buildChart(c3Options);
  },

});
