var URL = require("../config/config.js")
var http = require("../utils/request.js")

module.exports = {
  // 信息反馈
  postFeedback: function ({ content }) {
    const data = { content }
    return http.POST({ url: URL.dreamStarServer + '/user/DsFeedback/insert', data })
  },
  // // K V
  // getInfoByKey: function ({ key }) {
  //   const data = { key }
  //   return http.GET({ url: URL.dreamOnServer + '/index/selectValueByKey', data })
  // },
  // 获取小程序码
  getMiniCode: function ({ scene, page, width }) {
    const data = { scene, page, width }
    return http.GET({ url: URL.dreamActServer + '/index/getMiniCode', data })
  },
  // 获取验证码 type 1 需要手机已注册 type 0 需要手机未注册
  getPhoneCode: function ({ phone, type }) {
    const data = { phone, type }
    return http.GET({ url: URL.dreamOnServer + '/user/DoIdentification/getMessageCode', data })
  },
  //记录 type   类型：1、创建活动按钮，2、活动功能按钮，3、前往认证按钮
  visitRecord: function ({ type }) {
    const data = { type }
    return http.POST({ url: URL.dreamActServer + '/user/api/visitRecord/insert', data })
  }
}