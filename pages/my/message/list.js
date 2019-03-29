// pages/my/message/list.js
var _user = require('../../../service/user.js')
var _util = require('../../../utils/util.js')
var app = getApp()
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    platform: '',
    type: 0,
    messageList: [],
    page: 1,
    size: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    that.data.type = options.type
    that.data.platform = wx.getSystemInfoSync().platform
  },
  onShow: function () {
    that.data.page = 1
    that.getData()
  },
  getData: function () {
    _user.getUserMessage({ page: that.data.page, size: that.data.size, type: that.data.type }).then(data => {
      if (that.data.page == 1) {
        that.data.messageList.splice(0, that.data.messageList.length)
      }
      data.records.forEach(c => {
        if (that.data.platform == 'ios') {
          c.ctime = c.ctime.replace(/-/g, "/").replace("T", " ").substring(0,18)
        }
        var ctime = new Date(c.ctime)
        c.ctime = _util.formatTime(ctime)
        if(c.jsonData){
          c.jsonData = JSON.parse(c.jsonData)
        }
      })
      that.setData({
        messageList: that.data.messageList.concat(data.records)
      })
      wx.stopPullDownRefresh()
      wx.hideLoading()
    }).catch(errMsg => {
      console.error(errMsg)
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
  }
})