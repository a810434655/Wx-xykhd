var URL = require("../config/config.js")
var http = require("../utils/request.js")

module.exports = {
  upImg: function ({ filePath }) {
    const data = {
      filePath
    }
    return http.UP({ url: URL.ossServer + '/upImg', data })
  }
}