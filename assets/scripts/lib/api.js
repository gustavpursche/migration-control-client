import $ from 'jquery';
import _ from 'underscore';
import limax from 'limax';

export default class API {
  constructor(options) {
    this.options = options;
    this.pending = {};
    this.store = {};

    const language = this.options.application.get('language');

    this.api = {
      host: '{{API_HOST}}',
      language,
      namespace: 'migrationcontrol',
      version: 'v1',
    };

    // update required language
    this.options.application.on('change:language', (model, value) => {
      this.api.language = value;
    });

    return this;
  }

  _buildAPIUrl(endpoint) {
    const {host, namespace, version, language} = this.api;
    return `${host}/${namespace}/${version}/${language}/${endpoint}/`;
  }

  fetch(endpoint) {
    const url = this._buildAPIUrl(endpoint);

    // send back the promise
    if (!!this.pending[url]) {
      return this.pending[url];
    }

    // send back the content
    if (!!this.store[url]) {
      return $.Deferred().resolve(this.store[url]);
    }

    return this.pending[url] = $.getJSON(url)
      .then(data => {
        this.store[url] = data;
        this.pending[url] = undefined;
        return data;
      });
  }

  findCountryById(id) {
    return this.fetch(`country/${id}`);
  }

  findBackgroundById(id) {
    return this.fetch(`background/${id}`);
  }

  findPageById(id) {
    return this.fetch(`imprint/${id}`);
  }

  findCountryBySlug(slug) {
    return this.fetch('countriesoverview')
      .then(data => {
        let id;

        _.forEach(data, item => {
          _.forEach(item.entries, country => {
            if (slug === limax(country.name)) {
              id = country.id;
            }
          })
        });

        return this.findCountryById(id);
      });
  }

  findBackgroundBySlug(slug) {
    return this.fetch('backgroundoverview')
      .then(data => {
        let id;

        _.forEach(data, item => {
          _.forEach(item.entries, background => {
            if (slug === limax(background.name)) {
              id = background.id;
            }
          })
        });

        return this.findBackgroundById(id);
      });
  }

  findPageBySlug(slug) {
    return this.fetch('imprint')
      .then(data => {
        let res;

        _.forEach(data, page => {
          if (slug === limax(page.name)) {
            res = page;
          }
        });

        return res;
      });
  }

  findCountryByName(name) {
    return this.fetch('countriesoverview')
      .then(data => {
        let id;

        _.forEach(data, item => {
          _.forEach(item.entries, country => {
            if (name === country.name) {
              id = country.id;
            }
          })
        });

        return this.findCountryById(id);
      });
  }

  findBackgroundByName(name) {
    return this.fetch('backgroundoverview')
      .then(data => {
        let id;

        _.forEach(data, item => {
          _.forEach(item.entries, background => {
            if (name === background.name) {
              id = background.id;
            }
          })
        });

        return this.findBackgroundById(id);
      });
  }

  findPageByName(name) {
    return this.fetch('imprint')
      .then(data => {
        let res;

        _.forEach(data, page => {
          if (name === page.name) {
            res = page;
          }
        });

        return res;
      });
  }
};

