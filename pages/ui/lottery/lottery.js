// pages/ui/lottery.js
var _temp = require("../../../service/temp.js")
const { $Message } = require('../../../resources/dist/base/index')
var app = getApp()
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: '0',
    userActivity: {}, //用户最高浏览量活动
    canDrawPrize: false, //是否可以抽奖
    userDrawPrizeInfo: null, //用户抽奖信息
    userAmount: '0', //用户抽奖信息
    // 档位奖品分布
    prizeList_1: [{ id: 1, img: 0 }, { id: 6, img: 50 }, { id: 3, img: 20 }, { id: 1, img: 0 },
      { id: 5, img: 40 }, { id: 4, img: 30 }, { id: 1, img: 0 }, { id: 3, img: 20 },
      { id: 6, img: 50 }, { id: 1, img: 0 }, { id: 3, img: 20 }, { id: 2, img: 10 }],
    prizeList_2: [{ id: 2, img: 10 }, { id: 8, img: 150 }, { id: 6, img: 50 }, { id: 2, img: 10 },
      { id: 7, img: 100 }, { id: 6, img: 50 }, { id: 3, img: 20 }, { id: 6, img: 50 },
      { id: 8, img: 150 }, { id: 3, img: 20 }, { id: 6, img: 50 }, { id: 7, img: 100 }],
    prizeList_3: [{ id: 2, img: 10 }, { id: 10, img: 300 }, { id: 8, img: 150 }, { id: 5, img: 40 },
      { id: 7, img: 100 }, { id: 8, img: 150 }, { id: 5, img: 40 }, { id: 8, img: 150 },
      { id: 10, img: 300 }, { id: 3, img: 20 }, { id: 8, img: 150 }, { id: 7, img: 100 }],
    prizeList_4: [{ id: 3, img: 20 }, { id: 12, img: 500 }, { id: 9, img: 200 }, { id: 3, img: 20 },
      { id: 9, img: 200 }, { id: 7, img: 100 }, { id: 5, img: 40 }, { id: 9, img: 200 },
      { id: 12, img: 500 }, { id: 5, img: 40 }, { id: 7, img: 100 }, { id: 9, img: 200 }],
    prizeList_5: [{ id: 6, img: 50 }, { id: 11, img: 400 }, { id: 12, img: 500 }, { id: 6, img: 50 },
      { id: 9, img: 200 }, { id: 10, img: 300 }, { id: 15, img: '00' }, { id: 14, img: 1000 },
      { id: 13, img: 800 }, { id: 15, img: '00' }, { id: 10, img: 300 }, { id: 9, img: 200 }],
    // 奖品列表
    prizeList: [{ id: 1, img: 0 }, { id: 6, img: 50 }, { id: 3, img: 20 }, { id: 1, img: 0 },
    { id: 5, img: 40 }, { id: 4, img: 30 }, { id: 1, img: 0 }, { id: 3, img: 20 },
    { id: 6, img: 50 }, { id: 1, img: 0 }, { id: 3, img: 20 }, { id: 2, img: 10 }],     
    //档位
    gear: 1,         
    lightIntervalId: '',
    lightState: true,
    lightTime: 600,
    lotteryModal: false, // 确认抽奖
    prizeModal: false, //奖品窗口
    activePrize: 0,
    rollIntervalId: '',
    rollTime: 120,
    count: 12,//总奖品数
    rollNum: 0,//转动次数
    minNum: 26,//最低转动次数
    targetPrize: -1, //中奖目标
    text:[], //中奖信息
    setId:"", //setInterval句柄
    notice:false, //公告隐藏显示
    scor:70,    //tranfrom偏移的像素
    height:""  //装在公告盒子的高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    that.data.lightIntervalId = setInterval(that.startLight,          that.data.lightTime)
    //获取中奖信息
    that.notice()
    

  },
  onShow: function(){
    that.init()
    that.setData({
      notice: true 
    })
    // 两秒延迟执行定时任务
    setTimeout(function(){
      that.setIn()
    },2000)
  },
  onHide:function(){
    // 进入后台的时候停止定时任务 
   clearInterval(that.data.setId)
  },
  onUnload:function(){
    // 页面销毁的时候停止定时任务
    clearInterval(that.data.setId)
  },
  init: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    _temp.wl_checkDrawPrize().then(data => {
      that.setData({
        userActivity: data.activity,
        canDrawPrize: data.canDrawPrize
      })
      // 档位设置
      if (data.activity.viewNumber >= 2000){
        that.setData({
          prizeList: that.data.prizeList_5,
          gear: 5
        })
      } else if (data.activity.viewNumber >= 1500){
        that.setData({
          prizeList: that.data.prizeList_4,
          gear: 4
        })
      } else if (data.activity.viewNumber >= 1000) {
        that.setData({
          prizeList: that.data.prizeList_3,
          gear: 3
        })
      } else if (data.activity.viewNumber >= 500) {
        that.setData({
          prizeList: that.data.prizeList_2,
          gear: 2
        })
      } else if (data.activity.viewNumber >= 200) {
        that.setData({
          prizeList: that.data.prizeList_1,
          gear: 1
        })
      }
      wx.hideLoading()
    }).catch(e => {
      wx.hideLoading()
    })
    _temp.wl_getPrizeInfo().then(data => {
      that.setData({
        money: data.money,
        userDrawPrizeInfo: data.userDrawPrizeInfo,
        userAmount: data.amount
      })  
      if (that.data.userDrawPrizeInfo != null){
        that.setData({
          prizeModal: true
        })
      }
      wx.hideLoading()
    }).catch(e => {
      $Message({
        content: e.message,
        type: 'warning'
      })
      wx.hideLoading()
    })
  },
  initRoll: function (){
    that.data.rollTime = 120
    that.data.rollNum = 0
  },
  startLight: function () {
    that.setData({
      lightState: !that.data.lightState
    })
  },
  startRoll: function () {
    that.data.activePrize++
    that.data.rollNum++
    let index = that.data.activePrize % that.data.count
    that.setData({
      activePrize: index
    })
    if (that.data.rollNum >= that.data.minNum){
      if (that.data.prizeList[index].id == that.data.targetPrize){
        clearInterval(that.data.rollIntervalId)
        setTimeout(that.startLottery, that.data.rollTime)
      }
      // let offset = that.data.targetPrize - index
      // if (offset < 0){
      //   offset = offset + 12
      // }
      // // console.error(`targetPrize:${that.data.targetPrize}`, `index:${index}`, `abs${offset}`)
      // if (offset == 5){
      //   clearInterval(that.data.rollIntervalId)
      //   setTimeout(that.startLottery, that.data.rollTime)
      // }
    }
  },
  startLottery: function () {
    if (that.data.rollNum > (that.data.minNum+20)) {
      if (that.data.prizeList[that.data.activePrize].id == that.data.targetPrize) {
        that.setData({
          prizeModal: true,
          userAmount: that.data.userAmount
        })
        return
      }
    }
    that.data.activePrize++
    that.data.rollNum++
    let index = that.data.activePrize % that.data.count
    that.setData({
      activePrize: index
    })
    that.data.rollTime += 20
    setTimeout(that.startLottery, that.data.rollTime)
  },
  lottery: function(e) {
    that.closeModel({})
    wx.showLoading({
      title: '抽奖中...',
      mask: true
    })
    _temp.wl_drawPrize().then(data => {
      that.data.targetPrize = data.prizeId
      that.initRoll()
      that.data.rollIntervalId = setInterval(that.startRoll, that.data.rollTime)
      that.data.canDrawPrize = false
      that.data.userAmount = data.amount
      wx.hideLoading()
    }).catch(e => {
      $Message({
        content: e.message,
        type: 'warning'
      })
      wx.hideLoading()
    })
  },
  showModel: function (e) {
    if (that.data.canDrawPrize){
      that.setData({
        lotteryModal: true
      })
    } else {
      $Message({
        content: `暂无抽奖机会`,
        type: 'warning'
      })
    }
  },
  closeModel: function(e) {
    that.setData({
      lotteryModal: false,
      prizeModal: false
    })
  },
  openPage: function (e) {
    wx.reLaunch({
      url: e.currentTarget.dataset.url
    })
  },
  //中奖公告接口
  notice: function () {
    //调用公告接口获取中奖名单
    _temp.wl_getNoticeList({}).then(data => {
    data.forEach((e,key)=>{
      if (e && typeof (e) != "undefined" && e != 0){
        
      }else{
        data.splice(key, 1)
      }
    })
      // 循环判断内容里是否有为null的数据
      that.setData({
        text: data,
      })
    })
  },
  // 获取包裹内容的盒子高度,
  setIn: function () {
    let query = wx.createSelectorQuery();
    query.select('#height').boundingClientRect(res => {
      that.setData({
        height: -res.height,
      })
      that.setInter()
    }).exec();
  },
  // 根据内容盒子的高度来执行偏移,让内容一直动着显示
  setInter: function () {
    that.data.setId = setInterval(function () {
      if (that.data.scor != that.data.height) {
        that.data.scor--
        that.setData({
          scor: that.data.scor
        })
      } else {
        that.notice()
        that.data.scor = 70
        that.setData({
          scor: that.data.scor
        })
      }
    }, 50)
  },
})
  