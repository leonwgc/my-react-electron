/* eslint-disable */
'use strict';

// 获取当前环境
var env = function env() {
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
};

// 判断是不是带协议的网址（//开头或者包含://）
var isURL = function isURL(url) {
  return /^\/\//.test(url) || /^[a-zA-z]+:\/\/[^\s]*/.test(url);
};

var getSharePlatform = function getSharePlatform(table, value) {
  var platform = (value || []).map(function (item) {
    return table[item];
  });
  return platform.join(',');
};

// 打印日志
var print = function print(msg) {
  var _console;

  for (
    var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1;
    _key < _len;
    _key++
  ) {
    params[_key - 1] = arguments[_key];
  }

  JSBridge.debug &&
    (_console = console).info.apply(_console, ['JSBridge => ' + msg + ' \n'].concat(params));
};

// 设置微信title
var setTitleInWechat = function setTitleInWechat(title) {
  document.title = title;
  var i = document.createElement('iframe');
  i.src = '/favicon.ico';
  i.style.display = 'none';
  i.onload = function () {
    setTimeout(function () {
      i.remove();
    }, 0);
  };
  document.body.appendChild(i);
};

var openScheme = function openScheme(url) {
  var i = document.createElement('iframe');
  i.src = url;
  i.style.display = 'none';
  document.body.appendChild(i);
};

// 待执行的任务栈
var fnStack = [];
var timer = void 0;

// 等待加载
var _ready = function _ready(fn) {
  if (window.iHealthBridge) {
    fn();
    return;
  }
  fnStack.push(fn);

  if (timer) return;
  timer = setInterval(function () {
    if (window.iHealthBridge) {
      clearInterval(timer);

      var refn = void 0;
      while ((refn = fnStack.shift())) {
        refn();
      }
    }
  }, 200);
};

var action = function action(funcName) {
  for (
    var _len2 = arguments.length, param = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1;
    _key2 < _len2;
    _key2++
  ) {
    param[_key2 - 1] = arguments[_key2];
  }

  print.apply(undefined, [funcName].concat(param));
  var configs = {
    wechat: wechat,
    miniprogram: miniprogram,
    za: za,
    ifuli: ifuli,
    iyunbao: iyunbao,
    browser: browser,
  };
  var func = configs[JSBridge.env][funcName] || browser[funcName];
  typeof func === 'function' && func.apply(undefined, param);
};

// 默认设置
var JSBridge = {
  // 是否开启debug模式
  debug: false,

  // 获取当前环境
  env: env(),

  // 设置前端路由
  router: null,

  ready: function ready(fn) {
    return action('ready', fn);
  },

  // 跳转页面
  go: function go(url) {
    return action('go', url);
  },

  // 返回历史页面
  goBack: function goBack(param, callback) {
    return action('goBack', param, callback);
  },

  // 跳转到登录页
  goLogin: function goLogin() {
    return action('goLogin');
  },

  // 设置页面title
  setTitle: function setTitle(title) {
    return action('setTitle', title);
  },

  // 设置左上角按钮
  setBackButton: function setBackButton(obj, callback) {
    return action('setBackButton', obj, callback);
  },

  // 设置右上角按钮
  setRightButton: function setRightButton(obj, callback) {
    return action('setRightButton', obj, callback);
  },

  // 调起分享
  share: function share(obj, callback) {
    return action('share', obj, callback);
  },

  // 二维码扫描
  scanQRCode: function scanQRCode(obj, callback) {
    return action('scanQRCode', obj, callback);
  },

  // 设置标题栏样式
  setNavigationStyle: function setNavigationStyle(obj, callback) {
    return action('setNavigationStyle', obj, callback);
  },

  // 二维码扫描
  print: function print(obj, callback) {
    return action('print', obj, callback);
  },

  // 跳转到原生
  navigateTo: function navigateTo(url) {
    return action('navigateTo', url);
  },

  // 重置设置
  resetConfig: function resetConfig(typeArray) {
    return action('resetConfig', typeArray);
  },

  // 获取系统信息
  getSystemInfo: function getSystemInfo(callback) {
    return action('getSystemInfo', callback);
  },
  snapshot: function (obj, callback) {
    return iHealthBridge.doAction('snapshot', JSON.stringify(obj), callback);
  },
};

var browser = {
  ready: function ready(fn) {
    return fn();
  },
  go: function go(url) {
    if (JSBridge.router && !isURL(url)) {
      JSBridge.router.push(url);
    } else {
      location.href = url;
    }
  },
  goBack: function goBack(param, callback) {
    if (param && param.url) {
      if (JSBridge.router && !isURL(param.url)) {
        JSBridge.router.push(param.url);
      } else {
        location.href = param.url;
      }
      return;
    }
    if (JSBridge.router) {
      JSBridge.router.go(-1);
    } else {
      history.go(-1);
    }
  },
  setTitle: function setTitle(title) {
    document.title = title;
  },
};

var miniprogram = {
  navigateTo: function navigateTo(url) {
    return wx.miniProgram.navigateTo({ url: url });
  },
};

var wechat = {
  setTitle: function setTitle(title) {
    return setTitleInWechat(title);
  },
};

