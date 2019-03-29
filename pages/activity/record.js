// pages/activity/record.js
var _activity = require("../../service/activity.js")
const { $Message } = require('../../resources/dist/base/index')
var app = getApp()
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '0',
    collectList: [],
    recordList: [],
    scrollTop: 0,
    page: 1,
    size: 10,
    animationData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this
    that.data.type = options.type
    that.setData({
      type: that.data.type,
      typeA: that.data.type
    })
    that.animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    // that.getData()
  },
  onShow: function () {
    that.onPullDownRefresh()
  },
  selectTab: function(e) {
    // that.animation.translateX(e.target.offsetLeft).scaleX(1).step()
    // that.setData({
    //   animationX: e.target.offsetLeft,
    //   animationData: that.animation.export(),
    //   animationDataR: that.animation.export()
    // })
    that.setData({
      type: e.currentTarget.dataset.type,
      scrollTop: 0
    })
    that.onPullDownRefresh()
  },
  getData: function () {
    if(that.data.type == 1){
      _activity.getUserActivityPage({ page: that.data.page, size: that.data.size }).then(data => {
        data.forEach(e => {
          e.bannerData = JSON.parse(e.bannerData)
        })
        if (that.data.page == 1) {
          that.data.recordList.splice(0, that.data.recordList.length)
        }
        that.setData({
          recordList: that.data.recordList.concat(data)
        })
        wx.stopPullDownRefresh()
        wx.hideLoading()
      }).catch(errMsg => {
        wx.stopPullDownRefresh()
        wx.hideLoading()
      })
    }else {
      _activity.getCollectActivityPage({ page: that.data.page, size: that.data.size }).then(data => {
        data.forEach(e => {
          e.bannerData = JSON.parse(e.bannerData)
        })
        if (that.data.page == 1) {
          that.data.collectList.splice(0, that.data.collectList.length)
        }
        that.setData({
          collectList: that.data.collectList.concat(data)
        })
        wx.stopPullDownRefresh()
        wx.hideLoading()
      }).catch(errMsg => {
        wx.stopPullDownRefresh()
        wx.hideLoading()
      })
    }
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
      url: `/pages/activity/info?id=${e.currentTarget.dataset.id}`
    })
  },
  // 取消收藏活动
  cancelCollect: function (e) {
    wx.showLoading({
      title: '取消中...',
      mask: true
    })
    _activity.collectActivity({
      activityId: e.currentTarget.dataset.id
    }).then(data => {
      //that.onPullDownRefresh()
      wx.hideLoading()
      app.sliderightshow(that, `collectList[${e.currentTarget.dataset.inx}].anim`, 600, 0.1)
      setTimeout(function () {
        that.data.collectList[e.currentTarget.dataset.inx].collectId = 0
        that.setData({
          collectList: that.data.collectList
        })
      }.bind(that), 400)
    }).catch(errMsg => {
      $Message({
        content: errMsg,
        type: 'warning'
      })
      wx.hideLoading()
    })
  },
  // 删除浏览记录
  deleteRecord: function (e) {
    wx.showLoading({
      title: '删除中...',
      mask: true
    })
    _activity.deleteActivityRecord({
      id: e.currentTarget.dataset.id
    }).then(data => {
      //that.onPullDownRefresh()
      wx.hideLoading()
      app.sliderightshow(that, `recordList[${e.currentTarget.dataset.inx}].anim`, 600, 0.1)
      setTimeout(function () {
        that.data.recordList[e.currentTarget.dataset.inx].viewId = 0
        that.setData({
          recordList: that.data.recordList
        })
      }.bind(that), 400)
      
    }).catch(errMsg => {
      $Message({
        content: errMsg,
        type: 'warning'
      })
      wx.hideLoading()
    })
  }
})