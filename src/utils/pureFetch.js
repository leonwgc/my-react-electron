import config from 'config';
import { FetchAPI, setServices } from 'za-fetch-api';
import JSONbig from 'json-bigint';

setServices(config.API);

const fetchAPI = new FetchAPI();

export { FetchAPI, getURL } from 'za-fetch-api';

const ERROR_MESSAGE = '网络异常';

export const checkStatus = (res) => {
  const { status } = res;

  if ((status >= 200 && status < 300) || status === 304) {
    return res;
  }

  const error = new Error(ERROR_MESSAGE);
  error.res = res;
  return Promise.reject(error);
};

export const middlewares = [
  (res) => {
    const { code, result, message = ERROR_MESSAGE } = res;

    if (code === '0') {
      return result;
    }

    const error = new Error(message);
    error.res = res;
    return Promise.reject(error);
  },
];

fetchAPI.setCheckStatus(checkStatus);

fetchAPI.setMiddlewares(middlewares);

fetchAPI.setParseResponse(res => res.text().then(JSONbig({ storeAsString: true }).parse));

export default fetchAPI;
