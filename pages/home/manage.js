// pages/home/manage.js
var _activity = require("../../service/activity.js")
var _user = require("../../service/user.js")
var _special = require("../../service/special.js")
const { $Message } = require('../../resources/dist/base/index')
var app = getApp()
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    studentI: {
      status: 99
    },
    iden: false,
    idenFarstModal: false,
    idenFarstInfo: '',
    guideModal: false,
    activityList:[],
    showLogin: false,
    page: 1,
    size: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
  },
  onShow: function () {
    //初次打开管理页引导
    // if (!wx.getStorageSync('firstManage')) {
    //   that.setData({
    //     guideModal: true
    //   })
    //   wx.setStorageSync('firstManage', true)
    // }
    // 获取用户信息
    if (wx.getStorageSync('user')) {
      that.setData({
        showLogin: false
      })
      if (that.data.activityList.length == 0) {
        wx.showLoading({
          title: '加载中...',
          mask: true
        })
        that.data.page = 1
        that.getData()
      }
      that.getUserIdentification()
    } else {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            if (!wx.getStorageSync('token')) {
              app.login(that.onPullDownRefresh)
            }
            that.setData({
              showLogin: false
            })
          } else {
            //app.toLogin()
            that.setData({
              showLogin: true
            })
          }
        }
      })
    }
  },
  // 进入活动管理界面 查询用户是不是认证过的账户  1代表不是 2代表是 存储到setStorageSync
  getUserIdentification: function () {
    _user.getUserIdentification().then(data => {
      data.forEach(e => {
        if (e.type == 1) {
          that.setData({
            studentI: e
          })
          if (e.status == 2){
            //设置全局认证通过
            wx.setStorageSync('studentIden', true)
          }
        }
      })
    }).catch(errMsg => {
      setTimeout(function () {
        that.getUserIdentification()
      }, 2000)
    })
  },

  // 获取用户创建的活动事件
  getData: function () {
    // 调用获取活动接口
    _activity.getActivityPage({ page: that.data.page, size: that.data.size }).then(data => {
      if (that.data.page == 1) {
        that.data.activityList.splice(0, that.data.activityList.length)
      }
      that.setData({
        activityList: that.data.activityList.concat(data.records)
      })
      //停止下拉滚动
      wx.stopPullDownRefresh()
      //隐藏loging提示框
      wx.hideLoading()
    }).catch(errMsg => {
      wx.stopPullDownRefresh()  
      wx.hideLoading()
      setTimeout(function () {
        that.getData()
      }, 2000)
    })  
  },
  // 上拉刷新把页码设置为1 ，然后调用获取活动接口
  onPullDownRefresh: function () {
    that.data.page = 1
    that.getData()
  },
  // 下拉加載让页码++，然后调用活动接口
  onReachBottom: function () {
    that.data.page++
    that.getData()
  },
  // 打开创建活动页面
  toCreat: function (e) {
    //点击记录
    _special.visitRecord({type:1})
    wx.navigateTo({
      url: `/pages/manage/edit?id=${e.currentTarget.dataset.id}`
    })
    // if (that.data.studentI.status == 2) {
    //  wx.navigateTo({
    //     url: `/pages/manage/edit?id=${e.currentTarget.dataset.id}`
    //   })
    // }else{
    //    that.setData({
    //      idenId: 1,
    //      idenFarstInfo: `一分钟完成身份认证，和全国500+学生组织一起体验最酷的校园活动一站式解决方案`,
    //      idenFarstModal: true
    //    })
    // }
  },

  handleClose: function () {
    that.setData({
      idenFarstModal: false,
      guideModal:false
    })
  },
  openIden: function () {
    that.handleClose()
    if (that.data.idenId == 1) {
      wx.navigateTo({
        url: '/pages/my/identification?id=1&title=学生组织认证'
      })
    }
  },
  toApply: function (e) {
    wx.navigateTo({
      url: `/pages/manage/apply?id=${e.currentTarget.dataset.id}`
    })
  },
  toFunction: function (e) {
    wx.navigateTo({
      url: `/pages/manage/function?id=${e.currentTarget.dataset.id}&role=${e.currentTarget.dataset.role}&title=${e.currentTarget.dataset.title}`
    })
  },
  toLootTicket: function (e) {
    wx.navigateTo({
      url: `/pages/manage/lootticket?id=${e.currentTarget.dataset.id}&role=${e.currentTarget.dataset.role}`
    })
  },
  toShare: function (e) {
    wx.navigateTo({
      url: `/pages/manage/share?id=${e.currentTarget.dataset.id}`
    })
  },
  toDelete: function (e) {
    wx.showModal({
      title: '提示',
      content: '删除活动后将无法恢复，请确认是否删除',
      success: function (res) {
        if (res.confirm) {
          _activity.deleteActivity({ activityId: e.currentTarget.dataset.id }).then(data => {
            $Message({
              content: '删除成功'
            })
            that.onPullDownRefresh()
          }).catch(errMsg => {
            $Message({
              content: errMsg,
              type: 'warning'
            })
          }) 
        } else if (res.cancel) {
        }
      }
    })
  },
  toLogin: function (e) {
    if (e.detail.userInfo) {
      app.login(function () {
        that.onShow()
        that.setData({
          showLogin: false
        })
      })
    } else {
      $Message({
        content: '未授权您将无法登陆查看您的课程及享受服务',
        type: 'warning'
      })
    }
  },
  // 点击图片打开活动详情页面
  openInfo: function (e) {
    wx.navigateTo({
      url: `/pages/activity/info?id=${e.currentTarget.dataset.id}`
    })
  },

  openHelp: function (e) {
    wx.navigateTo({
      url: `/pages/my/fullimg?url=https://oss.dreamoncampus.com/img/changtu.jpg&title=使用帮助`
    })
  }
})