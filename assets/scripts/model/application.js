export default Backbone.Model.extend({
  defaults: {
    firstBuild: false,
    language: 'de',
    slug: '',
    entry: '',
    'map-shown': true,
    slugChanges: 0,
  },
});
