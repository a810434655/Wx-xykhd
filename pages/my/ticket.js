// pages/my/ticket.js
var _user = require('../../service/user.js')
var _qrcode = require('../../utils/qrcode.js')
var app = getApp()
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    drvSize: {},
    ticketList: [],
    themeList: [{
        buttonTheme: 'theme1',
        pic: "http://www.dreamoncampus.com/file/img/ic_theme_apply_tiele_1.png"
      },
      {
        buttonTheme: 'theme2',
        pic: "http://www.dreamoncampus.com/file/img/ic_theme_apply_tiele_2.png"
      },
      {
        buttonTheme: 'theme3',
        pic: "http://www.dreamoncampus.com/file/img/ic_theme_apply_tiele_3.png"
      },
      {
        buttonTheme: 'theme4',
        pic: "http://www.dreamoncampus.com/file/img/ic_theme_apply_tiele_4.png"
      },
      {
        buttonTheme: 'theme5',
        pic: "http://www.dreamoncampus.com/file/img/ic_theme_apply_tiele_5.png"
      }
    ],
    page: 1,
    size: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this
    that.data.drvSize = that.setCanvasSize()
  },
  onShow: function() {
    that.data.page = 1
    that.getData()
  },
  getData: function() {
    _user.getUserTicket({
      page: that.data.page,
      size: that.data.size,
      type: '2'
    }).then(data => {
      if (that.data.page == 1) {
        that.data.ticketList.splice(0, that.data.ticketList.length)
      }
      for (var c of data) {
        c.jsonData = JSON.parse(c.jsonData)
        if (c.jsonData.length > 4) { c.jsonData.splice(4, c.jsonData.length)}
        if (c.extraData) {
          c.extraData = JSON.parse(c.extraData)
          c.extraData.join = c.extraData.join.substr(0, 16)
        }
      }
      let startInx = that.data.ticketList.length
      that.setData({
        ticketList: that.data.ticketList.concat(data)
      })
      for (; startInx < that.data.ticketList.length; startInx++){
        that.drawCode(startInx)
      }
      wx.stopPullDownRefresh()
      wx.hideLoading()
    }).catch(errMsg => {
      wx.stopPullDownRefresh()
      wx.hideLoading()
    })
  },
  onPullDownRefresh: function() {
    that.data.page = 1
    that.getData()
  },
  onReachBottom: function() {
    that.data.page++
      that.getData()
  },
  setCanvasSize: function() {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 100 / 45; //不同屏幕下canvas的适配比例；设计稿是750宽
      var width = res.windowWidth / scale;
      var height = width; //canvas画布为正方形
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  // showMore: function(e) {
  //   let startInx = that.data.ticketList.length
  //   that.setData({
  //     ticketList: that.data.ticketList.concat(that.data.ticketList)
  //   })
  //   for (; startInx < that.data.ticketList.length; startInx++) {
  //     that.drawCode(startInx)
  //   }
  // },
  drawCode: function (id) {
    _qrcode.api.draw(that.data.ticketList[id].number, `qrcCanvas${id}`, that.data.drvSize.w, that.data.drvSize.h)
    // that.data.ticketList[e.currentTarget.dataset.inx].showMore = !that.data.ticketList[e.currentTarget.dataset.inx].showMore
    // that.setData({
    //   ticketList: that.data.ticketList
    // })
  }
})