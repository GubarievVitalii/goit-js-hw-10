import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import fetchCountries from './js/fetchCountries.js';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const countryEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(requestCountry, DEBOUNCE_DELAY));

function requestCountry(event) {
  const valueSearch = event.target.value.trim();
  if (!valueSearch) {
    countryEl.innerHTML = '';
    listEl.innerHTML = '';
    return;
  }
  fetchCountries(valueSearch)
    .then(data => {
      if (data.length > 10) {
        countryEl.innerHTML = '';
        listEl.innerHTML = '';
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      if (data.length >= 2 && data.length <= 10) {
        countryEl.innerHTML = '';
        const countryItems = data
          .map(({ name, flags }) => {
            return `<li>
    <img src="${flags.svg}" alt="flags" width=80px>
    <p>${name.official}</p>
    </li>`;
          })
          .join('');
        listEl.innerHTML = countryItems;
        return;
      }

      const { name, capital, population, flags, languages } = data[0];
      const infoCountry = `<img src="${flags.svg}" alt="flags" width=80px>
        <p>${name.official}</p>
        <p>capital: ${capital}</p>
        <p>population: ${population}</p>
        <p>languages: ${Object.values(languages).join(', ')}</p>`;

      listEl.innerHTML = '';
      countryEl.innerHTML = infoCountry;
    })
    .catch(error => {
      listEl.innerHTML = '';
      countryEl.innerHTML = '';
      Notiflix.Notify.failure(error);
    });
}
