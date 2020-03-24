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
  // getUserIdentification: function () {
  //   const data = {
  //   }
  //   return http.GET({ url: URL.dreamOnServer + '/user/DoIdentification/selectIdentification', data })
  // },
  // 申请认证
  putUserIdentification: function (data) {
    data.miniId = 1
    return http.POST({
      url: URL.dreamOnServer + '/user/DoIdentification/insert', data })
  },
  // 获取我的门票
  getUserTicket: function ({ page, size, type, flag }) {
   let data
      if(flag){
        data = {
          page,
          size,
          type,
          flag
        }
      }else{
        data = {
          page,
          size,
          type
        }
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
  },  
  // 拿到用户基础信息
  getUserMeage:function(){
    let token
    wx.getStorage({
      key: 'token',
      success: function(res) {
        token = res.data
      },
    })
  const data = {
     token
  }
  return http.GET(
    {
      url: URL.authServer + "/user/admin/getUserInfo",
      data
    }
  )
  },
  // 获取用户全部信息
  getSchool:function({userId}){
    const data = {
      userId: userId
    }
    return http.GET({
        url: URL.authServer + "/user/AuthUser/selectByUserId",
        data
    })
  },
  // 获取报名详情信息
  getApplyInfo: function ({ id }) {
    const data = {
      id: id
    }
    return http.GET({
      url: URL.dreamActServer + "/user/DaFormData/selectById",
      data
    })
  },
  // setPhone: function ({ rdCode, encryptedData,iv }){
  //   const data = {
  //     rdCode,
  //     encryptedData,
  //     iv
  //   }
  //   const data = {
  //     code: this.value,
  //     phone: this.$route.query.phone,
  //     systemId: 4,
  //     uniqueId: uuid.generateUUID()
  //   }
  //   return http.PUT({
  //     url: URL.authServer + "/user/AuthUser/bindPhone",
  //     data
  //   })
  // },
  phoneCode({codeType,phone}){
    const data = {
      codeType,
      phone
    }
    return http.GET({
      url: URL.authServer + "/sso/getCode",
      data
    }
    )
  },
  phoneLogin({ code, phone, systemId, uniqueId}){
    const data = {
      code:code,
      phone:phone,
      systemId: 4,
      uniqueId: uniqueId
    }
    return http.POST({
      url: URL.authServer + "/sso/other/login",
      data
    })

  },
  quit(){
    let data = {

    }
    return http.GET({
      url: URL.authServer + "/sso/logout",
      data
    })
  },
  getTicket({ formId, number }) {
    let data = {
      formId,
      number
    }
    return http.POST({
      url: URL.dreamActServer + '/user/DaFormData/encodeTicket',
      data
    })
}
}
