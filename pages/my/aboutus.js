// pages/my/aboutus.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  openPage: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  openH5Page: function (e) {
    wx.navigateTo({
      url: `/pages/ui/webview?url=${e.currentTarget.dataset.url}`
    })
  }
})