export default Backbone.Model.extend({
  defaults: {
    tileLayer: 'https://api.mapbox.com/styles/v1/tazde/cj1maj4mm001z2slpd3qgudyc/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGF6ZGUiLCJhIjoiY2l6OGt6aHR0MDAybTJxbnYxMXc1OWtxayJ9.wMcn343eMnTSJ806fZNihg',

    mapOptions: {
      attributionControl: false,
      scrollWheelZoom: false,
      zoomControl: false,
      doubleClickZoom: false,
      touchZoom: false,
      tap: false,
    },

    view: [25.36, 17],

    zoom: 3,
  },
});
