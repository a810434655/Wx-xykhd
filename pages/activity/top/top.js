// pages/activity/top.js

var _activityclassify = require("../../../data/activityclassify.js")
var _activity = require("../../../service/activity.js")
var _home = require("../../../service/home.js")
const {
  $Message
} = require('../../../resources/dist/base/index')
var app = getApp()
var that
Page({
  /**
   * 页面的初始数据
   */
  data: {
    type: -1,
    activityList: [],
    activityclassifyList:
      [{id: -1, name:'总榜'}].concat(_activityclassify),
    activityClassify: { name: '总榜' },
    area: {name:'本校'},
    areaType:0,
    areaList: [{ name: '本校',id:0},{name:'全国',id:1}],
    page: 1,
    size: 20
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
  // switchList: function() {
  //   that.setData({
  //     type: that.data.type == 1 ? 0: 1
  //   })
  //   wx.setNavigationBarTitle({
  //     title: that.data.type == 0 ? '高校活动热度榜' : '高校活动飙升榜'
  //   })
  //   wx.setNavigationBarColor({
  //     frontColor: '#000000',
  //     backgroundColor: that.data.type == 0 ? '#FF6B57' : '#8A7EFE',
  //     animation: {
  //       duration: 400,
  //       timingFunc: 'easeIn'
  //     }
  //   })
  //   that.onPullDownRefresh()
  // },
  // 调用接口获取
  getData: function () {
    if (that.data.areaType == 0) {
      // console.log(that.data.type)
      _home.getHeatActivity({ page: that.data.page, size: that.data.size,type:that.data.type,schoolId:wx.getStorageSync('schoolId')}).then(data => {
        // console.log(data)
        if (that.data.page == 1) {
          that.data.activityList.splice(0, that.data.activityList.length)
        }
        that.setData({
          activityList: that.data.activityList.concat(data.records)
        })
        wx.stopPullDownRefresh()
        wx.hideLoading()
      }).catch(e => {
        wx.stopPullDownRefresh()
        wx.hideLoading()
      })
    } else {
      // console.log(that.data.type)
      _home.getHeatActivity({ page: that.data.page, size: that.data.size,type:that.data.type}).then(data => {
        console.log(data)
        if (that.data.page == 1) {
          that.data.activityList.splice(0, that.data.activityList.length)
        }
        that.setData({
          activityList: that.data.activityList.concat(data.records)
        })
        wx.stopPullDownRefresh()
        wx.hideLoading()
      }).catch(e => {
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
    that.data.page++
    that.getData()
  },
  // 跳转活动详情事件
  openInfo: function (e) {
    wx.navigateTo({
      url: `/pages/activity/info/info?id=${e.currentTarget.dataset.id}`
    })
  },
  // 地区变化事件
  bindAreaChange: function (e) {
    // console.log(e)
    that.data.area = that.data.areaList[e.detail.value] 
    that.setData({
      area: that.data.area,
      areaType:e.detail.value
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
      activityClassify: that.data.activityClassify,
      type:(e.detail.value-1)
    })
    that.onPullDownRefresh()
  }
})