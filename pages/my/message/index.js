// pages/my/message/index.js
var _user = require("../../../service/user.js")
var util = require('../../../utils/util.js')
var app = getApp()
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageInfo:{
      systemMessage: 0,
      drawPrizeNotice: 0,
      admissionReminder: 0,
      interactiveMessage: 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    _user.getUserMessageInfo().then(data => {
      that.setData({
        messageInfo: data
      })
    }).catch(e => {
      $Message({
        content: e.message,
        type: 'warning'
      })
      // wx.navigateBack({})
      wx.hideLoading()
    })
  },
  openPage: function (e) {
    wx.navigateTo({
      url: `/pages/my/message/list?type=${e.currentTarget.dataset.type}`
    })
  }
})