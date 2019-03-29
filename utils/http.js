var requestHandler = {
  params: {},
  success: function (res) {
    // success  
  },
  fail: function () {
    // fail  
  }
}

//GET请求  
function GET(url,requestHandler) {
  request('GET', url, requestHandler)
}
//POST请求  
function POST(url,requestHandler) {
  request('POST', url, requestHandler)
}

function request(method, url, requestHandler) {
  //注意：可以对params加密等处理 
  var params = requestHandler.params;
  wx.request({
    url: url,
    data: params,
    method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
    // headfer: {}, // 设置请求的 header  
    success: function (res) {
      //注意：可以对参数解密等处理  
      requestHandler.success(res)
    },
    fail: function () {
      requestHandler.fail()
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