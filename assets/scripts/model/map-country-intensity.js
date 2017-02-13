import $ from 'jquery';
import _ from 'underscore';
import d3 from 'd3';
import {fetchGeoData} from 'lib/fetch-geojson';
import limax from 'limax';
import MapContryBase from 'model/map-country-base';

export default MapContryBase.extend({
  defaults: {
    layerStyle: {
      stroke: true,
      color: 'rgb(36, 36, 38)',
      fill: true,
      fillColor: 'rgb(255, 253, 56)',
      fillOpacity: 1,
      opacity: 1,
      weight: 1,
    },
  },

  /* draw intensity layer */
  addLayer() {
    const countryCode = this.get('countryCode');

    return fetchGeoData(countryCode)
      .then(data => {
        if (!data) {
          return;
        }

        const style = this.get('layerStyle');
        const className = 'leaflet-country-overlay';
        const opts = Object.assign(style, {className});
        const layer = L.geoJson(data, opts);

        this.set({layer});
        this.updateLayer();

        return MapContryBase.prototype.addLayer.call(this);
      });
  },

  getScale(year) {
    const type = 'migrationIntensity';
    const range = this.getRange();
    const value = this._getDataValueForYear(type, year);

    if (!range) {
      return undefined;
    }

    return range(value);
  },

  /* set intensity for a single year */
  setLayerYear(year) {
    const layer = this.get('layer');
    let fillOpacity = this.getScale(year) || 0;

    if (layer) {
      layer.setStyle({fillOpacity})
    }

    return this;
  },
});
