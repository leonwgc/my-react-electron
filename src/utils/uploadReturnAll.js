import fetchAPI from "./fetch";

let canvas;

const fileStore = {};
const callbackStore = {};
const UPLOADING_CODE = "uploading";

const baseOpts = {
  server: "edu",
  path: "/v1/attch/cdn",
  loading: true
};

const addCallback = (key, callback) => {
  const baseList = callbackStore[key] || [];
  const list = baseList.concat(callback);

  callbackStore[key] = list;
};

const removeCallback = (key, result) => {
  const list = callbackStore[key] || [];

  fileStore[key] = result;
  callbackStore[key] = [];

  list.forEach(callback =>
    callback({
      code: 0,
      result
    })
  );
};

function b64toBlob(b64Data, contentType = "image/jpeg", sliceSize = 512) {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}

const createCanvas = () => {
  if (canvas) return;

  canvas = document.createElement("canvas");
};

const compress = file =>
  new Promise((resolve, reject) => {

    createCanvas();

    const { name } = file;

    if (!/\.(jpg|jpeg|png|bmp)$/.test(name)) return resolve(file);

    const img = new Image();
    const reader = new FileReader();

    file = file.constructor === File ? file : file.file;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const dataUrl = canvas.toDataURL("image/jpeg", 0.15);
      const blob = b64toBlob(dataUrl.split(",")[1]);

      resolve(blob);
    };

    reader.onload = event => {
      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  });

const upload = async (baseFile = {}, opts = {}) => {

  const { originFileObj } = baseFile;
  const file = originFileObj || baseFile;
  const { name = "", size = 0 } = file;

  const opt = Object.assign({}, baseOpts, opts);

  const { server = "", path: pn = "" } = opt;

  const key = `${name}-${size}-${server}-${pn}`;
  const storeUrl = fileStore[key];

  if (storeUrl === UPLOADING_CODE) {
    return new Promise(resolve => addCallback(key, resolve));
  }

  if (storeUrl) {
    return Promise.resolve({
      code: 0,
      result: storeUrl
    });
  }

  const data = new FormData();

  const compressedFile = file; // await compress(file);

  data.append("file", compressedFile);
  fileStore[key] = UPLOADING_CODE;

  return new Promise(resolve => {
    addCallback(key, resolve);

    fetchAPI
      .form({
        ...opt,
        data
      })
      .then((res = {}) => {
        const { code, result = {} } = res;
        // const { url } = result;

        if (Number(code)) {
          return {};
        }

        removeCallback(key, result);
      });
  });
};

export const uploadList = (fileList = [], opts = {}) => {
  const arr = [];

  const uploadSingleFile = (files = []) =>
    new Promise((resolve1, reject1) => {
      const file = files.shift();

      // console.log('uploadSingleFile', file, arr);
      if (!file) return resolve1(arr);

      if (file.url) {
        arr.push(file);
        return resolve1(uploadSingleFile(files));
      }

      upload(file, opts)
        .then((data = {}) => {
          arr.push(data.result || {});
          resolve1(uploadSingleFile(files));
        })
        .catch(err => reject1(err));
    });

  return uploadSingleFile(fileList);
};

export default upload;
