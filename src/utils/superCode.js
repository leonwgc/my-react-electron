import asyncLoad from './asyncLoad';

const testConfig = {
  SuperCodeCss:
    'https://staticdaily.zhongan.com/website/paas/public/supercode/test/1.0.2/supercode.css', // 无间盾样式库
  SuperCodeJs:
    'https://staticdaily.zhongan.com/website/paas/public/supercode/test/1.0.2/supercode.js', // 无间盾脚本
  SuperCodeScene: '4fda12142808#test#activity', // 场景ID
  SuperCodeNeedScene: false, // 请求验证码接口是否需要代入场景值
};

const prdConfig = {
  SuperCodeCss: 'https://staticdaily.zhongan.com/website/paas/public/supercode/1.0.2/supercode.css', // 无间盾样式库
  SuperCodeJs: 'https://staticdaily.zhongan.com/website/paas/public/supercode/1.0.2/supercode.js', // 无间盾脚本
  SuperCodeScene: '8504bf6d557a#prd#activity', // 场景ID
  SuperCodeNeedScene: false, // 请求验证码接口是否需要代入场景值
};
let config;
if (__env__ === 'test' || __env__ === 'dev') {
  config = testConfig;
} else {
  config = prdConfig;
}

let SuperCodeNode;
const SuperCbList = [];

const initCode = () => {
  return asyncLoad([config.SuperCodeCss, config.SuperCodeJs]).then(() => {
    SuperCodeNode = new window.SuperCode({
      scene: config.SuperCodeScene,
      onSuccess: ({ code, message, data = {} }) => {
        if (+code || !data.did) return alert(message || '操作异常，请稍后再试');
        const tmp = {
          's-did': data.did,
          's-scene': config.SuperCodeNeedScene ? data.scene : '',
          's-token': data.token,
        };
        const fn = SuperCbList.shift();
        fn && Object.prototype.toString.call(fn) === '[object Function]' && fn(tmp);
      },
      onFail: ({ code, message, data = {} }) => {
        return alert(message || '操作异常，请稍后再试');
      },
    });

    return Promise.resolve();
  });
};

const show = (cb, opt = {}) => {
  if (SuperCodeNode) {
    SuperCbList.push(cb);
    return SuperCodeNode.show(opt);
  }

  SuperCbList.push(cb);
  initCode().then(() => SuperCodeNode.show(opt));
};

export default show;
