// pages/activity/top.js
var _area = require("../../data/area.js")
var _activityclassify = require("../../data/activityclassify.js")
var _activity = require("../../service/activity.js")
var _home = require("../../service/home.js")
const {
  $Message
} = require('../../resources/dist/base/index')
var app = getApp()
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0,
    activityList: [],
    areaList: _area,
    activityclassifyList:
      [{id: -1, name:'总榜'}].concat(_activityclassify),
    area: {name:'全国'},
    activityClassify: {name:'总榜'},
    page: 1,
    size: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
  },
  onShow: function () {
    that.onPullDownRefresh()
  },
  switchList: function() {
    that.setData({
      type: that.data.type == 1 ? 0: 1
    })
    wx.setNavigationBarTitle({
      title: that.data.type == 0 ? '高校活动热度榜' : '高校活动飙升榜'
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: that.data.type == 0 ? '#FF6B57' : '#8A7EFE',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    that.onPullDownRefresh()
  },
  // 调用接口获取
  getData: function () {
    if (that.data.type == 0) {
      _home.getHeatActivity({ page: that.data.page, size: that.data.size, areaId: that.data.area.id, type: that.data.activityClassify.id }).then(data => {
        data.forEach(e => {
          e.bannerData = JSON.parse(e.bannerData)
        })
        if (that.data.page == 1) {
          that.data.activityList.splice(0, that.data.activityList.length)
        }
        that.setData({
          activityList: that.data.activityList.concat(data)
        })
        wx.stopPullDownRefresh()
        wx.hideLoading()
      }).catch(errMsg => {
        wx.stopPullDownRefresh()
        wx.hideLoading()
      })
    } else {
      _home.getSoarActivity({ page: that.data.page, size: that.data.size, areaId: that.data.area.id, type: that.data.activityClassify.id }).then(data => {
        data.forEach(e => {
          e.bannerData = JSON.parse(e.bannerData)
        })
        if (that.data.page == 1) {
          that.data.activityList.splice(0, that.data.activityList.length)
        }
        that.setData({
          activityList: that.data.activityList.concat(data)
        })
        wx.stopPullDownRefresh()
        wx.hideLoading()
      }).catch(errMsg => {
        wx.stopPullDownRefresh()
        wx.hideLoading()
      })
    }
  },
  // 上啦刷新事件
  onPullDownRefresh: function () {
    that.data.page = 1
    that.getData()
  },
  onReachBottom: function () {
    // that.data.page++
    // that.getData()
  },
  // 跳转活动详情事件
  openInfo: function (e) {
    wx.navigateTo({
      url: `/pages/activity/info?id=${e.currentTarget.dataset.id}`
    })
  },
  // 地区变化事件
  bindAreaChange: function (e) {
    that.data.area = _area[e.detail.value]
    if (e.detail.value == 0) {
      that.data.area = {name:'全国'}
    }
    that.setData({
      area: that.data.area
    })
    that.onPullDownRefresh()
  },
  // 活动类别变化事件
  bindActivityClassifyChange: function (e) {
    that.data.activityClassify = that.data.activityclassifyList[e.detail.value]
    if (e.detail.value == 0) {
      that.data.activityClassify = { name: '总榜' }
    }
    that.setData({
      activityClassify: that.data.activityClassify
    })
    that.onPullDownRefresh()
  }
})