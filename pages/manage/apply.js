// pages/manage/apply.js
var _activity = require("../../service/activity.js")
var _user = require("../../service/user.js")
const { $Message } = require('../../resources/dist/base/index')
var util = require('../../utils/util.js')
var app = getApp()
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    email:'',
    studentIden: false,
    activityId: undefined,
    applyInfo: undefined,
    endDate: '',
    endTime: '',
    dateModal: false,
    downloadModal: false,
    editModal: false,
    page: 1,
    size: 20,
    total: 0,
    applyDatas: [],
    jsonData:[]  //获取的报名规则
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
  onShow: function (){
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    that.getUserIdentification()
    _activity.getActivityForm({
      activityId: that.data.activityId, type: '1'
    }).then(data => {
      that.setData({
        applyInfo: data,
        endDate: data.endDate.substring(0,10),
        endTime: data.endDate.substring(11, 19),
        jsonData:data.jsonData
      })
      that.data.page = 1
      that.getData()
      wx.hideLoading()
    }).catch(errMsg => {
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
    _activity.getActivityFormPage({ page: that.data.page, size: that.data.size, formId: that.data.applyInfo.formId }).then(data => {
      if (that.data.page == 1) {
        that.data.applyDatas.splice(0, that.data.applyDatas.length)
      }
      data.records.forEach(c => {
        c.jsonData = JSON.parse(c.jsonData)
        c.ctime = c.ctime.substring(0, 10)
      })
      that.setData({
        total: data.total,
        applyDatas: that.data.applyDatas.concat(data.records)
      })
      wx.stopPullDownRefresh()
      wx.hideLoading()
    }).catch(errMsg => {
      wx.stopPullDownRefresh()
      wx.hideLoading()
    })
  },
  onPullDownRefresh: function () {
    that.data.page = 1
    that.getData()
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
  showModal: function(e) {
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
      activityId: that.data.activityId, email: that.data.email, type: 1
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
      url: `/pages/manage/applyedit?id=${that.data.activityId}&formId=${that.data.applyInfo.formId}&formKeys=${that.data.jsonData}&endDate=${that.data.endDate}&endTime=${that.data.endTime}`
    })
  }
})