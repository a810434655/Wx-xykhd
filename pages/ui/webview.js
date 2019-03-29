// pages/ui/webview.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      url: decodeURIComponent(options.url)
    })
  },
  handlerMessage: function (e) {
    console.error(e)
  },
  onShareAppMessage: function (res) {
    // 来自页面内转发按钮
    var path = `/pages/home/plaza`
    var title = `创建最酷校园活动，助力南北活动战队拿大奖！`
    return {
      title: title,
      imageUrl: `https://oss.dreamoncampus.com/img/share1234.png`,
      path: path
    }
  }
})