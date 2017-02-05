import BaseCollection from 'collection/map-base';
import Country from 'model/map-country-intensity';

export default BaseCollection.extend({
  model: Country,

  initialize(data, options) {
    this._cache = {};

    const dataType = 'migrationIntensity';

    this.on('sync', () => {
      this.models.forEach(model => {
        const layerScale = this._getDataRange(dataType);
        const year = this.getEndYear(dataType);

        if (model.getData(dataType).length > 0) {
          model.set({layerScale, year});
        }
      });
    });

    return BaseCollection.prototype.initialize.call(this, data, options);
  },
});
