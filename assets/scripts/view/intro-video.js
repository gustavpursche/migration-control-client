import _ from 'underscore';
import Backbone from 'backbone';
import i18n from 'lib/i18n';
import videojs from 'video.js';
import vimeo from 'videojs-youtube';

export default Backbone.View.extend({
  className: 'intro-video',

  initialize(options) {
    this.options = options;
    this.player = '';
    return this;
  },

  events: {
    'click [data-skip]': 'destroy',
  },

  destroy(event) {
    if (event) {
      event.preventDefault();
    }

    if (this.player) {
      this.player.dispose();
    }

    this.remove();
  },

  render() {
    this.$el.html(this.template({
      i18n,
    }));

    const options =  {
      autoplay: true,
      controls: false,
      muted: false,
      sources: [
        {
          type: 'video/youtube',
          src: 'https://www.youtube.com/watch?v=sOG3EhX6feY',
          youtube: {
            controls: '0',
            hd: '1',
            modestbranding: '1',
            title: '',
          }
        }
      ],
      techOrder: [
        'youtube',
      ],
    };

    this.player = videojs(this.$el.children('video').get(0), options);
    this.player.on('ended', () => this.destroy());

    return this;
  },

  template: _.template(`
    <video class="video-js"></video>
    <button class="intro-video__skip"
            data-skip>
      <%= i18n('Skip Video') %>
    </button>
  `),
});
