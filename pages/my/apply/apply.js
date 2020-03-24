// pages/my/apply/apply.js
var _user = require('../../../service/user.js')
const { $Message } = require('../../../resources/dist/base/index')
var showDate = require("../../../utils/date.js")
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
      // console.log(data)
      if (that.data.page == 1) {
        that.data.applyList.splice(0, that.data.applyList.length)
      }
      data.records.forEach(item=>{
        item.beginDate = showDate.newDateH(item.beginDate)
        item.endDate = showDate.newDateH(item.endDate)
      })
      that.setData({
        applyList: that.data.applyList.concat(data.records)
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
  openInfo: function (e) {
    console.log()
    
    wx.navigateTo({
    url: `/pages/my/apply/applyinfo?id=${JSON.stringify(that.data.applyList[e.currentTarget.dataset.inx].id)}`
    })
  }
})