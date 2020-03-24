// pages/login.js
const { $Message } = require('../resources/dist/base/index')
const app = getApp()
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        console.log(res)
        // if (res.authSetting['scope.userInfo']) {
        //   // 已经授权，可以直接调用 getUserInfo 获取头像昵称
        //   wx.getUserInfo({
        //     success: function (res) {
        //       console.log(res.userInfo)
        //     }
        //   })
        // }
      }
    })
  
  },
  bindGetUserInfo: function (e) {
    console.log(e)
    if (e.detail.userInfo) {
        wx.navigateBack({})
      // setTimeout(function () {
      //   wx.navigateBack({})
      // }, 2000)
    } else {
      $Message({
        content: '未授权您将无法登陆查看您的课程及享受服务',
        type: 'warning'
      })
    }
  }
})