import axios from "axios";

function requestAjaxSync(url, method = "get", params) {
  return new Promise((resolve, reject) => {
    axios({
        // `url` is the server URL that will be used for the request
        url: url,

        // `method` is the request method to be used when making the request
        method: method, // default

        // `headers` are custom headers to be sent
        headers: {
          // 'X-Requested-With': 'XMLHttpRequest'

        },
        "content-type": "application/json",
        // `params` are the URL parameters to be sent with the request
        // Must be a plain object or a URLSearchParams object
        params: method == "get" ? params : null,

        // `data` is the data to be sent as the request body
        // Only applicable for request methods 'PUT', 'POST', and 'PATCH'
        // When no `transformRequest` is set, must be of one of the following types:
        // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
        // - Browser only: FormData, File, Blob
        // - Node only: Stream, Buffer
        data: method == "get" ? null : params,

        // `timeout` specifies the number of milliseconds before the request times out.
        // If the request takes longer than `timeout`, the request will be aborted.
        timeout: 30000, // default is `0` (no timeout)

        // `responseType` indicates the type of data that the server will respond with
        // options are 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
        responseType: "json", // default

        // `maxContentLength` defines the max size of the http response content in bytes allowed
        maxContentLength: 2000000
      })
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
}
var username = document.cookie.split(";")[0].split("=")[1];
//JS操作cookies方法!
//写cookies

function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return unescape(arr[2]);
  else
    return null;
}

function setCookie(name, value, time) {
  var strsec = getsec(time);
  var exp = new Date();
  exp.setTime(exp.getTime() + strsec * 1);
  document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

function delCookie(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null)
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

function getsec(str) {
  var str1 = str.substring(1, str.length) * 1;
  var str2 = str.substring(0, 1);
  if (str2 == "s") {
    return str1 * 1000;
  } else if (str2 == "h") {
    return str1 * 60 * 60 * 1000;
  } else if (str2 == "d") {
    return str1 * 24 * 60 * 60 * 1000;
  }
}
//这是有设定过期时间的使用示例：
//s20是代表20秒
//h是指小时，如12小时则是：h12
//d是天数，30天则：d30
// setCookie("name", "hayden",'s20');
// alert(getCookie("name"));
function requestBasicAjaxSync(url, method, params) {
  return new Promise((resolve, reject) => {
    axios({
        url: url,
        method: method,
        async: true,
        headers: {},
        data: params,
        timeout: 30000,
        responseType: "json",
        maxContentLength: 2000
      })
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  })
}

/**
 * 输出指定格式的日期
 *
 * @param {any} dateObj new Date()
 * @param {any} format 'yyyy-MM-dd hh:mm:ss'
 * @returns
 */
function dateToString(dateObj, format) {
    var z = {
        y: dateObj.getFullYear(),
        M: dateObj.getMonth() + 1,
        d: dateObj.getDate(),
        h: dateObj.getHours(),
        m: dateObj.getMinutes(),
        s: dateObj.getSeconds()
    };
    return format.replace(/(y+|M+|d+|h+|m+|s+)/g, function (v) {
        return ((v.length > 1 ? '0' : '') + eval('z.' + v.slice(-1))).slice(-(v.length > 2 ? v.length : 2))
    });
}
export default {
  requestAjaxSync,
  requestBasicAjaxSync,
  setCookie,
  getCookie,
  delCookie,
  dateToString
};
