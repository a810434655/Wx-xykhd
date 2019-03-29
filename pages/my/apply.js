// pages/my/apply.js
var _user = require('../../service/user.js')
const { $Message } = require('../../resources/dist/base/index')
var app = getApp()
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    applyList: [],
    page: 1,
    size: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
  },
  onShow: function (){
    that.data.page = 1
    that.getData()
  },
  getData: function () {
    _user.getUserTicket({ page: that.data.page, size: that.data.size, type: '1' }).then(data => {
      if (that.data.page == 1) {
        that.data.applyList.splice(0, that.data.applyList.length)
      }
      for (var c of data) {
        c.jsonData = JSON.parse(c.jsonData)
      }
      that.setData({
        applyList: that.data.applyList.concat(data)
      })
      wx.stopPullDownRefresh()
      wx.hideLoading()
    }).catch(errMsg => {
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
  openInfo: function (e) {
    wx.navigateTo({
      url: `/pages/my/applyinfo?info=${JSON.stringify(that.data.applyList[e.currentTarget.dataset.inx])}`
    })
  }
})