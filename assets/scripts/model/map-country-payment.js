import $ from 'jquery';
import _ from 'underscore';
import d3 from 'd3';
import {fetchGeoData} from 'lib/fetch-geojson';
import L from 'leaflet';
import limax from 'limax';
import MapContryBase from 'model/map-country-base';

export default MapContryBase.extend({
  defaults: {
    layer: undefined,
    layerStyle: {
      stroke: false,
      fill: true,
      fillColor: 'rgb(255, 253, 56)',
      fillOpacity: .95,
    },
  },

  addLayer() {
    const countryCode = this.get('countryCode');

    return fetchGeoData(countryCode)
      .then(data => {
        if (!data) {
          return;
        }

        const geoJSON = L.geoJson(data);
        const center = geoJSON.getBounds().getCenter();
        const style = this.get('layerStyle');
        const radius = this.getRadius(this.get('year'));
        const layer = L.circleMarker(center, Object.assign(style, {radius}));
        const tooltip = L.tooltip({
          className: 'leaflet-payment-label',
          direction: 'center',
          permanent: true,
        });

        layer.bindTooltip(tooltip);
        this.set('layer', layer);
        this.updateLayer();

        return MapContryBase.prototype.addLayer.call(this);
      });
  },

  /* calculate radius for an oda bubble for a single year */
  getRadius(year) {
    const type = 'singlePayments';
    const windowWidth = $(window).width();
    let rangeValues = [20, 120];

    if (windowWidth > 768 ) {
      rangeValues = [25, 150];
    }

    const range = this.getRange(rangeValues);
    const value = this._getDataValueForYear(type, year);

    if (!value) {
      return 0;
    }

    return range(value);
  },

  getFontSize(type, year) {
    let titleRangeValue = [.7, 2.5];
    let unitRangeValue = [.4, .7];
    const windowWidth = $(window).width();

    if (windowWidth > 768) {
      titleRangeValue = [.9, 4];
      unitRangeValue = [.6, .8];
    }

    const scaling = type === 'unit' ? unitRangeValue : titleRangeValue;
    const range = this.getRange(scaling);
    const value = this._getDataValueForYear('singlePayments', year);
    return range(value);
  },

  getTooltipContent(year) {
    const title = this._getDataValueForYear('singlePayments', year);

    if (!title) {
      return false;
    }

    const titleFontSize = this.getFontSize('title', year);
    const unitFontSize = this.getFontSize('unit', year);

    const $title = $('<span/>')
                    .addClass('leaflet-payment-label__value')
                    .css('fontSize', `${titleFontSize}em`)
                    .text(title);
    const $unit = $('<span/>')
                    .addClass('leaflet-payment-label__unit')
                    .css('fontSize', `${unitFontSize}em`)
                    .text('Mio');

    $unit.appendTo($title);

    return $title.get(0);
  },

  /* update ODA layer */
  setLayerYear(year) {
    const layer = this.get('layer');

    if (!layer) {
      return this;
    }

    const content = this.getTooltipContent(year);
    const radius = this.getRadius(year);

    if (radius === 0 || content === false) {
      layer.setStyle({fillOpacity: 0});
      layer.closeTooltip();
      return this;
    }

    if (!layer.isTooltipOpen()) {
      layer.setStyle(this.get('layerStyle'));
      layer.openTooltip();
    }

    layer.setRadius(radius);
    layer.setTooltipContent(content);

    return this;
  },
});
