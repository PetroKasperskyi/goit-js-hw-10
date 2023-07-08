import { getBreeds, getCatByBreed } from './cat-api.js';
import Notiflix from 'notiflix';
import 'notiflix/src/notiflix.css';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';

Notiflix.Notify.init({
  position: 'center-top',
  distance: '40px',
  timeout: 360,
});

let eventError = false;

const refs = {
  select: document.querySelector('.breed-select'),
  divData: document.querySelector('.cat-info'),
};

startLoading(refs.select);
getBreeds()
  .then(data => {
    if (!data.length) throw new Error('Data not found');
    return data.reduce(
      (markup, currentEl) => markup + createElement(currentEl),
      ''
    );
  })
  .then(update)
  .catch(onError)
  .finally(endLoading);

refs.select.addEventListener('change', onSelect);

function createElement({ id, name }) {
  return `<option data-placeholder="true"></option>;
  <option value="${id}">${name || 'Unknown'}</option>`;
}

function update(markup) {
  refs.select.innerHTML = markup;
  new SlimSelect({
    select: refs.select,
    settings: {
      placeholderText: 'Select a breed',
    },
  });
  refs.select.classList.remove('invisible');
}

function onSelect(e) {
  startLoading(refs.divData);
  getCatByBreed(e.target.value)
    .then(data => {
      if (!data.length) throw new Error('Data not found');
      return data.reduce(
        (markup, currentEl) => markup + createEl(getArgs(currentEl)),
        ''
      );
    })
    .then(updateMarkup)
    .catch(onError)
    .finally(endLoading);
}

function createEl ({ url, name, description, temperament }) {
  return ` <img
      class="cat_image"
      src="${url}"
      alt="${name || 'Unknown'}"
    />
    <h2 class="title">${name || 'Unknown'}</h2>
    <p class="descr">${description || 'Unknown'}</p>
    <h3 class="sub-title">Temperament</h3>
    <p class="descr">${temperament || 'Unknown'}</p>
    `;
}

function updateMarkup(markup) {
  refs.divData.innerHTML = markup;
  refs.divData.classList.remove('invisible');
}

function getArgs({ url, breeds }) {
  const { name, description, temperament } = breeds[0];
  return {
    url,
    name,
    description,
    temperament,
  };
}

function startLoading(element) {
  if (eventError) afterError();
  element.classList.add('invisible');
  Notiflix.Loading.arrows('Loading data, please wait...', {
    backgroundColor: 'rgba(0,0,0,0.6)',
  });
}

function endLoading() {
  Notiflix.Loading.remove();
}

function onError(error) {
  eventError = true;
  Notiflix.Notify.failure(error.message);
}

function afterError() {
  const notify = document.querySelector('.notiflix-notify-failure');
  if (notify) notify.remove();
  eventError = false;
}
