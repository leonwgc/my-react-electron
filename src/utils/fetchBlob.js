import config from 'config';
import { setServices, FetchAPI } from 'za-fetch-api';

import fetchAPI from './fetch';

const { API = {} } = config;
setServices(API);

export const middlewares = [];

const fetchBlob = new FetchAPI({
  middlewares,
  parseResponse: (response) => {
    const blob = response.blob();
    return blob;
  },
});

fetchBlob.setBefore(opt => fetchAPI.before(opt));
fetchBlob.setAfter(opt => fetchAPI.after(opt));

export default fetchBlob;
