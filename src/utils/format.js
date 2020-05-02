import 'url-polyfill';

export const parseUrl = (url) => {
  if (url && typeof url === 'string') {
    try {
      const urlObj = new URL(url);
      const {
        host,
        hostname
      } = urlObj;

      if (!url.includes(host)) {
        Object.assign(urlObj, {
          host: hostname
        });
      }

      return urlObj;
    } catch (err) {
      console.error(err.message);
    }
  }

  return null;
};