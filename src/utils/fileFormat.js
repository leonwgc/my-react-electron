const fileIcons = {
  zip: 'https://image.zuifuli.com/17/20181212/5a6f07df2febc89c19e9ce13f9913e03.png',
  rar: 'https://image.zuifuli.com/17/20181212/5de100e62cf8639274cc155ed66b33e8.png',
  pdf: 'https://image.zuifuli.com/17/20181212/c030f75f795b2bd284df41f2736df16d.png',
  txt: 'https://image.zuifuli.com/17/20181212/7b8d5b0a4f0706b07a19b3045f94726c.png',
  xls: 'https://image.zuifuli.com/17/20190111/68ea8d86bedf60f18c81385c0527f717.png',
  ppt: 'https://image.zuifuli.com/17/20190111/b131ffd095bb5111555949459a8392d9.png',
  doc: 'https://image.zuifuli.com/17/20190111/9a557270cdc5cb0482a6bee7492d5338.png',
  audio: 'https://image.zuifuli.com/17/20190111/bfccb4d01d7cffca5bc31638a38616df.png',
  video: 'https://image.zuifuli.com/17/20190111/8bbf36fd3585e6f840f7d77596e82996.png',
  pic: 'https://image.zuifuli.com/17/20190111/99eccd44d99f3bdc01d0815b9f70f788.png',
  other: 'https://image.zuifuli.com/17/20190111/75a4d898c80365fa5e846a9a2ddf22ea.png',
  // other: 'https://image.zuifuli.com/17/20181212/3b11447d8c4edbd9861bc71055fe91c1.png',
};


const picReg = /\.jpg$|\.jpeg$|\.gif$|\.png$/i;
const zipReg = /\.zip$/i;
const rarReg = /\.rar$/i;
const pdfReg = /\.pdf$/i;
const txtReg = /\.txt$/i;
const docReg = /\.doc$|\.docx$/i;
const pptReg = /\.ppt$|\.pptx$/i;
const xlsReg = /\.xls$|\.xlsx$/i;
const audioReg = /\.(mp3|aac|ogg|flac|wav)$/i;
const videoReg = /\.(mp4|avi|mpg|mpeg|3gp|wmv|mkv|mov|rvmb)$/i;

export const fmtFileSize = (size) => {
  if (size < Math.pow(1024, 1)) return `${size}b`;
  if (size < Math.pow(1024, 2)) return `${parseFloat((size / Math.pow(1024, 1)).toFixed(2))}kb`;
  if (size < Math.pow(1024, 3)) return `${parseFloat((size / Math.pow(1024, 2)).toFixed(1))}M`;
  return `${parseFloat((size / Math.pow(1024, 3)).toFixed(1))}G`;
};

export const isPic = (fileExt) => {
  if (!~fileExt.indexOf('.')) {
    fileExt = `.${fileExt}`;
  }
  return picReg.test(fileExt);
};

export const fileLogo = (fileExt) => {
  if (!~fileExt.indexOf('.')) {
    fileExt = `.${fileExt}`;
  }
  if (zipReg.test(fileExt)) return fileIcons.zip;
  if (rarReg.test(fileExt)) return fileIcons.rar;
  if (pdfReg.test(fileExt)) return fileIcons.pdf;
  if (txtReg.test(fileExt)) return fileIcons.txt;
  if (docReg.test(fileExt)) return fileIcons.doc;
  if (pptReg.test(fileExt)) return fileIcons.ppt;
  if (xlsReg.test(fileExt)) return fileIcons.xls;
  if (audioReg.test(fileExt)) return fileIcons.audio;
  if (videoReg.test(fileExt)) return fileIcons.video;

  return fileIcons.other;
};

export const getElemIndexInArrayByKV = (arr, key, value) => {
  let pos = -1;
  if (Array.isArray(arr)) {
    arr.some((elem, index) => {
      const flag = elem[key] === value;
      flag && (pos = index);
      return flag;
    });
  }
  return pos;
};
