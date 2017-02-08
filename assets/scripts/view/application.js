import _ from 'underscore';
import $ from 'jquery';
import API from 'lib/api';
import ApplicationModel from 'model/application';
import BackgroundView from 'view/background';
import BackgroundEntryView from 'view/background-entry';
import CountriesView from 'view/countries';
import CountriesEntryView from 'view/countries-entry';
import Footer from 'view/footer';
import HeaderView from 'view/header';
import IntroVideo from 'view/intro-video';
import MapView from 'view/map';
import i18n from 'lib/i18n';
import NavigationView from 'view/navigation';
import PagesView from 'view/pages';
import PagesEntryView from 'view/pages-entry';
import SubNavigationCollection from 'collection/sub-navigation';
import SubNavigation from 'view/sub-navigation';
import ThesisView from 'view/thesis';
import WebFont from 'webfontloader';

export default Backbone.View.extend({
  className: 'app',

  initialize(options) {
    this.model = new ApplicationModel();

    this._globalCtx = {
      application: this.model,
      _router: options._router,
      api: new API({
        application: this.model,
      }),
    };

    this.views = {
      _header: new HeaderView(this._globalCtx),
      _navigation: new NavigationView(this._globalCtx),
      _map: new MapView(this._globalCtx),
      _footer: new Footer(this._globalCtx),
      _video: new IntroVideo(this._globalCtx),

      index: ThesisView,
      background: BackgroundView,
      background_entry: BackgroundEntryView,
      countries: CountriesView,
      countries_entry: CountriesEntryView,
      pages: PagesView,
      pages_entry: PagesEntryView,
    };

    this.listenTo(this.model, 'change:language', () => this.render('complete'));

    this.listenTo(this.model, 'change:slug change:entry', () => {
      let type = 'content';

      if (this.model.get('firstBuild') === false) {
        type = 'complete';
      }

      this.render(type);
    });

    // handle global map-hidden/ map-visible state
    this.listenTo(this.model, 'change:slug', (model, slug) => {
      return this.model.set('map-shown', slug === 'index');
    });

    this.loadWebfonts();
  },

  loadWebfonts() {
    WebFont.load({
      custom: {
        families: [
          'TisaPro',
        ],
        urls: [
          '/dist/styles/fonts.css',
        ]
      },

      classes: false,
      events: false,
    });
  },

  getViewName(slug, entry) {
    let viewName = slug;

    if (!viewName) {
      viewName = 'index';
    }

    if (entry) {
      viewName += '_entry';
    }

    return viewName;
  },

  buildInterface() {
    ['navigation', 'map', 'header',].forEach(item => {
      this.views[`_${item}`].render().$el.prependTo(this.$el);
    });

    this.views._video.render().$el.prependTo(this.$el);
    this.views._footer.render().$el.appendTo(this.$el);

    return this;
  },

  buildSubnav(view) {
    const activeSubnav = this.model.get('subnav');
    let resourceChange = false;
    const destroySubnav = (subnav) => {
      if (!subnav) {
        return;
      }

      subnav.remove();
      this.model.set('subnav', undefined);
    };

    if (!view.subnav) {
      destroySubnav(activeSubnav);
      return this;
    }

    /* Rebuild, if the view-resource has changed, e.g. going from background
       to country */
    if (activeSubnav) {
      resourceChange = view.subnav !== activeSubnav.collection.options.slug;

      if (resourceChange) {
        destroySubnav(activeSubnav);
      }
    }

    if (!activeSubnav || (activeSubnav && resourceChange)) {
      const collection = new SubNavigationCollection([], {
        api: this._globalCtx.api,
        slug: view.subnav,
      });
      const options = Object.assign({collection}, this._globalCtx);
      const subnav = new SubNavigation(options);
      const $target = this.$el.find('.app__subnav-container');

      this.model.set('subnav', subnav);
      subnav.$el.appendTo($target);
    }

    return this;
  },

  render(type = 'complete') {
    const slug = i18n(this.model.get('slug'), 'en');
    const entry = this.model.get('entry');
    const viewName = this.getViewName(slug, entry);
    const activeView = this.model.get('activeView');

    /* destroy dynamic view */
    if (activeView) {
      activeView.remove();
      this.model.set('activeView', undefined);
    }

    /* build interface */
    if (type === 'complete') {
      this.$el.html(this.template());
      this.buildInterface();
      this.model.set({firstBuild: true});
      this.$el.prependTo('body');
    }

    /* build content view */
    const view = new this.views[viewName](this._globalCtx);
    const $target = this.$el.find('.app__main');
    this.model.set('activeView', view);
    view.$el.appendTo($target);

    /* build content subnavigation */
    this.buildSubnav(view);

    return this;
  },

  template: _.template(`
    <main class="app__main">
      <div class="app__content">
        <div class="app__subnav-container"></div>
      </div>
    </main>
  `),
});
