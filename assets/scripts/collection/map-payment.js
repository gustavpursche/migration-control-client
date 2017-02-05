import _ from 'underscore';
import $ from 'jquery';
import BaseCollection from 'collection/map-base';
import Country from 'model/map-country-payment';

export default BaseCollection.extend({
  model: Country,

  initialize(data, options) {
    this.options = options;
    this._cache = {};

    const dataType = 'singlePayments';

    this.on('sync', () => {
      this.models.forEach(model => {
        const layerScale = this._getDataRange(dataType);
        const year = this.getEndYear(dataType);

        if (model.getData(dataType).length > 0) {
          model.set({layerScale, year});
        }
      });
    });

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
                if (country.data && country.data.singlePayments) {
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
});
