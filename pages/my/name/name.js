// pages/my/name/name.js
let that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    input: "",
    url: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    that.setData({
      url: options.url
    })
  },
  bindName() {
    wx.navigateTo({
      url: `${that.data.url}?name=${that.data.input}`
    })
  },
  bindinput(e) {
    that.setData({
      input: e.detail.value
    })
  }
})