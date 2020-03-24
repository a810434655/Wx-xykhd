// pages/my/ticket.js
var _user = require('../../../service/user.js')
var _qrcode = require('../../../utils/qrcode.js')
var processingDate = require("../../../utils/date.js")
const { $Message } = require('../../../resources/dist/base/index')
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
      pic: "https://oss.dreamoncampus.com//file/img/theme1@2x.png"
    },
    {
      buttonTheme: 'theme2',
      pic: "https://oss.dreamoncampus.com//file/img/theme2@2x.png"
    },
    {
      buttonTheme: 'theme3',
      pic: "https://oss.dreamoncampus.com//file/img/theme3@2x.png"
    },
    {
      buttonTheme: 'theme4',
      pic: "https://oss.dreamoncampus.com//file/img/theme4@2x.png"
    },
    {
      buttonTheme: 'theme5',
      pic: "https://oss.dreamoncampus.com//file/img/theme5@2x.png"
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
  getChange(e){
    let key
    if(e){
      key = e.detail.current
    }else{
      key = 0
    }
    that.data.ticketList[key].code = true 
    that.setData({
      ticketList:that.data.ticketList
    })
    _user.getTicket({ formId: that.data.ticketList[key].formId, number: that.data.ticketList[key].number})
    .then(res => {
      that.drawCode(key,'doct://'+res)
    })
    .catch(e => {
      $Message({
        content: e.message,
        type: 'warning'
      })
    })
  },
  getData: function() {
    _user.getUserTicket({
      page: that.data.page,
      size: that.data.size,
      type:"2",
      flag: '0' 
    }).then(data => {
      // console.log(data)
      if (that.data.page == 1) {
        that.data.ticketList.splice(0, that.data.ticketList.length)
      }
      data.records.forEach(item => {
        item.jsonData = JSON.parse(item.jsonData)
        if (item.jsonData.length > 4) { item.jsonData.splice(4, item.jsonData.length) }
        if (item.extraData) {
          item.extraData = JSON.parse(item.extraData)
          if (item.extraData.joinTime){
            item.extraData.joinTime = parseInt(item.extraData.joinTime)
            item.extraData.joinTime = processingDate.newDateM(item.extraData.joinTime)

          }else{
            item.extraData.joinTime = ""
          }
        }
      })
      let startInx = that.data.ticketList.length
      that.setData({
        ticketList: that.data.ticketList.concat(data.records)
      })
      that.getChange()
      // console.log(that.data.ticketList)
      wx.stopPullDownRefresh()
      wx.hideLoading()
    }).catch(e => {
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
  drawCode: function (id,res) {
    _qrcode.api.draw(res, `qrcCanvas${id}`, that.data.drvSize.w, that.data.drvSize.h)
    // that.data.ticketList[e.currentTarget.dataset.inx].showMore = !that.data.ticketList[e.currentTarget.dataset.inx].showMore
    // that.setData({
    //   ticketList: that.data.ticketList
    // })
  }
})