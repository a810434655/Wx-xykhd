var URL = require("../config/config.js")
var http = require("../utils/request.js")

module.exports = {
  // 查询首页Banner
  getBanner: function () {
    const data = {}
    return http.GET({ url: URL.dreamActServer + '/index/banner/selectAll', data })
  },
  // 查询热门活动
  getHotActivity: function () {
    const data = {}
    return http.GET({
      url: URL.dreamActServer + '/index/activity/selectHotPage',
      data
    })
  },
  // 查询热度活动
  getHeatActivity: function ({ page, size, areaId, type }) {
    const data = {
      page,
      size, 
      areaId, 
      type
    }
    return http.GET({
      url: URL.dreamActServer + '/index/activity/selectHeatPage',
      data
    })
  },
  // 查询飙升活动
  getSoarActivity: function ({ page, size, areaId, type }) {
    const data = {
      page,
      size, 
      areaId, 
      type
    }
    return http.GET({
      url: URL.dreamActServer + '/index/activity/soaringList',
      data
    })
  },
  // 查询聚能小活动
  getDreamH5: function () {
    const data = {}
    return http.GET({
      url: URL.dreamActServer + '/index/activity/dreamActivityList',
      data
    })
  },
  // 搜索学校
  getSchoolList: function ({ name }) {
    const data = {
      page: 1, size: 8, _name: name
    }
    return http.GET({
      url: URL.dreamActServer + '/index/school/selectPage',
      data
    })
  },
  // 查询学校所有组织
  getSchoolGroup: function ({ school_id}) {
    const data = {
      page: 1, size: 100, school_id: school_id
    }
    return http.GET({
      url: URL.dreamActServer + '/index/group/selectPage',
      data
    })
  },
  // 搜索基础活动
  searchActivityPage: function (data) {
    // page, size
    return http.GET({
      url: URL.dreamActServer + '/index/activity/searchActivityPage',
      data
    })
  },
  // 查询基础活动
  getActivityPage: function (data) {
    // page, size
    return http.GET({
      url: URL.dreamActServer + '/index/activity/selectDefaultPage',
      data
    })
  },
  // 屏蔽此活动留言用户
  deleteUserComment: function ({ id }) {
    const data = {
      id,
      type: '2'
    }
    return http.DEL({
      url: URL.dreamActServer + '/user/DaComment/deleteByAdmin',
      data
    })
  }
}