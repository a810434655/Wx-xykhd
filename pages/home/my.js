// pages/home/my.js
var app = getApp()
var _special = require("../../service/special.js")
var _user = require("../../service/user.js")
const { $Message } = require('../../resources/dist/base/index')
var that
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showLogin: false,
    studentI: {
      status: 99
    },
    subStudentI: {
      status: 99
    },
    iden: false,
    idenModal: false,
    idenFailModal: false,
    idenFarstModal: false,
    idenFarstInfo: '',
    messageInfo: {
      systemMessage: 0,
      drawPrizeNotice: 0,
      admissionReminder: 0,
      interactiveMessage: 0
    },
    userInfo: {
      nickName: "",
      avatarUrl: ""
    },
    menuList: [{
        name: '我的门票',
        pic: '/resources/image/my/ic_ticket.png',
        url: '/pages/my/ticket'
      },
      {
        name: '我的报名',
        pic: '/resources/image/my/ic_apply.png',
        url: '/pages/my/apply'
      },
      {
        name: '消息中心',
        pic: '/resources/image/my/ic_mail.png',
        url: '/pages/my/message/index'
      },
      {
        name: '使用攻略',
        pic: '/resources/image/my/ic_fqa.png',
        url: '/pages/my/fullimg?url=https://oss.dreamoncampus.com/img/changtu1.png&title=使用攻略'
      },
      {
        name: '加入社群',
        pic: '/resources/image/my/ic_home.png',
        url: '/pages/my/fullimg?url=https://oss.dreamoncampus.com/img/joinus.png&title=加入社群'
      },
      {
        name: '关于我们',
        pic: '/resources/image/my/ic_about.png',
        url: '/pages/my/aboutus'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this
  },
  onShow: function () {
    // 获取用户信息
    if (wx.getStorageSync('user')) {
      that.setData({
        showLogin: false
      })
      wx.getUserInfo({
        success: res => {
          // 可以将 res 发送给后台解码出 unionId
          that.setData({
            userInfo: res.userInfo
          })
        }
      })
      that.getIdent()
    } else {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                that.setData({
                  userInfo: res.userInfo
                })
              }
            })
            if (!wx.getStorageSync('token')) {
              app.login(that.getIdent)
            }
            that.setData({
              showLogin: false
            })
          } else {
            //app.toLogin()
            that.setData({
              showLogin: true
            })
          }
        }
      })
    }
  },
  getIdent: function() {
    _user.getUserIdentification().then(data => {
      data.forEach(e => {
        if (e.type == 1) {
          that.setData({
            studentI: e
          })
        }else if (e.type == 3){
          that.setData({
            subStudentI: e
          })
        }
      })
      that.data.iden = true
      //获取消息提醒
      that.getMessage()
      wx.hideLoading()
    }).catch(errMsg => {
      wx.hideLoading()
    })
  },
  getMessage: function () {
    _user.getUserMessageInfo().then(data => {
      that.setData({
        messageInfo: data
      })
    }).catch(errMsg => {
      console.error(errMsg)
    })
  },
  ident: function (e) {
    if (!that.data.iden){return}
    if (e.currentTarget.dataset.id == 1) {
      switch (that.data.studentI.status) {
        case 99:
          that.setData({
            idenId: 1,
            idenFarstInfo: `一分钟完成身份认证，和全国500+学生组织一起体验最酷的校园活动一站式解决方案`,
            idenFarstModal: true
          })
          // wx.navigateTo({
          //   url: '/pages/my/identification?id=1&title=学生组织认证'
          // })
          break
        case 3:
          that.setData({
            idenId: 1,
            idenFailModal: true
          })
          break
        case 1:
          that.setData({
            idenModal: true
          })
          break
        case 2:
          $Message({
            content: '您已完成认证，当前不支持修改认证',
            type: 'success'
          })
          // wx.navigateTo({
          //   url: '/pages/my/identification?id=1&title=学生组织认证'
          // })
          break
      }
    } else if (e.currentTarget.dataset.id == 3) {
      switch (that.data.subStudentI.status) {
        case 99:
          that.setData({
            idenId: 3,
            idenFarstInfo: `完成学生认证即获得10次点赞机会参与助力南北活动战队，并可参与点赞抽奖哦~\n(完成学生组织工作者认证后将自动通过该认证，请勿重复认证)`,
            idenFarstModal: true
          })
          // wx.navigateTo({
          //   url: '/pages/my/identification?id=3&title=在校学生认证'
          // })
          break
        case 3:
          that.setData({
            idenId: 3,
            idenFailModal: true
          })
          break
        case 1:
          that.setData({
            idenModal: true
          })
          break
        case 2:
          $Message({
            content: '您已完成认证，当前不支持修改认证',
            type: 'success'
          })
          break
      }
    }
  },
  handleClose: function () {
    that.setData({
      idenModal: false,
      idenFailModal: false,
      idenFarstModal: false
    })
  },
  openIden: function () {
    that.handleClose()
    if (that.data.idenId == 1) {
      wx.navigateTo({
        url: '/pages/my/identification?id=1&title=学生组织认证'
      })
    } else if (that.data.idenId == 3) {
      wx.navigateTo({
        url: '/pages/my/identification?id=3&title=在校学生认证'
      })
    }
  },
  getIdenInfo: function (fallback) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    _special.getInfoByKey({ key: 'idenInfo' }).then(data => {
      fallback(data.valueSetting)
      wx.hideLoading()
    }).catch(errMsg => {
      $Message({
        content: errMsg,
        type: 'warning'
      })
      wx.hideLoading()
    })
  },
  openPage: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  openGroupPage: function (e) {
    wx.navigateTo({
      url: `/pages/ui/webview?url=http://172.16.10.92:8080/#/group%3fgroupId%3d${that.data.studentI.groupId}`
    })
  },
  toLogin: function (e) {
    if (e.detail.userInfo) {
      app.login(function () {
        that.onShow()
        that.setData({
          showLogin: false
        })
      })
    } else {
      $Message({
        content: '未授权您将无法登陆查看您的课程及享受服务',
        type: 'warning'
      })
    }
  },
  onShareAppMessage: function (res) {
    // 来自页面内转发按钮
    console.log(res.target)
    var path = `/pages/home/plaza`
    var title = `创建最酷校园活动，助力南北活动战队拿大奖！`
    return {
      title: title,
      imageUrl: `https://oss.dreamoncampus.com/img/share1234.png`,
      path: path
    }
  }
})