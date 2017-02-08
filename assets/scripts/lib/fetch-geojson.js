import $ from 'jquery';
import i18n from 'lib/i18n';
import limax from 'limax';

export function fetchGeoData(countryName) {
  if (!countryName) {
    return $.Deferred().resolve();
  }

  const slug = limax(countryName);
  // TODO: make language dynamic
  const translatedSlug = i18n(slug, 'de');

  return $.getJSON(`/data/geo/${translatedSlug}.geojson`);
};
