import _ from 'underscore';
import $ from 'jquery';
import {icon} from 'lib/icon';
import i18n from 'lib/i18n';

export default Backbone.View.extend({
  className: 'scroll-helper',

  initialize() {
    return this;
  },

  events: {
    'click [data-scroll-trigger]': 'scroll',
  },

  scroll(event) {
    event.preventDefault();

    const $target = $('.header');
    const targetOffset = $target.offset();

    $(window).scrollTop(targetOffset.top);
  },

  template: _.template(`
    <button class="scroll-helper_trigger"
            type="button"
            data-scroll-trigger>
      <%= icon('chevron-up', 'scroll-helper__icon') %>
      <span class="scroll-helper__label">
        <%= i18n('Scroll to top') %>
      </span>
    </button>
  `),

  render() {
    this.$el.html(this.template({
      icon,
      i18n,
    }))

    return this;
  },
});
