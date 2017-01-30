import _ from 'underscore';
import {icon} from 'lib/icon';

const COUNTRY_TREATIES = _.template(`
  <% if (treaties) { %>
    <ul class="treaties__item-treaties
               <% if (open === true) { %> treaties__item-treaties--open <% } %>
    ">
      <% _.forEach(treaties, function(treaty) { %>
        <li class="treaties__item">
          <a href="<%= treaty.link %>"
             class="treaties__contract"
             target="_blank"
             rel="noopener noreferrer">
            <%= icon('file-text', 'treaties__contract-icon') %>
            <span class="treaties__contract-title">
              <%= treaty.name %> <%= treaty.country %> <% if(treaty.partner) { %>– <%= treaty.partner %> <% } %>
            </span>

            <% if (treaty.date) { %>
              <span class="treaties__contract-date">
                <% if (treaty.date.day) { %><%= treaty.date.day %>.<% } %><% if (treaty.date.month) { %><%= treaty.date.month %>.<% } %><% if (treaty.date.year) { %><%= treaty.date.year %><% } %>
              </span>
            <% } %>
          </a>
        </li>
      <% }) %>
    </ul>
  <% } %>
`)

const LIST_TREATIES = _.template(`
  <ul class="treaties">
    <% _.forEach(treaties, function(country, index) { %>
      <% if (country.treaties && country.treaties.length > 0) { %>
        <li class="treaties__country-item">
          <button data-module="treaties-toggle"
                  class="treaties__country">
            <%= country.country %>

            <% if (index === 0) { %>
              <%= icon('chevron-up', 'treaties__country-toggle-icon') %>
            <% } else { %>
              <%= icon('chevron-down', 'treaties__country-toggle-icon') %>
            <% } %>
          </button>

          <% if (index === 0) { %>
            <%= renderCountryTreaties(country.treaties, true) %>
          <% } else { %>
            <%= renderCountryTreaties(country.treaties) %>
          <% } %>
        </li>
      <% } %>
    <% }) %>
  </ul>
`);

export function renderCountryTreaties(treaties, open) {
  return COUNTRY_TREATIES({
    treaties,
    open,
    icon,
  });
};

export function renderTreatyList(treaties) {
  return LIST_TREATIES({
    treaties,
    renderCountryTreaties,
    icon,
  });
};
