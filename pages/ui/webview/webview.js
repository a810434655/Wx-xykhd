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
    if (options.url == 'https://h5.dreamoncampus.com/vote0/index.html'){
      options.url = options.url + `?uid=${wx.getStorageSync("userId")}&dev=wechat`
    }
    this.setData({
      url: options.url
    })
  },
  handlerMessage: function (e) {
    console.error(e)
  },
  // onShareAppMessage: function (res) {
  //   // 来自页面内转发按钮
  //   var path = `/pages/home/plaza/plaza`
  //   var title = `创建最酷校园活动，助力南北活动战队拿大奖！`
  //   return {
  //     title: title,
  //     imageUrl: `https://oss.dreamoncampus.com/img/share1234.png`,
  //     path: path
  //   }
  // }
})