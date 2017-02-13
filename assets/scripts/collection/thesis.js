import Base from 'collection/base';
import ThesisEntry from 'model/thesis';

export default Base.extend({
  model: ThesisEntry,

  initialize(data, options) {
    this.options = options;

    this.options.api.fetch('theses')
      .then(data => {
        data.forEach(item => this.add(item));
        this.trigger('sync');
      });

    return this;
  },
});
