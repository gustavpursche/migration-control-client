import _ from 'underscore';
import $ from 'jquery';
import L from 'leaflet';
import LayerControl from 'view/map-layer-control';
import MapModel from 'model/map';

export default Backbone.View.extend({
  className: 'map',

  initialize(options) {
    this.options = options;
    this.model = new MapModel();

    // handle global map-hidden/ map-visible state
    this.listenTo(this.options.application, 'change:map-shown', (model, value) => {
      return value === true ? this.show() : this.hide();
    });

    return this;
  },

  events: {
    'click [data-module="page"]': 'navigateTo',
  },

  navigateTo(event) {
    if (event) {
      event.preventDefault();
    }

    const $target = $(event.target);
    const href = $target.attr('href');

    this.options._router.navigate(href, {trigger: true});
  },

  createMap() {
    const options = this.model.get('mapOptions');
    const tileLayer = this.model.get('tileLayer');
    const tileOptions = this.model.get('tileLayerOptions');
    const attribution = L.control.attribution();
    const view = this.model.get('view');
    let zoom = this.model.get('zoom');
    const targetContainer = this.$el.find('.map__container').get(0);

    const map = L.map(targetContainer, options);

    L.tileLayer(tileLayer, tileOptions).addTo(map);

    attribution
    .setPrefix('')
    .addTo(map);

    $(attribution.getContainer())
      .parent()
      .addClass('map__attribution');

    if ($(window).width() > 768) {
      zoom = 4;
    }

    map
    .setView(view)
    .setZoom(zoom);

    setTimeout(() => map.invalidateSize(), 10);

    return map;
  },

  render() {
    this.$el.html(this.template());
    this.map = this.createMap();

    this.layerControl = new LayerControl(Object.assign(this.options, {
      map: this.map,
    }));

    this.layerControl.$el.appendTo(this.$el);

    return this;
  },

  show() {
    this.options.application.set('map-shown', true);
    this.$el.removeClass('map--hidden');
  },

  hide() {
    this.options.application.set('map-shown', false);
    this.$el.addClass('map--hidden');
  },

  template: _.template(`
    <div class="map__container"></div>
  `),
});
