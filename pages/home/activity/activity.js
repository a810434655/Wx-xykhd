// pages/home/activity.js
var _activity = require("../../../service/activity.js")
const { $Message } = require('../../../resources/dist/base/index')
var app = getApp()
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLogin: false,
    activity1Modal: false,
    activityList: [],
    showLogin: false,
    page: 1,
    size: 10,
    h5iconAnimation: {},
    scene: '',
    activityCode: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    that.data.scene = options.scene
  },
  onShow: function () {
    // var animation = wx.createAnimation({
    //   duration: 400,
    //   timingFunction: 'linear',
    // })
    // this.animation = animation
    // animation.scale(2, 2).rotate(45).step()

    // this.setData({
    //   h5iconAnimation: animation.export()
    // })
    // 获取用户信息
    if (wx.getStorageSync('user')) {
      that.setData({
        showLogin: false
      })
      if (that.data.activityList.length == 0) {
        wx.showLoading({
          title: '加载中...',
          mask: true
        })
        setTimeout(function(){
          that.data.page = 1
          that.getData()
        },2000)
      }
      that.actionActivity()
    } else {
      wx.getSetting({
        success: res => {
          console.error(res)
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            if (!wx.getStorageSync('token')) {
              app.login(that.actionActivity)
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
          if (this.userInfoReadyCallback) {
            this.userInfoReadyCallback(res)
          }
        }
      })
    }
  },



  actionActivity: function (){
    if (that.data.scene != undefined && that.data.scene.length > 2) {
      let acId = that.data.scene.substr(0, 2)
      that.data.activityCode = that.data.scene.substr(2, that.data.scene.length)
      if(acId == 'a1') {
        // a1 活动 绑定检票员
        that.setData({
          activity1Modal: true
        })
      }
      that.data.scene = ''
      console.error(acId, that.data.activityCode)
    }
  },
  handleActivity1: function() {
    _activity.addTicketUser({ code: that.data.activityCode }).then(data => {
      $Message({
        content: `您已成功绑定检票员，请进活动管理查看`
      })
      that.setData({
        activity1Modal: false
      })
    }).catch(e => {
      $Message({
        content: e.message,
        type: 'warning'
      })
    })
  },
  openInfo: function (e) {
    wx.navigateTo({
      url: `/pages/activity/info/info?id=${e.currentTarget.dataset.id}`
    })
  },
  handleClose: function () {
    that.setData({
      activity1Modal: false
    })
  },
  getData: function () {
    _activity.getUserActivityPage({ page: that.data.page, size: that.data.size }).then(data => {
      if (that.data.page == 1) {
        that.data.activityList.splice(0, that.data.activityList.length)
      }
      that.setData({
        activityList: that.data.activityList.concat(data)
      })
      wx.stopPullDownRefresh()
      wx.hideLoading()
    }).catch(e => {
      wx.stopPullDownRefresh()
      wx.hideLoading()
    })
  },
  onPullDownRefresh: function () {
    that.data.page = 1
    that.getData()
  },
  onReachBottom: function () {
    that.data.page++
    that.getData()
  },
  toH5: function(){
    wx.navigateTo({
      url: `/pages/ui/webview`
    })
  }
})