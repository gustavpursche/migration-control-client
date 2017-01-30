import _ from 'underscore';
import $ from 'jquery';
import Backbone from 'backbone';

export default Backbone.Collection.extend({
  initialize(data, options) {
    this.options = options;
    return this;
  },

  load() {
    return this.options.api.fetch('countriesoverview')
      .then(data => {
        const promises = [];

        _.forEach(data, item => {
          _.forEach(item.entries, overviewCountry => {
            const promise = this.options.api.fetch(`country/${overviewCountry.id}`)
              .then(country => {
                if (country.isDonorCountry === false) {
                  const attrs = country;
                  attrs.map = this.options.map;
                  this.add(attrs);
                }
              });

            promises.push(promise);
          });
        });

        return $.when.apply($, promises)
          .then(data => {
            this.trigger('sync');
            return data;
          });
      });
  },

  setYear(year) {
    this.models.forEach(model => {
      model.set({
        year,
      });
    });
  },

  _getDataRange(type) {
    let max = 0;
    let min;

    this.models.forEach(country => {
      const data = country.get('data');
      const dataSet = data[type] || {};

      _.forEach(dataSet, item => {
        const value = _.values(item)[0];

        if (!min) {
          min = value
        } else if (value < min) {
          min = value;
        }

        if (value > max) {
          max = value;
        }
      });
    });

    return [
      min,
      max,
    ];
  },

  getStartYear(type) {
    return this._getYearByLimiter('min', type);
  },

  getEndYear(type) {
    return this._getYearByLimiter('max', type);
  },

  _getYearByLimiter(limiter, type) {
    const years = this.models.map(model => {
      const data = model.get('data');
      return _.map(data[type], item => parseInt(_.keys(item)[0], 10));
    });

    return _[limiter](_.flatten(years));
  }
});
