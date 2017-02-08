import _ from 'underscore';
import $ from 'jquery';
import d3 from 'd3';
import Chart from 'view/chart';
import i18n from 'lib/i18n';

const YEAR = 2014;

export default Chart.extend({
  className: 'chart',

  type: 'remittances',

  renderChart(data) {
    if (!data || data.length === 0) {
      return;
    }

    const c3Options = {
      bindto: this.$el.get(0),
      data: {
        columns: [
          [i18n('Remittances')],
          [i18n('International aid')],
        ],
        type : 'pie',
      },
      color: {
        pattern: [
          'rgb(128, 127, 128)',
          'rgb(255, 253, 56)',
        ],
      },
      legend: {
        show: false,
      },
      size: {
        height: 80,
      },
      pie: {
        label: {
          show: false,
        },
      },
      tooltip: {
        format: {
          value: function (value, ratio, id) {
            const dollar = (Math.round(value * 100)/100).toFixed(2);
            return `${dollar} i18n('Dollar per capita')`;
          }
        }
      },
    };

    data.forEach(country => {
      country.data.remittances.forEach(item => {
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

    this.chart = this.buildChart(c3Options);

    /* custom label */
    d3.select(this.$el.get(0))
      .insert('p')
        .attr('class', 'country-legend')
        .html(id => {
          return data[0].name;
        });

    return this.chart;
  },

});
