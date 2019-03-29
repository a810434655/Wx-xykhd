// pages/activity/schoolactivity.js
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
    schoolInfo: {},
    activityList: [],
    schoolGroup:[],
    selectSchoolGroup:{},
    page: 1,
    size: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    that.data.schoolInfo = wx.getStorageSync('homeSchool')
    wx.setNavigationBarTitle({
      title: that.data.schoolInfo.name
    })
    that.setData({
      schoolInfo: that.data.schoolInfo
    })
    that.getSchoolGroup()
    that.getData()
  },
  getSchoolGroup: function(){
    _home.getSchoolGroup({ school_id: that.data.schoolInfo.id}).then(data => {
      that.setData({
        schoolGroup: data.records
      })
    }).catch(errMsg => {
      setTimeout(function () {
        that.getSchoolGroup()
      }, 3000)
    })
  },
  getData: function () {
    let data = { page: that.data.page, size: that.data.size, shield:0 }
    data.school_id = that.data.schoolInfo.id
    if (that.data.selectSchoolGroup.id){
      data.group_id = that.data.selectSchoolGroup.id
    }
    _home.getActivityPage(data).then(data => {
      data.records.forEach(e => {
        e.bannerData = JSON.parse(e.bannerData)
        e.remark = JSON.parse(e.remark)
      })
      if (that.data.page == 1) {
        that.data.activityList.splice(0, that.data.activityList.length)
      }
      that.setData({
        activityList: that.data.activityList.concat(data.records)
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
  bindSchoolGroupChange: function (e) {
    that.data.selectSchoolGroup = that.data.schoolGroup[e.detail.value]
    that.setData({
      selectSchoolGroup: that.data.selectSchoolGroup
    })
    that.onPullDownRefresh()
  },
  openInfo: function (e) {
    wx.navigateTo({
      url: `/pages/activity/info?id=${e.currentTarget.dataset.id}`
    })
  }
})