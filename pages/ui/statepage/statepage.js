// pages/ui/statepage.js
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    state: 1,
    info: '',
    content: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    that.setData({
      state: options.state,
      info: options.info,
      content: options.content
    })
    wx.setNavigationBarTitle({
      title: options.title
    })
  },
  goMy: function(e){
    wx.switchTab({
      url: `/pages/home/my/my`
    })
  }
})