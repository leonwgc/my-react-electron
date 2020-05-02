export const getParameterByName = (name, url) => {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[[]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

export const addParameterByName = (name, key, url) => {
  if (!url) {
    url = window.location.href;
  }
  const array = url.split('#');
  array[0] = `${array[0]}&${name}=${key}`.replace(/[&?]{1,2}/, '?');
  const result = array.join('#');

  return result;
};

// 身份证号15位转18位身份证号
export const idCardNochangeFivteenToEighteen = (no) => {
  if (no.length === 15) {
    const arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    let noTemp = 0;
    let i;
    let _no = `${no.substr(0, 6)}19${no.substr(6, no.length - 6)}`;
    for (i = 0; i < 17; i += 1) {
      noTemp += _no.substr(i, 1) * arrInt[i];
    }
    _no += arrCh[noTemp % 11];
    return _no;
  }
  return no;
};

export const getIdCardNoBirthday = (no, isFormat) => {
  const len = no.length;
  // 身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
  if (len === 15) {
    const re = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
    const arr = no.match(re);
    const year = +arr[2];
    const month = +arr[3];
    const day = +arr[4];
    const birthday = `19${year}-${month}-${day}`;
    if (isFormat) {
      return {
        year,
        month,
        day,
        birthday,
      };
    }
    return birthday;
  }
  // 身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
  if (len === 18) {
    const re = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
    const arr = no.match(re);
    const year = +arr[2];
    const month = +arr[3];
    const day = +arr[4];
    const birthday = `${year}-${month}-${day}`;
    if (isFormat) {
      return {
        year,
        month,
        day,
        birthday,
      };
    }
    return birthday;
  }
  return '';
};

export const getIdCardNoSex = (no) => {
  const _no = idCardNochangeFivteenToEighteen(no);
  return Number(_no.substr(16, 1)) % 2;
};

export const fmtFileSize = (size) => {
  if (size < Math.pow(1024, 1)) return `${size}b`;
  if (size < Math.pow(1024, 2)) return `${parseFloat((size / Math.pow(1024, 1)).toFixed(2))}kb`;
  if (size < Math.pow(1024, 3)) return `${parseFloat((size / Math.pow(1024, 2)).toFixed(1))}M`;
  return `${parseFloat((size / Math.pow(1024, 3)).toFixed(1))}G`;
};

export const isFunc = _ => (typeof _ === 'function');

export const deepAssert = (a, b) => {
  if (a !== b) {
    if (Array.isArray(a) && Array.isArray(b)) {
      return a.length === b.length && a.every(i => b.some(j => deepAssert(i, j))) && b.every(i => a.some(j => deepAssert(i, j)));
    }

    if (Object.prototype.toString.call(a) === '[object Object]' && Object.prototype.toString.call(b) === '[object Object]') {
      const aKeys = Object.keys(a);
      const bKeys = Object.keys(b);

      return aKeys.length === bKeys.length && aKeys.every(i => bKeys.some(j => deepAssert(a[i], b[j]))) && bKeys.every(i => aKeys.some(j => deepAssert(bKeys[i], aKeys[j])));
    }

    return false;
  }

  return true;
};

export const onInitCheck = () => {
  const ua = window.navigator.userAgent;
  const url = window.location.hash;

  if (/(iPhone|iPad|iPod|iOS|Android)/i.test(ua) && !/\/m/.test(url)) {
    window.location.hash = '#/m';
  }
}