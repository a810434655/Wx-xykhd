var URL = require("../config/config.js")
var http = require("../utils/request.js")

module.exports = {
  login: function ({ rdCode, exJson, encryptedData, iv}) {
    const data = {
      rdCode,
      systemId: 4,
      rdType: 1,
      exJson,
        encryptedData,
      iv
    }
    return http.POST({url: URL.authServer + '/sso/rdLogin', data})
  },
  getUserInfo: function () {
    const data = {
    }
    return http.GET({ url: URL.dreamOnServer + '/user/DoUser/selectById', data })
  },
  // 获取认证详情
  getUserIdentification: function () {
    const data = {
    }
    return http.GET({ url: URL.dreamOnServer + '/user/DoIdentification/selectIdentification', data })
  },
  // 申请认证
  putUserIdentification: function (data) {
    data.miniId = 1
    return http.POST({
      url: URL.dreamOnServer + '/user/DoIdentification/insert', data })
  },
  // 获取我的门票
  getUserTicket: function ({ page, size, type }) {
      const data = {
        page,
        size,
        type
      }
      return http.GET({
        url: URL.dreamActServer + '/user/DaFormData/selectPageData',
        data
      })
  },
  // 获取我的消息提醒
  getUserMessageInfo: function () {
    const data = {
    }
    return http.GET({
      url: URL.dreamActServer + '/user/DaMessage/selectAll',
      data
    })
  },
  // 获取我的消息
  getUserMessage: function ({ page, size, type }) {
    const data = {
      page,
      size,
      type
    }
    return http.GET({
      url: URL.dreamActServer + '/user/DaMessage/selectPageByType',
      data
    })
  }
}