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
    this.listenTo(this.model, 'change:active', () => this.render());

    // initialize the slider
    this.listenTo(this.options.collection, 'sync', () => {
      if (this.model.get('key') === 'detentionCenter') {
        return;
      }

      const key = this.model.get('key');
      const min = this.collection.getStartYear(key);
      const max = this.collection.getEndYear(key);

      this.slider = new SliderView({
        min: min,
        max: max,
        value: max,
      });

      // set initial year
      this.collection.setYear(this.slider.model.get('value'));

      // listen for year changes
      this.listenTo(this.slider.model, 'change:value', (model, value) => {
        this.collection.setYear(value);
      });

      this.render();
    });

    if (this.model.get('active')) {
      this.addLayer();
    }

    return this.render();
  },

  renderScale() {
    if (!this.collection.models || !this.collection.models.length > 0) {
      return this;
    }

    const range = this.collection.models[0].getRange();
    let ticks = 5;

    if (!range) {
      return;
    }

    return range.ticks(ticks);
  },

  render() {
    this.$el.html(this.template({
      i18n,
      key: this.model.get('key'),
      active: this.model.get('active'),
      scale: this.renderScale(),
    }));

    if (this.model.get('active') && this.model.get('key') !== 'detentionCenter') {
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
    return this.collection.load()
      .then(() => {
        this.collection.models.forEach(model => {
          model.addLayer();
        });
      });
  },

  removeLayer() {
    this.collection.models.forEach(model => {
      model.removeLayer();
    });

    return this;
  },

  template: _.template(`
    <label class="layer-control__item-title <% if (active) { %> layer-control__item-title--active <% }%>">
      <input type="radio"
             name="layer-control"
             value="<%= key %>"
             <% if (active) { %> selected <% }%> />

      <%= i18n(this.model.get('key')) %>
    </label>

    <% if (active && scale && _.isArray(scale)) { %>
      <div class="layer-control__scale">
        <% if (key === 'singlePayments') { %>
          <span class="layer-control__scale-label layer-control__scale-label--min">
            0.5 Mio.
          </span>

          <% _.each(scale, function(value) { %>
            <div class="layer-control__scale-item layer-control__scale-item--singlePayments"
                 style="width: <%= value/2000 %>rem; height: <%= value/2000 %>rem;">
              <span class="visually-hidden">
                <%= value %>
              </span>
            </div>
          <% }) %>

          <span class="layer-control__scale-label layer-control__scale-label--max">
            <%= _.max(scale) %> Mio.
          </span>
        <% } %>

        <% if (key === 'migrationIntensity') { %>
          <span class="layer-control__scale-label layer-control__scale-label--min">
            <%= _.min(scale) %>
          </span>

          <% _.each(scale, function(value) { %>
            <div class="layer-control__scale-item layer-control__scale-item--migrationIntensity"
                 style="opacity: <%= value/_.max(scale) %>">
              <span class="visually-hidden">
                <%= value %>
              </span>
            </div>
          <% }) %>

          <span class="layer-control__scale-label layer-control__scale-label--max">
            <%= _.max(scale) %>
          </span>

        <% } %>
      </div>
    <% } %>
  `),
});