var za = {
  go: function go(url) {
    if (JSBridge.router && !isURL(url)) {
      JSBridge.router.push(url);
    } else {
      openScheme('zaapp://zai.gotowebview?params={ "url": "' + url + '" }');
    }
  },
  goBack: function goBack(param, callback) {
    window.prompt(
      JSON.stringify({
        functionName: 'closeWebView',
        params: {},
      })
    );
  },
  goLogin: function goLogin(returnUrl) {
    window.prompt(
      JSON.stringify({
        functionName: 'login',
        params: {
          // BUID: '',
        },
      })
    );
  },
  setTitle: function setTitle(title) {
    window.prompt(
      JSON.stringify({
        functionName: 'setNavigationBarTitle',
        params: {
          title: title,
        },
      })
    );
  },
  setRightButton: function setRightButton(obj, callback) {
    window.__za_callback_setRightButton = callback;
    window.prompt(
      JSON.stringify({
        functionName: 'setNavigationBarRightButton',
        params: {
          buttonIcon: obj.imageUrl,
          buttonName: obj.title,
          buttonListener: '__za_callback_setRightButton',
        },
      })
    );
  },
  share: function share(obj, callback) {
    window.__za_callback_share = function (result) {
      callback({}, !!Number(result.status));
    };
    window.__za_callback_showShareView = function (result) {
      window.prompt(
        JSON.stringify({
          functionName: 'share',
          params: {
            shareType: result.data.shareType,
            title: obj.title,
            desc: obj.desc,
            url: obj.link,
            imageUrl: obj.imageUrl,
            isSharePicture: '0',
          },
          complete: '__za_callback_share',
        })
      );
    };
    var platform =
      getSharePlatform(
        {
          'wechat': '2',
          'wechat-timeline': '3',
          'qq': '4',
          'qzone': '5',
        },
        obj.platform
      ) || '1';
    window.prompt(
      JSON.stringify({
        functionName: 'showShareView',
        params: {
          shareType: platform,
          dialogTitle: obj.dialogTitle,
          dialogDesc: obj.dialogDesc,
        },
        complete: '__za_callback_showShareView',
      })
    );
  },
  scanQRCode: function scanQRCode(obj, callback) {
    openScheme('zaapp://zai.richscan?');
  },
  setNavigationStyle: function setNavigationStyle(obj) {
    window.prompt(
      JSON.stringify({
        functionName: 'setNavigationBarColor',
        params: {
          fontColor: obj.fontColor,
          backgroundColor: obj.backgroundColor,
          returnButtonColor: obj.fontColor,
        },
      })
    );
  },
  resetConfig: function resetConfig(typeArray) {
    window.prompt(
      JSON.stringify({
        functionName: 'resetNavigationBar',
        params: {
          resetArray: typeArray,
        },
      })
    );
  },
  getSystemInfo: function getSystemInfo(callback) {
    window.__za_callback_getSystemInfo = function (result) {
      var data = result.data;
      callback(
        {
          appName: data.brand,
          appVersion: data.appVersion,
          appPlatform: data.platform,
        },
        !!Number(result.status)
      );
    };
    window.prompt(
      JSON.stringify({
        functionName: 'getSystemInfo',
        params: {},
        complete: '__za_callback_getSystemInfo',
      })
    );
  },

  // 在i云保App或者最福利App
  // if (JSBridge.env === 'iyunbao' || JSBridge.env === 'ifuli') {
};
var ifuli = {
  ready: function ready(fn) {
    return _ready(fn);
  },
  go: function go(url) {
    if (!isURL(url)) {
      var basename =
        JSBridge.router && JSBridge.router.location && JSBridge.router.location.basename;
      if (basename) {
        url = location.origin + basename + url;
      } else {
        url = location.origin + url;
      }
    }
    iHealthBridge.goWebView(url);
  },
  goBack: function goBack(param, callback) {
    iHealthBridge.goHistory(JSON.stringify(param), callback);
  },
  goLogin: function goLogin(returnUrl) {
    iHealthBridge.goLogin();
  },
  setTitle: function setTitle(title) {
    iHealthBridge.doAction('setTitle', JSON.stringify({ title: title }));
  },
  setBackButton: function setBackButton(obj, callback) {
    obj.image = obj.imageUrl;
    iHealthBridge.doAction('setBackButton', JSON.stringify(obj), callback);
  },
  setRightButton: function setRightButton(obj, callback) {
    obj.image = obj.imageUrl;
    iHealthBridge.doAction('setRightButton', JSON.stringify(obj), callback);
  },
  share: function share(obj, callback) {
    obj.platform = getSharePlatform(
      {
        'wechat': '22',
        'wechat-timeline': '23',
        'qq': '24',
        'qzone': '6',
        'zuifuli': '99',
      },
      obj.platform
    );
    obj.thumb = obj.imageUrl;
    iHealthBridge.doAction('share', JSON.stringify(obj), callback);
  },
  scanQRCode: function scanQRCode(obj, callback) {
    obj.unpush = obj.direct;
    iHealthBridge.doAction('scanQRCode', JSON.stringify(obj), callback);
  },
  setNavigationStyle: function setNavigationStyle(obj, callback) {
    iHealthBridge.doAction('setStyle', JSON.stringify(obj), callback);
  },
  print: function print(obj, callback) {
    iHealthBridge.doAction('print', JSON.stringify(obj), callback);
  },
  getSystemInfo: function getSystemInfo(callback) {
    callback(
      {
        appName: iHealthBridge.app_name,
        appVersion: iHealthBridge.app_version,
        appPlatform: iHealthBridge.app_platform,
      },
      true
    );
  },
};

var iyunbao = ifuli;

export default JSBridge;
