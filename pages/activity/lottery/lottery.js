// pages/activity/lottery.js
var _activity = require("../../../service/activity.js")
var _special = require("../../../service/special.js")
var _alabo = require("../../../utils/alabo.js")
const {
  $Message
} = require('../../../resources/dist/base/index')
var app = getApp()
var that
var formId
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formId: '',
    title: '',
    contentType: 0,
    contentImg: '',
    lotteryInfo: {},
    joinData:{
      name: '',
      phone: ''
    },
    lotteryModal: false,
    endTime:"",
    userList:[],  //中奖者名单
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    // that.data.activityId = options.id
    // console.log(options)
    that.setData({
      formId: options.formId,
      title: options.title
    })
    
  },
  onShow: function () {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    _activity.getActivityForm({ 
      formId: that.data.formId,
    }).then(data => {
      data.form.jsonData = JSON.parse(data.form.jsonData)
      data.form.extraData = JSON.parse(data.form.extraData)
      // // var reg = 
      // // if()
      data.form.jsonData.forEach((item,key) => {
        key = _alabo.Utils.numberToChinese(key+1)
        item.name = "奖品" + key + ' ' + item.name
        item.yesName = item.name.replace(/.(品)/g, "项")
      })
      if (data.form.extraData.userDrawPrize) {
        data.form.extraData.userDrawPrize = JSON.parse(data.form.extraData.userDrawPrize)
      }
      
      let time = Number(data.form.extraData.lotteryData)
      // 转换截止时间
      that.data.endTime = new Date(time).getFullYear() + '年' + (parseInt(new Date(time).getMonth()) + 1) + '月' + new Date(time).getDate() + '日' + ' ' + new Date(time).getHours() + ':' + new Date(time).getMinutes()    
      that.setData(
        {
          endTime:that.data.endTime
        }
      )
      if (data.form.extraData.content.indexOf("img~") == 0) {
        that.setData({
          contentType: 1,
          contentImg: data.form.extraData.content.substr(4)
        })
      }
     if(data.userList){
       that.setData({
         userList: data.userList
       })
     }
      that.setData({
        lotteryInfo: data.form,
      })
      // console.log(that.data.lotteryInfo)
      // 把对应ID添加进jsonData里去
      that.data.lotteryInfo.jsonData.forEach(list => {
        list.avatar = []
        if(data.userList){
          data.userList.forEach(item => {
            if (list.id == item.prizeId) {
              list.avatar.push(item.avatar)
            }
          })
        }
      })
      // 更新一下jsonData
      that.setData({
        lotteryInfo : that.data.lotteryInfo
      })
      // 处理jsondata的数据
      that.data.lotteryInfo.jsonData.forEach(item => {
        item.residue = 0
        if (item.avatar.length==8){
          item.avatar = item.avatar.slice(0, 8)
        }else if(item.avatar.length>8){
          item.residue = item.avatar.length - 7
          item.avatar = item.avatar.slice(0, 7)
        }
        // console.log(item)
      })
      that.setData({
        lotteryInfo: that.data.lotteryInfo
      })     
      wx.hideLoading()
    }).catch(e => {
      $Message({
        content: e.message,
        type: 'warning'
      })
      // wx.navigateBack({})
      wx.hideLoading()
    })
  },
  changeInput: function (e) {
    that.data.joinData[e.detail.currentTarget.dataset.key] = e.detail.detail.value
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
      if (wx.getStorageSync('userId')) {
        // console.log(that.data.joinData)
        if (that.data.joinData.name.length < 1 || that.data.joinData.phone.length !== 11) {
          $Message({
            content: '请输入正确的参与信息',
            type: 'warning'
          })
          return
        }
        if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(that.data.joinData.phone))) {
          // console.log(that.data.phone)
          $Message({
            content: "请输入正确的手机号"
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
          console.log("进入")
          that.onShow()
          $Message({
            content: '参与成功'
          })
          // that.setData({ lotteryModal: true})
          wx.hideLoading()
        }).catch(e => {
          console.log(e)
          $Message({
            content: e.message,
            type: 'warning'
          })
          wx.hideLoading()
        })
      } else {
        $Message({
          content:"请登录",
          type: 'warning'
        })
      }
  }
})