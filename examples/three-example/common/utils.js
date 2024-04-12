/* 异步加载js */ 
export function loadScript (url) {
    return new Promise((resolve, reject)=> {
      const script = document.createElement('script');
      script.onload = ()=> resolve()
      script.onerror = ()=> reject(new Error(`${url}读取失败`))
      script.src = url;
      const head = document.head || document.getElementsByTagName('head')[0];
      (document.body || head).appendChild(script)
    })
  }

  /*公共方法：判断客户端*/
export function judgeClient() {
  let u = navigator.userAgent;
  let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;   //判断是否是 android终端
  let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);     //判断是否是 iOS终端
  console.log('是否是Android：' + isAndroid); //true,false
  console.log('是否是iOS：' + isIOS);
  if (isAndroid) {
      return 'Android';
  } else if (isIOS) {
      return 'IOS';
  } else {
      return 'PC';
  }
}
