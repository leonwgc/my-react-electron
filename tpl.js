module.exports = function (isDev, htmlWebpackPlugin) {
  return `
 <!doctype html>
 <html lang="zh-cn">
 <head>
	 <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	 <meta name="baidu-site-verification" content="AJSL3iUsZg" />
	 <meta name="keywords" content="企业员工福利平台,员工福利方案,企业福利定制,弹性福利,员工体检,员工团险,福利外包,最福利" />
	 <meta name="description"
		 content="最福利-国内领先的企业福利平台,为企业提供员工福利一站式解决方案,包括弹性福利、年节福利、保险保障、体检健康、差旅管理、企业团餐等服务模块,节约公司成本,提高员工满意度。" />
	 <meta name="baidu-site-verification" content="YvTk1lsBg2" />
	 <meta name="sogou_site_verification" content="tft0lue1HX" />
	 <meta name="360-site-verification" content="6923b247b8a4caf696db2908d438e101" />
	 ${htmlWebpackPlugin.tags.headTags}
	 <title>my app</title>
 </head>
 <body>
	 <div id='root'>${isDev ? '' : '<%-body%>'}</div>
	 <script>${isDev ? '' : 'window.app =<%-app%>;'}</script>
	 <!-- <script async>
		 var _hmt = _hmt || [];
		 (function () {
			 var hm = document.createElement("script");
			 hm.src = "https://hm.baidu.com/hm.js?60a60ffead48d981c1c0a0c0b45d5ec8";
			 var s = document.getElementsByTagName("script")[0];
			 s.parentNode.insertBefore(hm, s);
		 })();
	 </script>
	 <script async>
		 //用于在线咨询
		 var _hmt = _hmt || [];
		 (function () {
			 var hm = document.createElement("script");
			 hm.src = "https://hm.baidu.com/hm.js?19531003d78b2192687cefa6f728377a";
			 var s = document.getElementsByTagName("script")[0];
			 s.parentNode.insertBefore(hm, s);
		 })();
	 </script>
	 <script
		 type="text/javascript" async>var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://"); document.write(unescape("%3Cspan id='cnzz_stat_icon_1273370751'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s19.cnzz.com/z_stat.php%3Fid%3D1273370751%26show%3Dpic' type='text/javascript'%3E%3C/script%3E"));</script> -->
		 ${htmlWebpackPlugin.tags.bodyTags}
		 </body>
 </html>
 `;
};
