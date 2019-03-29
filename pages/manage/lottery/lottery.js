// pages/manage/lottery/lottery.js
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
    lotteryInfo: undefined,
    endDate: '',
    endTime: '',
    lotteryModal: false,
    downloadModal: false,
    editModal: false,
    total: 0,
    page: 1,
    size: 20,
    lotteryDatas: [
    ],
    extraData:"",
    jsonData:""
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
      activityId: that.data.activityId, type: '4'
    }).then(data => {
      that.setData({
        lotteryInfo: data,
        jsonData: data.jsonData,
        extraData:data.extraData,
      })
      if (data.status == 2) {
        that.data.page = 1
        that.getData()
      }
      wx.hideLoading()
    }).catch(errMsg => {
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
  getData: function () {
    _activity.getActivityFormPage({ page: that.data.page, size: that.data.size, formId: that.data.lotteryInfo.formId }).then(data => {
      if (that.data.page == 1) {
        that.data.lotteryDatas.splice(0, that.data.lotteryDatas.length)
      }
      // data.records.forEach(c => {
      //   c.jsonData = JSON.parse(c.jsonData)
      //   c.ctime = c.ctime.substring(0, 10)
      // })
      that.setData({
        total: data.total,
        lotteryDatas: that.data.lotteryDatas.concat(data.records)
      })
      wx.stopPullDownRefresh()
      wx.hideLoading()
    }).catch(errMsg => {
      wx.stopPullDownRefresh()
      wx.hideLoading()
    })
  },
  onReachBottom: function () {
    that.data.page++
    that.getData()
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
      lotteryModal: that.data.lotteryModal,
      downloadModal: that.data.downloadModal,
      editModal: that.data.editModal
    })
  },
  handleClose: function () {
    that.setData({
      lotteryModal: false,
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
      formId: that.data.applyInfo.formId, endDate: `${that.data.endDate} ${that.data.endTime}`
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
  handleLottrey: function (e) {
    that.handleClose()
    wx.showLoading({
      title: '开奖中...',
      mask: true
    })
    _activity.activityLottery({
      activityId: that.data.activityId
    }).then(data => {
      $Message({
        content: '开奖成功'
      })
      that.onShow()
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
      activityId: that.data.activityId, email: that.data.email, type: 4
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
    wx.navigateTo({
      url: `/pages/manage/lottery/edit?id=${that.data.activityId}&formId=${that.data.lotteryInfo.formId}&jsonData=${that.data.jsonData}&extraData=${that.data.extraData}`
    })
  }
})