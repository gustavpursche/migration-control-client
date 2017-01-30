import _ from 'underscore';
import Backbone from 'backbone';
import i18n from 'lib/i18n';
import MapControlItem from 'model/map-layer-control-entry';
import SliderView from 'view/slider';

export default Backbone.View.extend({
  className: 'layer-control__item',

  tagName: 'li',

  initialize(options) {
    this.options = options;
    this.model = new MapControlItem(options);
    this.listenTo(this.model, 'change:active', this.render);
    this.listenTo(this.options.collection, 'sync', () => this.addSlider());

    if (this.isActive()) {
      this.addLayer();
    }

    return this.render();
  },

  isDetentionCenter() {
    return this.model.get('key') === 'detentionCenter';
  },

  isActive() {
    return this.model.get('active') === true;
  },

  addSlider() {
    if (this.isDetentionCenter()) {
      return;
    }

    // cleanup previously created sliders
    if (this.slider) {
      this.slider.remove();
    }

    const key = this.model.get('key');
    const min = this.collection.getStartYear(key);
    const max = this.collection.getEndYear(key);

    this.slider = new SliderView({
      min,
      max,
      value: max,
    });

    // set initial year
    this.collection.setYear(max);

    // listen for year changes
    this.listenTo(this.slider.model, 'change:value', (model, value) => {
      this.collection.setYear(value);
    });

    return this.render();
  },

  render() {
    this.$el.html(this.template({
      i18n,
      key: this.model.get('key'),
      active: this.model.get('active'),
      index: this.model.get('index'),
    }));

    this.$el.toggleClass('layer-control__item--active', this.isActive());

    if (this.isActive() && !this.isDetentionCenter()) {
      if (this.slider) {
        const sliderTarget = this.options.map.getContainer().parentNode;
        this.slider.render().$el.appendTo(sliderTarget);
      }
    } else if (this.slider) {
      this.slider.remove();
    }

    return this;
  },

  addLayer() {
    this.model.set('active', true);
    return this.collection.load()
      .then(() => this.collection.models.forEach(model => model.addLayer()));
  },

  removeLayer() {
    this.model.set('active', false);
    this.collection.models.forEach(model => model.removeLayer());
    return this;
  },

  template: _.template(`
    <label class="layer-control__item-title">
      <input type="radio"
             name="layer-control"
             value="<%= key %>"
             <% if (active) { %> selected <% }%> />

      <span class="layer-control__item-index">
        <%= index %>
      </span>

      <%= i18n(this.model.get('key')) %>
    </label>
  `),
});
