// pages/manage/function.js
var _activity = require("../../service/activity.js")
var _special = require("../../service/special.js")
const { $Message } = require('../../resources/dist/base/index')
var util = require('../../utils/util.js')
var app = getApp()
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    netError: false,
    activityId: undefined,
    title: '',
    role: 0,
    applyInfo: {},
    lootticketInfo: {},
    voteInfo: {},
    lotteryInfo: {},
    deleteModal: false,
    deleteType: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    that.data.activityId = options.id
    that.data.role = options.role
    that.data.title = options.title
    // that.init()
  },
  onShow: function () {
    that.init()
  },
  init: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    _activity.getActivityFunction({
      activityId: that.data.activityId
    }).then(data => {
      console.error(data)
      data.forEach(c => {
        switch(c.type) {
          case 1:
            that.setData({
              applyInfo: c
            })
            break
          case 2:
            that.setData({
              lootticketInfo: c
            })
            break
          case 3:
            that.setData({
              voteInfo: c
            })
            break
          case 4:
            that.setData({
              lotteryInfo: c
            })
            break
        }
      })
      wx.hideLoading()
    }).catch(errMsg => {
      wx.hideLoading()
      // 网络错误 显示重载界面
      // that.setData({
      //   netError: true
      // })
    })
  },
  toCreat: function (e) {
    let url
    switch (e.currentTarget.dataset.ftype) {
      case '1':
        url = `/pages/manage/applyedit?id=${that.data.activityId}`
        break
      case '2':
        url = `/pages/manage/lootticketedit?id=${that.data.activityId}`
        break
      case '3':
        url = `/pages/manage/vote/edit?id=${that.data.activityId}`
        break  
      case '4':
        url = `/pages/manage/lottery/edit?id=${that.data.activityId}`
        break  
    }
    //点击记录
    _special.visitRecord({ type: 2 })
    wx.navigateTo({
      url: url
    })
  },
  toInfo: function (e) {
    let url
    switch (e.currentTarget.dataset.ftype) {
      case '1':
        url = `/pages/manage/apply?id=${that.data.activityId}`
        break
      case '2':
        url = `/pages/manage/lootticket/lootticket?id=${that.data.activityId}&role=${that.data.role}`
        break
      case '3':
        url = `/pages/manage/vote/vote?id=${that.data.activityId}&role=${that.data.role}`
        break
      case '4':
        url = `/pages/manage/lottery/lottery?id=${that.data.activityId}&role=${that.data.role}`
        break
    }
    wx.navigateTo({
      url: url
    })
  },
  showDeleteModal: function (e) {
    that.setData({
      deleteModal: true,
      deleteType: e.currentTarget.dataset.ftype
    })
  },
  handleClose: function () {
    that.setData({
      deleteModal: false
    })
  },
  toDelete: function (e) {
    that.handleClose()
    wx.showLoading({
      title: '删除中...',
      mask: true
    })
    _activity.deleteActivityForm({
      activityId: that.data.activityId, type: that.data.deleteType
    }).then(data => {
      switch (parseInt(that.data.deleteType)) {
        case 1:
          that.setData({
            applyInfo: {}
          })
          break
        case 2:
          that.setData({
            lootticketInfo: {}
          })
          break
        case 3:
          that.setData({
            voteInfo: {}
          })
          break
        case 4:
          that.setData({
            lotteryInfo: {}
          })
          break
      }
      wx.hideLoading()
    }).catch(errMsg => {
      $Message({
        content: errMsg,
        type: 'warning'
      })
      wx.hideLoading()
    })
  },
  onShareAppMessage: function (res) {
    var path = `/pages/activity/info?id=${that.data.activityId}`
    var title = that.data.title
    if (that.data.applyInfo != {}) {
      title = `我正在【${title}】活动报名哦，快来参加吧！`
    } else if (that.data.lootticketInfo != {}) {
      title = `我正在【${title}】活动抢票哦，快来参加吧！`
    } else if (that.data.voteInfo != {}) {
      title = `我正在【${title}】活动投票哦，快来参加吧！`
    } else if (that.data.lotteryInfo != {}) {
      title = `我正在【${title}】活动抽奖哦，快来参加吧！`
    } else {
      title = `同学，快来看看【${title}】吧！`
    }
    return {
      title: `${title}`,
      imageUrl: `https://oss.dreamoncampus.com/img/share1234.png`,
      path: path
    }
  }
})