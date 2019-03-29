// pages/manage/vote/vote.js
var _activity = require("../../../service/activity.js")
var _user = require("../../../service/user.js")
const { $Message } = require('../../../resources/dist/base/index')
var util = require('../../../utils/util.js')
var app = getApp()
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    email: '',
    studentIden: false,
    activityId: undefined,
    voteInfo: undefined,
    endDate: '',
    endTime: '',
    dateModal: false,
    downloadModal: false,
    editModal: false,
    total: 0,
    jsonData:"",   //投票规则信息
    extraData:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    that.data.activityId = options.id
    that.setData({
      email: wx.getStorageSync('email'),
      studentIden: wx.getStorageSync('studentIden')
    })
  },
  onShow: function () {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    that.getUserIdentification()
    _activity.getActivityForm({
      activityId: that.data.activityId, type: '3'
    }).then(data => {
      console.log(data)
      data.jsonData=JSON.parse(data.jsonData)
      let ticketTotal = 0
      data.jsonData.forEach(c => {
        ticketTotal += c.num
      })
      if (ticketTotal > 0){
        data.jsonData.forEach(c => {
          c.percent = (c.num / ticketTotal * 100).toFixed(2)
        })
      }
      that.setData({
        voteInfo: data,
        total: ticketTotal,
        endDate: data.endDate.substring(0, 10),
        endTime: data.endDate.substring(11, 19),
        jsonData:data.jsonData,
        extraData:data.extraData
      })
      wx.hideLoading()
    }).catch(errMsg => {
      console.log("接口错误")
      console.error(errMsg)
      // wx.navigateBack({})
      wx.hideLoading()
    })
  },
  getUserIdentification: function () {
    _user.getUserIdentification().then(data => {
      data.forEach(e => {
        if (e.type == 1) {
          if (e.status == 2) {
            //设置全局认证通过
            wx.setStorageSync('studentIden', true)
            that.setData({
              studentIden: true
            })
          }
        }
      })
    }).catch(errMsg => {
      setTimeout(function () {
        that.getUserIdentification()
      }, 2000)
    })
  },
  changeInput: function (e) {
    that.data[e.detail.currentTarget.dataset.key] = e.detail.detail.value
  },
  bindDateChange: function (e) {
    that.data.date = e.detail.value
    that.setData({
      endDate: that.data.date
    })
  },
  bindTimeChange: function (e) {
    that.data.time = `${e.detail.value}:00`
    that.setData({
      endTime: that.data.time
    })
  },
  showModal: function (e) {
    if (e.currentTarget.dataset.modal == 'downloadModal' && !that.data.studentIden) {
      $Message({
        content: `请先进行学生组织认证验证真实性`,
        type: 'warning'
      })
      return
    }
    that.data[e.currentTarget.dataset.modal] = true
    that.setData({
      dateModal: that.data.dateModal,
      downloadModal: that.data.downloadModal,
      editModal: that.data.editModal
    })
  },
  handleClose: function () {
    that.setData({
      dateModal: false,
      downloadModal: false,
      editModal: false
    })
  },
  handleDate: function (e) {
    that.handleClose()
    wx.showLoading({
      title: '修改中...',
      mask: true
    })
    _activity.editActivityFormDate({
      formId: that.data.voteInfo.formId, endDate: `${that.data.endDate} ${that.data.endTime}`
    }).then(data => {
      $Message({
        content: '修改成功'
      })
      wx.hideLoading()
    }).catch(errMsg => {
      $Message({
        content: errMsg,
        type: 'warning'
      })
      wx.hideLoading()
    })
  },
  handleDownload: function (e) {
    that.handleClose()
    wx.showLoading({
      title: '发送中...',
      mask: true
    })
    if (that.data.email == undefined || that.data.email.length == 0) {
      $Message({
        content: '请输入邮箱地址',
        type: 'warning'
      })
      return
    }
    wx.setStorageSync('email', that.data.email)
    _activity.sendMailFormData({
      activityId: that.data.activityId, email: that.data.email, type: 3
    }).then(data => {
      $Message({
        content: '发送成功'
      })
      wx.hideLoading()
    }).catch(errMsg => {
      $Message({
        content: errMsg,
        type: 'warning'
      })
      wx.hideLoading()
    })
  },
  handleEdit: function (e) {
    that.handleClose()
    var data=JSON.stringify(that.data.jsonData)
    console.log(that.data.voteInfo)
    wx.navigateTo({
      url: `/pages/manage/vote/edit?id=${that.data.activityId}&formId=${that.data.voteInfo.formId}&endTime=${that.data.endTime}&endDate=${that.data.endDate}&jsonData=${data}&extraData=${that.data.extraData}`
    })
  }
})