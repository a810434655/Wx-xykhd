var URL = require("../config/config.js")
var http = require("../utils/request.js")

module.exports = {
  // 查询首页Banner
  getBanner: function ({ belong , schoolId}) {
    const data = {
      belong, 
      schoolId
    }
    return http.GET({ url: URL.dreamStarServer + '/index/banner/selectAll', data })
  },
  // 查询热门活动
  getHotActivity: function ({schoolId}) {
    const data = {
       schoolId 
    }
    return http.GET({
      url: URL.dreamActServer + '/user/DaActivity/selectHotAll',
      data
    })
  },
  // 查询热度活动
  getHeatActivity: function ({ page, size, type, schoolId}) {
    // console.log(schoolId)
    if(schoolId){
      var data = {
        page,
        size,
        type,
        schoolId
      }
    }else{
      var data = {
        page,
        size,
        type
      }
    }
    return http.GET({
      url: URL.dreamActServer + '/user/DaActivity/selectHeatPage',
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
      page: 1, size: 50, name: name
    }
    return http.GET({
      url: URL.dreamActServer + '/index/school/selectPage',
      data
    })
  },
  // 查询学校所有组织
  getSchoolGroup: function ({schoolId}) {
    const data = {
      page: 1, size: 100, schoolId: schoolId
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
      url: URL.dreamActServer + '/user/DaActivity/selectKeywordPage',
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
// 查询高校热门活动
  getSelectPageByType: function ({ page, size, type, schoolId }){
    const data = { page, size, type, schoolId }
    return http.GET({
      url: URL.dreamActServer + '/user/DaActivity/selectPageByType',
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