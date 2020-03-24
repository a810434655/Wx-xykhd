// pages/my/feedback.js
var _special = require("../../../service/special.js")
const { $Message } = require('../../../resources/dist/base/index')
var that
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    feedback: {
      content: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
  },
  changeInput: function (e) {
    that.data.feedback[e.target.dataset.key] = e.detail.value
  },
  feedback: function (e) {
    for (var key in that.data.feedback) {
      if (that.data.feedback[key] == undefined || that.data.feedback[key].length == 0) {
        $Message({
          content: '请检查信息是否完整',
          type: 'warning'
        })
        return
      }
    }
    wx.showLoading({
      title: '反馈中...',
      mask: true
    })
    _special.postFeedback(that.data.feedback).then(data => {
      app.toStatePage({
        state: 1,
        title: '反馈成功',
        info: '反馈成功，请等待管理员查看',
        content: '感谢您的反馈，我们将及时查看并整改，如有需要将会与您联系！'
      })
      wx.hideLoading()
    }).catch(e => {
      $Message({
        content: e.message,
        type: 'warning'
      })
      wx.hideLoading()
    })
  }
})