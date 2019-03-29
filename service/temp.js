var URL = require("../config/config.js")
var http = require("../utils/request.js")

module.exports = {
  // 南北站活动点赞
  praiseActivity: function ({ activityId}) {
    const data = { activityId}
    return http.PUT({ url: URL.dreamActServer + '/user/api/activityList/update', data })
  },
  // 南北站活动热力值
  getAllCount: function () {
    const data = { }
    return http.GET({ url: URL.dreamActServer + '/activity/index/countList/selectMap', data })
  },
  // 南北站活动战队数量
  getCountByType: function () {
    const data = { type: 1 }
    return http.GET({ url: URL.dreamActServer + '/activity/index/countList/selectByType', data })
  },
  // Banner埋点
  openBannerRecord: function ({dataId}) {
    const data = { dataId }
    return http.POST({ url: URL.dreamActServer + '/index/click/insertData', data })
  },

  // 物料抽奖
  // 用户抽奖
  wl_drawPrize: function () {
    const data = {}
    return http.POST({ url: URL.dreamActServer + '/user/api/drawPrize', data })
  },
  // 获取抽奖信息及余额
  wl_getPrizeInfo: function () {
    const data = {}
    return http.GET({ url: URL.dreamActServer + '/user/api/selectUserAndMoney', data })
  },
  // 获取顶部公告列表
  wl_getNoticeList: function () {
    const data = {}
    return http.GET({ url: URL.dreamActServer + '/user/api/selectNoticeList', data })
  },
  // 检查抽奖资格
  wl_checkDrawPrize: function () {
    const data = {}
    return http.GET({ url: URL.dreamActServer + '/user/api/checkDrawPrize', data })
  }
}