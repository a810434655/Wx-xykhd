// pages/activity/lottery.js
var _activity = require("../../service/activity.js")
var _special = require("../../service/special.js")
const {
  $Message
} = require('../../resources/dist/base/index')
var app = getApp()
var that
var formId
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityId: '',
    title: '',
    contentType: 0,
    contentImg: '',
    lotteryInfo: {},
    joinData:{
      name: '',
      phone: ''
    },
    lotteryModal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    // that.data.activityId = options.id
    that.setData({
      activityId: options.id,
      title: options.title
    })
  },
  onShow: function () {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    _activity.getActivityForm({
      activityId: that.data.activityId,
      type: '4'
    }).then(data => {
      data.jsonData = JSON.parse(data.jsonData)
      data.extraData = JSON.parse(data.extraData)
      if (data.extraData.userDrawPrize){
        data.extraData.userDrawPrize = JSON.parse(data.extraData.userDrawPrize)
      }
      if (data.extraData.content.indexOf("img~") == 0) {
        that.setData({
          contentType: 1,
          contentImg: data.extraData.content.substr(4)
        })
      }
      that.setData({
        lotteryInfo: data
      })
      wx.hideLoading()
    }).catch(errMsg => {
      console.error(errMsg)
      wx.navigateBack({})
      wx.hideLoading()
    })
  },
  changeInput: function (e) {
    that.data.joinData[e.detail.currentTarget.dataset.key] = e.detail.detail.value
  },
  toLogin: function (e) {
    app.login(function () {
      $Message({
        content: '授权成功，请继续您的操作'
      })
    })
  },
  openPage: function (e) {
    //点击记录
    _special.visitRecord({ type: e.currentTarget.dataset.type })
    wx.reLaunch({
      url: e.currentTarget.dataset.url
    })
  },
  showImg: function (e) {
    wx.previewImage({
      urls: [e.currentTarget.dataset.url]
    })
  },
  submit: function (e) {
    if (e.detail.formId){
      formId = e.detail.formId
      return
    }
    console.error(formId)
    console.error(e)
    if (e.detail.userInfo) {
      if (wx.getStorageSync('user')) {
        if (that.data.joinData.name.length < 1 || that.data.joinData.phone.length !== 11) {
          $Message({
            content: '请输入正确的参与信息',
            type: 'warning'
          })
          return
        }
        wx.showLoading({
          title: '提交中...',
          mask: true
        })
        _activity.postUserLotteryForm({
          formId: that.data.lotteryInfo.formId,
          name: that.data.joinData.name,
          phone: that.data.joinData.phone
        }).then(data => {
          that.onShow()
          $Message({
            content: '参与成功'
          })
          that.setData({ lotteryModal: true})
          wx.hideLoading()
        }).catch(errMsg => {
          wx.hideLoading()
          $Message({
            content: errMsg,
            type: 'warning'
          })
        })
      } else {
        // console.error('1')
        that.toLogin()
      }
    } else {
      $Message({
        content: '更多功能请授权后使用',
        type: 'warning'
      })
    }
  }
})