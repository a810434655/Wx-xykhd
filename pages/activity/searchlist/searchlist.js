// pages/activity/searchlist.js
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
    keyword: '',//输入框的值
    page: 1,
    size: 10,
    activityList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    // console.log(options.keywords)
    that.setData({                       // 把活动广场搜索框的值传递到本页面搜索框            
      keyword: options.keywords
    })
  },
  onShow: function () {
    if (!wx.getStorageSync("uuid")) {
      wx.switchTab({
        url: `/pages/home/my/my`,
      })
    }
    that.onPullDownRefresh()// 执行下拉刷新事件来获取数据
  },
  // 使用关键字调用接口搜索
  getData: function () {
    _home.searchActivityPage({page: that.data.page, size: that.data.size, keyword: that.data.keyword,areaId:wx.getStorageSync("areaId")})
    .then(data => {
        data.records.forEach(e => {
          e.bannerData = JSON.parse(e.bannerData)
        })
        if (that.data.page == 1) {
          that.data.activityList.splice(0, that.data.activityList.length)
        }
        that.setData({
          activityList: that.data.activityList.concat(data.records)
        })
        wx.stopPullDownRefresh()
        wx.hideLoading()
      }).catch(e => {
        $Message({
          content: e.message,
          type: 'warning'
        })
        wx.stopPullDownRefresh()
        wx.hideLoading()
      })
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    that.data.page = 1
    that.getData()
  },
  // 上拉触底加载
  onReachBottom: function () {
    that.data.page++
    that.getData()  
  },
  // 输入框事件
  bindKeyWordInput: function (e) {
    that.data.keyword = e.detail.value
  },
  // 检查是否为空的点击事件
  searchHandle: function (e) {
    if (that.data.keyword.length == 0) {
      $Message({
        content: `请输入关键字`,
        type: 'warning'
      })
      return
    }
    that.onPullDownRefresh()
  },
  openInfo: function (e) {
    wx.navigateTo({
      url: `/pages/activity/info/info?id=${e.currentTarget.dataset.id}`
    })
  }
})