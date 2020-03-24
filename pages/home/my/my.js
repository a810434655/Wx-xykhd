// pages/home/my/my.js
var app = getApp()
var _special = require("../../../service/special.js")
var _user = require("../../../service/user.js")
const { $Message, $Toast } = require('../../../resources/dist/base/index')

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
      avatarUrl:""
    },
    phone:"",
    menuList: [{
        name: '我的门票',
        pic: '/resources/image/my/ic_ticket.png',
        url: '/pages/my/ticket/ticket'
      },
      {
        name: '我的报名',
        pic: '/resources/image/my/ic_apply.png',
        url: '/pages/my/apply/apply'
      },
      {
        name: '消息中心',
        pic: '/resources/image/my/ic_mail.png',
        url: '/pages/my/message/index'
      },
      {
        name: '使用攻略',
        pic: '/resources/image/my/ic_fqa.png',
        url: '/pages/ui/webview/webview?url=https://oss.dreamoncampus.com/use/index.html#/'
      },

      {
        name: '关于我们',
        pic: '/resources/image/my/ic_about.png',
        url: '/pages/my/aboutus/aboutus'
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
    if (!wx.getStorageSync("userId")){
      that.setData({
        showLogin:true
      })
      return false
    }else{
     that.setData({
       showLogin: false
     })
     that.getUser()
     that.getMessage()
    }
    $Toast.hide();
  },
  getMessage: function () {
    _user.getUserMessageInfo().then(data => {
      // console.log(data)
      that.setData({
        messageInfo: data
      })
    }).catch(e => {
      $Message({
        content: e.message,
        type: 'warning'
      })
    })
  },
  getUser() {
    _user.getUserMeage()
      .then(item => {
        let data = {
          nickName: item.nickname,
          avatar: item.avatar
        }
        that.setData({
          userInfo:data
        })
        wx.setStorageSync("userInfo", data)
        wx.setStorageSync("phone", item.phone)
      })
      .catch(e => {
        $Message({
          content: e.message,
          type: 'warning'
        })
      })
  },
  toLogin: function () {
    // 前往登录界面
    wx.navigateTo({
      url: '/pages/login',
    })
  },
  openPage: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  openGroupPage: function (e) {
    wx.navigateTo({
      url: `/pages/ui/webview/webview?url=http://172.16.10.92:8080/#/group%3fgroupId%3d${that.data.studentI.groupId}`
    })
  },
  modification:function(){
    wx.navigateTo({
      url: `/pages/my/modification/modification`
    })
  },
  onShareAppMessage: function (res) {
    // 来自页面内转发按钮
    var path = `/pages/home/plaza/plaza`
    var title = `创建最酷校园活动，助力南北活动战队拿大奖！`
    return {
      title: title,
      imageUrl: `https://oss.dreamoncampus.com/img/share1234.png`,
      path: path
    }
  }
})