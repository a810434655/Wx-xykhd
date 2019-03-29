// pages/ui/selectpage.js
var _home = require("../../service/home.js")
const { $Message } = require('../../resources/dist/base/index')
var app = getApp()
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: -1, // 0 首页查学校
    loading: false,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    that.data.type = options.type
  },
  getList: function (name) {
    that.setData({
      loading: true
    })
    switch(that.data.type) {
      case '0':
      case '1':
        _home.getSchoolList({ name: name }).then(data => {
          that.setData({
            list: data.records,
            loading: false
          })
        }).catch(errMsg => {
          that.setData({
            loading: false
          })
        })
        break
    }
  },
  searchHandle: function (e) {
    // console.error(e)
    if (e.detail.cursor > 0) {
      that.getList(e.detail.value)
    }
  },
  selectItem: function (e) {
    // console.error(e)
    switch (that.data.type) {
      case '0':
        wx.setStorageSync('homeSchool', e.target.dataset.item)
        wx.navigateBack({})
        break
      case '1':
        wx.setStorageSync('studentSchoolInfo', e.target.dataset.item)
        wx.navigateBack({})
        break
    }
  }
})