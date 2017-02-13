import _ from 'underscore';
import Entry from 'view/thesisEntry';
import ThesisCollection from 'collection/thesis';
import {setPageTitle} from 'lib/title';

export default Backbone.View.extend({
  className: 'thesis',

  initialize(options) {
    this.options = options;

    this.collection = new ThesisCollection([], {
      api: this.options.api,
    });

    this.listenTo(this.collection, 'sync', this.render);

    setPageTitle(this.options.i18n.load('Theses'));

    return this;
  },

  render() {
    this.$el.html(this.template({
      title: this.options.i18n.load('Theses'),
    }));

    this.collection.forEach((model, index) => {
      const count = index + 1;
      model.set({count});

      const view = new Entry({
        api: this.options.api,
        i18n: this.options.i18n,
        model,
      });

      view.render().$el.appendTo(this.$el.children('.app__content'));
    });

    return this;
  },

  template: _.template(`
    <div class="app__content">
      <h1 class="visually-hidden">
        <%= title %>
      </h1>
    </div>
  `),
});
