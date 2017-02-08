import _ from 'underscore';
import $ from 'jquery';
import Backbone from 'backbone';
import Chart from 'view/chart';
import i18n from 'lib/i18n';

const YEAR = 2014;

export default Chart.extend({
  className: 'chart',

  type: 'payment',

  renderChart(data) {
    if (!data || data.length === 0) {
      return;
    }

    const c3Options = {
      axis: {
        x: {
          type: 'category',
          categories: _.map(data, country => country.name),
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
          [i18n('Human Development Index') + ' (' + YEAR + ')'],
          [i18n('EU Money') + ' (' + YEAR + ')'],
        ],
        type: 'bar'
      },

      bar: {
        width: {
          ratio: .5,
        }
      },

      color: {
        pattern: [
          'rgb(128, 127, 128)',
          'rgb(255, 253, 56)',
        ],
      }
    };

    data.forEach(country => {
      country.data.hdi.forEach(item => {
        if (_.keys(item)[0] == YEAR) {
          c3Options.data.columns[0].push(_.values(item)[0]);
        }
      });

      country.data.oda.forEach(item => {
        if (_.keys(item)[0] == YEAR) {
          c3Options.data.columns[1].push(_.values(item)[0]);
        }
      });
    });

    c3Options.data.axes[c3Options.data.columns[0][0]] = 'y';
    c3Options.data.axes[c3Options.data.columns[1][0]] = 'y2';

    return this.buildChart(c3Options);
  },
});
