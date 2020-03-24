// pages/ui/selectpage.js
var _home = require("../../../service/home.js")
var _activity = require("../../../service/activity.js")
const { $Message } = require('../../../resources/dist/base/index')
var app = getApp()
var that
Page({

  /**
     * 页面的初始数据
     // pages/ui/selectpage.js
var _home = require("../../../service/home.js")
const { $Message } = require('../../../resources/dist/base/index')
var app = getApp()
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */ 
  onLoad: function (options) {
    that = this
  },
  getList: function (e) {
    that.setData({
      loading: true
    })
    // console.log(e)
    _home.getSchoolList({name:e}).then(data => {
      // console.log(data)
      that.setData({
        list: data.records,
        loading: false
      })
    }).catch(e => {
      that.setData({
        loading: false
      })
    })
  },
  searchHandle: function (e) {
    // console.error(e)
    if (e.detail.cursor > 0) {
      that.getList(e.detail.value)
    }
  },
  selectItem: function (e) {
    console.log(e)
    wx.navigateTo({
      url: `/pages/my/guidance/guidance?schoolId=${e.target.dataset.item.id}&schoolName=${e.target.dataset.item.name}`,
    })       
  }
})