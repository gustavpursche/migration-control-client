import $ from 'jquery';
import _ from 'underscore';
import d3 from 'd3';
import i18n from 'lib/i18n';
import L from 'leaflet';
import limax from 'limax';

export default Backbone.Model.extend({
  defaults: {
    year: 2010,
    map: undefined,
    layer: undefined,
    data: {},
  },

  initialize() {
    this.on('change:year', (model, value) => this.updateLayer(value));
    return this;
  },

  getRange(range = [0, 1]) {
    const scale = this.get('layerScale');

    if (!scale) {
      return;
    }

    return d3.scale.linear().domain(scale).range(range);
  },

  /* get dataset for a single year */
  _getDataValueForYear(type, year) {
    const data = this.get('data');
    const scoped = data[type] || undefined;

    if (scoped === undefined || scoped.length === 0) {
      return;
    }

    const result = scoped.find(item => {
      if (item) {
        return Object.keys(item)[0] == year;
      }
    });

    if (result === undefined) {
      return;
    }

    return Object.values(result)[0];
  },

  getMap() {
    return this.get('map');
  },

  /* draw a layer on the map */
  addLayer() {
    const layer = this.get('layer');

    layer.addTo(this.getMap());
    return layer;
  },

  removeLayer() {
    const layer = this.get('layer');

    if (layer) {
      layer.removeFrom(this.getMap());
    }

    return layer;
  },
});
