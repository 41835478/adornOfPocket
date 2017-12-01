var BASE_URL = getApp().globalData.baseUrl

var requestHandler = {
  params: {},
  url: '',
  wxCode: false,     //是否需要wxCode, 默认不需要
  success: function (res) {
    // success
  },
  fail: function (err) {
    // fail
  },
}
//GET请求
function GET(requestHandler) {
  let url = requestHandler.url
  if (requestHandler.wxCode) {
    //需要code
    wx.login({
      success: res => {
        url = url + '?wxCode=' + res.code
        // console.log("url = " + url)
        request('GET', requestHandler, url)
      }
    })
  } else {
    request('GET', requestHandler, url)
  }
}
//POST请求
function POST(requestHandler) {
  let url = requestHandler.url
  request('POST', requestHandler, url)
}

function request(method, requestHandler, requestUrl) {
  //注意：可以对params加密等处理
  var params = requestHandler.params;
  var url = requestUrl;
  console.log("请求地址: " + url +    "    请求参数:" + JSON.stringify(params))
  wx.request({
    url: BASE_URL + url,
    data: params,
    method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: {
      'auth': 'JSONID:94268'
    }, // 设置请求的 header
    success: function (res) {
      //注意：可以对参数解密等处理
      requestHandler.success(res)
    },
    fail: function (err) {
      requestHandler.fail(err)
    },
    complete: function () {
      // complete
    }
  })
}

module.exports = {
  GET: GET,
  POST: POST
}