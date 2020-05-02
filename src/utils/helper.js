import * as qs from 'qs';
import { getHost } from '~/utils/host';
const logoUrl = 'https://one.zuifuli.com/images/logo2.0a7ee33c.png';

// common redux , form field onChange handler
export const onFormFieldChange = (event, type, dispath, payload = 'payload') => {
  const target = event.target;
  const isBoolean = target.type === 'checkbox' || target.type === 'radio';
  const value = isBoolean ? target.checked : target.value;
  return dispath({ type, [payload]: value });
};

// common mobx form field onChange handler, used with form model , e.g. onFormItemChange=onChange.call(mobxFormModel,event)
export function onChange(event) {
  const target = event.target;
  const isBoolean = target.type === 'checkbox' || target.type === 'radio';
  const value = isBoolean ? target.checked : target.value;
  this[target.name] = value;
}

// get form item value for hook form
export function getFormItemValue(event) {
  const target = event.target;
  const isBoolean = target.type === 'checkbox' || target.type === 'radio';
  const value = isBoolean ? target.checked : target.value;
  return value;
}

// 最福利h5?登录
export function gotoLogin() {
  return (window.location.href = `//${getHost()}/api/duncan/s/r/common?logoUrl=${logoUrl}&redirectUrl=${encodeURIComponent(
    window.location.href
  )}`);
}

export function getPageLink(page) {
  return __dev__ ? `/${page}.html` : `/${page}`;
}

export function getPageCount(count, pageSize = 10) {
  return count % pageSize === 0 ? count / pageSize : ~~(count / pageSize) + 1;
}

// object to form-urlencoded string
export function getQueryString(object) {
  return qs.stringify(object, { indices: false });
}

// location.search to object
export function getURLParams() {
  return qs.parse(location.search.slice(1));
}

export function getClientInfo() {
  if (typeof window === 'undefined') {
    return 'node';
  }
  var UA = window.navigator.userAgent.toLowerCase();
  if (window.__wxjs_environment === 'miniprogram') {
    return 'miniprogram';
  }
  if (UA.match(/MicroMessenger/i)) {
    return 'wechat';
  }
  if (UA.match(/ZhongAnWebView/i)) {
    return 'za';
  }
  if (UA.match(/ifuli/i)) {
    return 'ifuli';
  }
  if (
    window.iHealthBridge &&
    (window.iHealthBridge.app_name === 'iyunbao' ||
      (typeof window.iHealthBridge.app_name === 'function' &&
        window.iHealthBridge.app_name() === 'iyunbao'))
  ) {
    return 'iyunbao';
  }
  return 'browser';
}

export function isApp() {
  const client = getClientInfo();
  return client === 'ifuli' || client === 'iyunbao';
}

// get client info ,return  {isAndroid, isiOS}
export function getClientType() {
  let ua = navigator.userAgent;
  let isAndroid = /android/i.test(ua);
  let isiOS = /(iPhone|iPad|iPod|iOS)/i.test(ua);
  return { isAndroid, isiOS };
}

// export function isH5() {
//   const { isAndroid, isiOS, isWechat } = getClientInfo();
//   return isAndroid || isiOS || isWechat;
// }

function isObject(obj) {
  return typeof obj === 'object' && obj !== null;
}

// safely get props of an object.
/* tslint:disable */
export function getProp(obj, path, defaultValue) {
  if (isObject(obj) && path) {
    let t;
    try {
      const getter = new Function('a', `return a.${path}`);
      t = getter(obj);
    } catch (ex) {
      t = defaultValue;
    }
    return t !== undefined ? t : defaultValue !== undefined ? defaultValue : t;
  }
}
