var URL = require("../config/config.js")
var http = require("../utils/request.js")

module.exports = {
  // 新增活动
  creatActivity: function ({ address, bannerData, beginDate, content, endDate, name,
    notice, organizer, phone, posterData, realname, remark, shareLink, timeLine, theme, type, join, schoolId, schoolName
  }) {
    const data = {
      address,
      bannerData,
      beginDate,
      content,
      endDate,
      name,
      notice,
      organizer,
      phone,
      posterData,
      realname,
      remark,
      shareLink,
      timeLine,
      theme,
      type,
      join,
      schoolId,
      schoolName
    }
    return http.POST({
      url: URL.dreamActServer + '/user/DaActivity/insert',
      data
    })
  },
  // 编辑活动
  editActivity: function ({ activityId, address, bannerData, beginDate, content, endDate, name,
    notice, organizer, phone, posterData, realname, remark, shareLink, timeLine, theme, type, join, schoolId, schoolName
  }) {
    const data = {
      activityId,
      address,
      bannerData,
      beginDate,
      content,
      endDate,
      name,
      notice,
      organizer,
      phone,
      posterData,
      realname,
      remark,
      shareLink,
      timeLine,
      theme,
      type,
      join
    }
    return http.PUT({
      url: URL.dreamActServer + '/user/DaActivity/updateById',
      data
    })
  },
  // 收藏活动
  collectActivity: function ({ activityId, type }) {
    const data = {
      activityId,
      type
    }
    return http.POST({
      url: URL.dreamActServer + '/user/DaCollect/insertOrCancel',
      data
    })
  },
  // 删除浏览记录
  deleteActivityRecord: function ({ id }) {
    const data = {
      id
    }
    return http.DEL({
      url: URL.dreamActServer + '/user/DaView/delete',
      data
    })
  },
  // 获取用户收藏的活动
  getCollectActivityPage: function ({ page, size }) {
    const data = {
      page,
      size
    }
    return http.GET({
      url: URL.dreamActServer + '/user/DaCollect/selectPage',
      data
    })
  },
  // 获取用户创建的活动
  getActivityPage: function (data) {
    return http.GET({
      url: URL.dreamActServer + '/user/DaActivity/selectPage',
      data
    })
  },
  // 获取用户浏览过的活动
  getUserActivityPage: function ({ page, size }) {
    const data = {
      page,
      size
    }
    return http.GET({
      url: URL.dreamActServer + '/user/DaView/selectPage',
      data
    })
  },
  // 根据ID查询活动 浏览
  getUserActivityById: function ({ activityId, userId }) {
    let data
    if (userId == 1) {
      data = {
        activityId,
        userId: qq.getStorageSync("userId")
      }
    } else {
      data = {
        activityId,
      }
    }
    return http.GET({
      url: URL.dreamActServer + '/user/DaActivity/selectById',
      data
    })
  },
  // 查找用户是否符合现场投票条件
  getSceneInfo: function ({ formId }) {
    const data = {
      formId
    }
    return http.GET({
      url: URL.dreamActServer + '/user/DaUserCastVote/checkVotePermission',
      data
    })
  },
  // 根据ID删除我的活动
  deleteActivity: function ({ activityId }) {
    const data = {
      activityId
    }
    return http.DEL({
      url: URL.dreamActServer + '/user/DaActivity/deleteMySelf',
      data
    })
  },
  // 获取活动表单
  getActivityForm: function ({ formId }) {
    const data = {
      formId,
    }
    return http.GET({
      url: URL.dreamActServer + '/user/DaForm/selectById',
      data
    })
  },
  // 获取活动功能表单
  getActivityFunction: function ({ activityId }) {
    const data = {
      activityId
    }
    return http.GET({
      url: URL.dreamActServer + '/user/DaForm/selectListById',
      data
    })
  },
  // 用户提交活动抢票表单
  postUserTicketForm: function ({ jsonData, formId, name, key }) {
    const data = {
      jsonData,
      formId,
      name,
      key
    }
    return http.POST({
      url: URL.dreamActServer + '/user/DaFormData/insertTicket',
      data
    })
  },
  // 用户提交活动报名表单
  postUserApplyForm: function ({ jsonData, formId, name }) {
    const data = {
      jsonData,
      formId,
      name
    }
    return http.POST({
      url: URL.dreamActServer + '/user/DaFormData/insertEnroll',
      data
    })
  },
  // 用户覆盖活动报名表单
  postReUserApplyForm: function ({ activityId, jsonData, formId }) {
    const data = {
      activityId,
      jsonData,
      formId
    }
    return http.POST({
      url: URL.dreamActServer + '/user/DaFormData/coverEnroll',
      data
    })
  },
  // 用户提交投票表单
  postUserVoteForm: function ({ formId, optionId }) {
    const data = {
      formId,
      optionId
    }
    return http.POST({
      url: URL.dreamActServer + '/user/DaUserCastVote/insert',
      data
    })
  },
  // 用户提交抽奖表单
  postUserLotteryForm: function ({ formId, phone, name }) {
    const data = {
      formId,
      phone,
      name
    }
    return http.POST({
      url: URL.dreamActServer + '/user/DaUserDrawPrize/insert',
      data
    })
  },
  // 创建活动表单
  creatActivityForm: function ({ activityId, jsonData, type, totalTickets, beginDate, endDate, extraData }) {
    const data = {
      activityId,
      jsonData,
      type,
      totalTickets,
      beginDate,
      endDate,
      extraData
    }
    return http.POST({
      url: URL.dreamActServer + '/user/DaForm/insert',
      data
    })
  },
  // 编辑活动表单
  editActivityForm: function ({ activityId, jsonData, type, totalTickets, formId, beginDate, endDate, extraData }) {
    const data = {
      activityId,
      jsonData,
      type,
      totalTickets,
      formId,
      beginDate,
      endDate,
      extraData
    }
    return http.PUT({
      url: URL.dreamActServer + '/user/DaForm/updateById',
      data
    })
  },
  // 编辑活动表单截至日期
  editActivityFormDate: function ({ formId, endDate }) {
    const data = {
      formId,
      endDate
    }
    return http.PUT({
      url: URL.dreamActServer + '/user/DaForm/updateDate',
      data
    })
  },
  // 追加抢票数量
  addTicketNum: function ({ activityId, number }) {
    const data = {
      activityId,
      number
    }
    return http.PUT({
      url: URL.dreamActServer + '/user/DaForm/addTicket',
      data
    })
  },
  // 删除活动表单
  deleteActivityForm: function ({ activityId, type }) {
    const data = {
      activityId,
      type
    }
    return http.DEL({
      url: URL.dreamActServer + '/user/DaFormData/deleteFormData',
      data
    })
  },
  // 获取表单数据
  getActivityFormPage: function ({ page, size, formId }) {
    const data = {
      page,
      size,
      formId
    }
    return http.GET({
      url: URL.dreamActServer + '/user/DaFormData/selectDataPage',
      data
    })
  },
  // 获取表单数据
  // getActivityFormPage: function ({ page, size, activityId, type }) {
  //   const data = {
  //     page,
  //     size,
  //     activityId,
  //     type
  //   }
  //   return http.GET({
  //     url: URL.dreamActServer + '/user/DaFormData/selectPage',
  //     data
  //   })
  // },
  // 活动强行开奖
  activityLottery: function ({ activityId }) {
    const data = {
      activityId
    }
    return http.GET({
      url: URL.dreamActServer + '/user/DaUserDrawPrize/handRunLottery',
      data
    })
  },
  
  // 发送各类表单数据
  sendMailFormData: function ({ activityId, email, type }) {
    const data = {
      activityId,
      email,
      type
    }
    return http.GET({
      url: URL.dreamActServer + '/user/DaFormData/downloadData',
      data
    })
  },
  // 获取检票员
  getAllTicketUser: function ({ activityId }) {
    const data = {
      activityId
    }
    return http.GET({
      url: URL.dreamActServer + '/user/DaForm/selectActivityUser',
      data
    })
  },
  // 新增检票员
  addTicketUser: function ({ code }) {
    const data = {
      code
    }
    return http.POST({
      url: URL.dreamActServer + '/user/DaForm/insertTicketUser',
      data
    })
  },
  // 删除检票员
  deleteTicketUser: function ({ id }) {
    const data = {
      id
    }
    return http.DEL({
      url: URL.dreamActServer + '/user/DaForm/deleteTicketUser',
      data
    })
  },
  // 用户检票
  putUserApplyForm: function ({ activityId, number }) {
    const data = {
      activityId,
      number
    }
    return http.PUT({
      url: URL.dreamActServer + '/user/DaFormData/checkTicket',
      data
    })
  },
  putOperateVote: function ({ formId, activityId }) {
    const data = {
      formId,
      activityId
    }
    return http.PUT({
      url: URL.dreamActServer + "/user/DaForm/operateVote",
      data
    })
  },
  // 获取热门活动
  getHotActivity: function ({ schoolId }) {
    const data = {
      schoolId
    }
    return http.GET({
      url: URL.dreamActServer + "/user/DaActivity/selectHotAll",
      data
    })
  },
  // 获取分页活动
  getPickerChange: function ({ page, size, schoolId }) {
    const data = {
      page,
      size,
      schoolId
    }
    return http.GET({
      url: URL.dreamActServer + "/user/DaActivity/selectPage",
      data
    })
  },
  putUpdata: function (data) {
    return http.PUT({
      url: URL.dreamStarServer + '/user/DsUser/update',
      data
    })
  },
  getBanner: function () {
    const data = {
      belong:2,
      schoolId: wx.getStorageSync("schoolId")
    }
    return http.GET({
      url: URL.dreamStarServer + '/index/banner/selectAll',
      data
    })
  },
  castVote:function(optionId,formId){
    const data = {
      optionId:optionId,
      formId:formId
    } 
    return http.POST({
      url: URL.dreamActServer + '/user/DaUserCastVote/castVote',
      data
    })
    
  }

}