export default Backbone.Model.extend({
  defaults: {
    tileLayer: 'https://cartocdn-ashbu.global.ssl.fastly.net/migrationskontrolle/api/v1/map/a4a2bc7ec0f1a17022631b4ddbc94823:1481771515861/0,1,2/{z}/{x}/{y}.png?api_key=c504dfadacd341caffd425b61c0266e0ccfeeeb2',

    mapOptions: {
      attributionControl: false,
      scrollWheelZoom: false,
      zoomControl: false,
      doubleClickZoom: false,
    },

    view: [25.36, 17],

    zoom: 4,
  },
});
