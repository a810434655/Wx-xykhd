var URL = require("../config/config.js")
var http = require("../utils/request.js")

module.exports = {
 
  // 查询活动留言
  getActivityCommentPage: function ({ page, size, activityId }) {
    const data = {
      page,
      size,
      activityId: activityId
    }
    return http.GET({
      url: URL.dreamActServer + '/user/DaComment/selectPage',
      data
    })
  },
  // 新增活动留言
  creatActivityComment: function ({ activityId, content, nickname, avatar, pid, puserId, pnickname}) {
    const data = {
      activityId,
      content,
      nickname,
      avatar,
      type: '1', pid, puserId, pnickname
    }
    return http.POST({
      url: URL.dreamActServer + '/user/DaComment/insert',
      data
    })
  },
  // 删除活动留言
  deleteComment: function ({ id }) {
    const data = {
      id,
      type: '1'
    }
    return http.DEL({
      url: URL.dreamActServer + '/user/DaComment/deleteByAdmin',
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