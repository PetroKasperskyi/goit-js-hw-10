const BASE_URL = 'https://api.thecatapi.com/v1';
const API_KEY =
  'live_UXMXgsEdKwFbMhsNEYdAlkGnoNXNHfYXJ1A7OQVm942ef8EsICVJhSaWXClODnDb';

function getBreeds() {
  const END_POINT = '/breeds';
  const PARAMS = new URLSearchParams({
    api_key: API_KEY,
  });
  return fetch(`${BASE_URL}${END_POINT}?${PARAMS}`).then(responce => {
    if (!responce.ok) {
      throw new Error(responce.status);
    }
    return responce.json();
  });
}

function getCatByBreed(breedId) {
  const END_POINT = '/images/search';
  const PARAMS = new URLSearchParams({
    api_key: API_KEY,
    breed_ids: breedId,
  });

  return fetch(`${BASE_URL}${END_POINT}?${PARAMS}`).then(responce => {
    if (!responce.ok) {
      throw new Error(resp.statusText);
    }
    return responce.json();
  });
}

export { getBreeds,  getCatByBreed };