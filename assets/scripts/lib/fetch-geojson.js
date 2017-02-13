import $ from 'jquery';
import limax from 'limax';

export function fetchGeoData(isoCode) {
  if (!isoCode || isoCode === 'ecowas') {
    return $.Deferred().resolve();
  }

  return $.getJSON(`/data/geo/${isoCode}.geojson`);
};
