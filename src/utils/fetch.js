/**
 * 通用API请求工具方法
 */
import qs from 'qs';

function parseResponse(xhr) {
  var result;
  try {
    result = JSON.parse(xhr.responseText);
  } catch (e) {
    result = xhr.responseText;
  }
  return result;
}

function hasContentType(headers) {
  return Object.keys(headers).some((name) => {
    return name.toLowerCase() === 'content-type';
  });
}

function setHeaders(xhr, headers) {
  headers = headers || {};
  if (!hasContentType(headers)) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
  }
  Object.keys(headers).forEach((name) => {
    if (headers[name]) {
      xhr.setRequestHeader(name, headers[name]);
    }
  });
}

function objectToQueryString(data) {
  return isObject(data) ? getQueryString(data) : data;
}

function isObject(data) {
  return Object.prototype.toString.call(data) === '[object Object]';
}

function getQueryString(object) {
  return qs.stringify(object, { indices: false });
}

function fetch(url, options) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open(options.method, url);
    xhr.withCredentials = options.withCredentials;
    setHeaders(xhr, options.headers);
    xhr.onload = () => {
      var res = parseResponse(xhr);
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(res);
      } else {
        reject({ code: xhr.status });
      }
    };
    xhr.onerror = reject;
    xhr.send(options.data);
  });
}

const fetchFactory = (method, host) => (
  api,
  data = null,
  headers = null,
  withCredentials = true
) => {
  let url = `${host}${api}`;
  if (method === 'get') {
    if (data) {
      url += `?${objectToQueryString(data)}`;
      data = null;
    }
  }

  return fetch(url, {
    method,
    data,
    headers,
    withCredentials,
  });
};

export default fetchFactory;
