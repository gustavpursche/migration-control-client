import _ from 'underscore';
import Backbone from 'backbone';

export default Backbone.Collection.extend({
  initialize(data, options) {
    this.options = options;
    this._cache = {};

    if (this.dataType) {
      this.on('sync', () => {
        this.models.forEach(model => {
          const type = this.dataType;
          const layerScale = this._getDataRange(type);
          const year = this.getEndYear(type);

          if (model.getData(type).length > 0) {
            model.set({layerScale, year});
          }
        });
      });
    }

    return this;
  },

  setYear(year) {
    this.models.forEach(model => model.set({year}));
  },

  _getDataRange(type) {
    // if data was cached, just return it
    if (this._cache[`data-${type}`]) {
      return this._cache[`data-${type}`];
    }

    let values = this.models.map(country => {
      const data = country.getData(type);
      return data.map(item => _.values(item)[0]);
    });

    values = _.flatten(values);

    const min = _.min(values);
    const max = _.max(values);

    // cache results
    return this._cache[`data-${type}`] = [min, max];
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
      const dataSet = data[type] || [];
      return dataSet.map(item => parseInt(_.keys(item)[0], 10));
    });

    return _[limiter](_.flatten(years));
  }
});
