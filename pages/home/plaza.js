// pages/home/plaza.js
var _activity = require("../../service/activity.js")
var _home = require("../../service/home.js")
var _temp = require("../../service/temp.js")
var _util = require("../../utils/util.js")
const {
  $Message
} = require('../../resources/dist/base/index')
var app = getApp()
var that
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //轮播图Data
    bannerList: [{
        imageUrl: "/resources/image/ic_banner_loading.png",
        status: 0,
      }
    ],
    // 热门活动Data
    hotActivityList: [],
    // 本校热门活动数据或各大校园热门活动
    schoolActivityList: [],
    //H5小活动数组
    dreamH5List: [],
     //物料抽奖活动弹窗控制
    showLogin: false,
    // 搜索下面工具按钮地址
    tabNavigate: [
      '/pages/activity/top',
      '/pages/activity/record?type=0',
      '/pages/activity/record?type=1'
    ],
    // 我的学校
    mySchool: {},
    //搜索框内容
    keywords: '',
    initCheck: false, // 初始检查 - 活动一类
    wlModal: false, //物料抽奖窗口
    wlNoticeModal: false,
    wlActivity:{}, //物料活动信息
    activity1Modal: false,
    activityList: [],
    showLogin: false,
    h5iconAnimation: {},
    _scene: undefined,
    activityCode: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this
    // 存储动态路由传递的值
    that.data._scene = options.scene
  },
  onShow: function() {
    //首页数据
    //Banner默认里面有一张图 ==1的话获取服务器的Banner图
    if(that.data.bannerList.length == 1) {
      that.getBanner()
    }
    //热门活动
    if (that.data.hotActivityList.length == 0) {
      that.getHotActivity()
    }
    //我的学校
    that.setData({
      mySchool: wx.getStorageSync('homeSchool')
    })
    that.getSchoolActivity()
    // 查询聚能小活动
    that.getDreamH5()
    // 获取用户信息
    if (wx.getStorageSync('user')) {
      that.actionActivity()
    } else {
      wx.getSetting({
        success: res => {
          console.error(res)
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            if (!wx.getStorageSync('token')) {
              app.login(that.actionActivity)
            }
            that.setData({
              showLogin: false
            })
          } else {
            //app.toLogin()
            app.noAuthLogin(that.actionActivity)
            // that.setData({
            //   showLogin: true
            // })
          }
        }
      })
    }
  },
  // banner图点击事件 根据SWITCH来判断是进入那个图里
  getBanner: function () {
    //获取banner图 如若出错3秒后重新获取
    _home.getBanner().then(data => {
      that.setData({
        bannerList: data
      })
    }).catch(errMsg => {
      setTimeout(function(){
        that.getBanner()
      },3000)
    })
  },
  openBanner: function (e) {
    console.log(e);
    var item = e.currentTarget.dataset.item
    item.jsonData = JSON.parse(item.jsonData)
    _temp.openBannerRecord({ dataId: item.bannerId}).then(data => {
      
    }).catch(errMsg => {
      
    })
    switch (item.type) {
      // 全图
      case 1:
        wx.navigateTo({
          url: `/pages/my/fullimg?url=${item.jsonData.url}&title=${item.jsonData.title}`
        })
        break
      // 活动
      case 2:
        wx.navigateTo({
          url: "/pages/activity/info?id=" + item.jsonData.activityId
        })
        break
      // H5
      case 3:
        wx.navigateTo({
          url: `/pages/ui/webview?url=${item.jsonData.url}`
        })
        break
      // 页面
      case 4:
        wx.navigateTo({
          url: `${item.jsonData.url}`
        })
        break
    }
  },
  // 换一批热门活动按钮事件
  getHotActivity: function () {
    _home.getHotActivity().then(data => {
      data.forEach(e => {
        if (Math.round(new Date(e.endDate).getTime()/1000)<Math.round(new Date().getTime()/1000)){
          e.bannerData = JSON.parse(e.bannerData)
          e.tag = {
            enroll: "0",
            prize: "0",
            ticket: "0",
            vote: "0"
          }
        }else{
          e.bannerData = JSON.parse(e.bannerData)
          e.tag = JSON.parse(e.tag)
        }
      })
      that.setData({
        hotActivityList: data
      })
    }).catch(errMsg => {
      setTimeout(function () {
        that.getHotActivity()
      }, 3000)
    })
  },
  //获取学校热门活动
  getSchoolActivity: function () {
    let data = { page: 1, size: 4, shield: 0 }
    if (that.data.mySchool.id){
      data.school_id = that.data.mySchool.id
    }
    _home.getActivityPage(data).then(data => {
      data.records.forEach(e => {
          e.bannerData = JSON.parse(e.bannerData)
          e.remark = JSON.parse(e.remark)
      })
      that.setData({
        schoolActivityList: data.records
      })
    }).catch(errMsg => {
      setTimeout(function () {
        that.getSchoolActivity()
      }, 3000)
    })
  },
// 查询聚能小活动
  getDreamH5: function () {
    _home.getDreamH5().then(data => {
      that.setData({
        dreamH5List: data
      })
    }).catch(errMsg => {
      setTimeout(function () {
        that.getDreamH5()
      }, 3000)
    })
  },

  //查看全部事件 如若没有选择学校则点击提示
  schoolActivity: function (e) {
    if (that.data.mySchool.id) {
      wx.navigateTo({
        url: `/pages/activity/schoolactivity`
      })
    }else {
      $Message({
        content: `请先选择学校`
      })
    }
  },

   //抽奖活动事件
  actionActivity: function() {
    if (that.data._scene != undefined && that.data.scene.length > 2) {
      let acId = that.data.scene.substr(0, 2)
      that.data.activityCode = that.data.scene.substr(2, that.data.scene.length)
      if (acId == 'a1') {
        // a1 活动 绑定检票员
        that.setData({
          activity1Modal: true
        })
      }
      that.data.scene = ''
      // console.error(acId, that.data.activityCode)
    } else if(!that.data.initCheck) {

      // 二级弹窗
      // 检查第一次启动弹窗 - 提示物料活动弹窗
      if (!wx.getStorageSync('wlNotice')){
        that.setData({
          wlNoticeModal: true
        })
        wx.setStorageSync('wlNotice', true)
        return
      }
     
      // 正常进入小程序，检查物料抽奖资格
      _temp.wl_checkDrawPrize().then(data => {
        // 每超过一个档位提示一次窗口
        const wlViewNumber = wx.getStorageSync('wlViewNumber')
        if (wlViewNumber != undefined){
          if (data.activity.viewNumber < wlViewNumber){
            return
          }else {
            if (data.activity.viewNumber >= 2000){
              wx.setStorageSync('wlViewNumber', 99999)
            } else if (data.activity.viewNumber >= 1500) {
              wx.setStorageSync('wlViewNumber', 2000)
            } else if (data.activity.viewNumber >= 1000) {
              wx.setStorageSync('wlViewNumber', 1500)
            } else if (data.activity.viewNumber >= 500) {
              wx.setStorageSync('wlViewNumber', 1000)
            } else if (data.activity.viewNumber >= 200) {
              wx.setStorageSync('wlViewNumber', 500)
            }
          }
        }
        if (data.activity.name.length >12){
          data.activity.name = `${data.activity.name.substr(0, 12)}...`
        }
        that.setData({
          wlModal: true,
          wlActivity: data.activity
        })
      }).catch(errMsg => {

      })
      that.data.initCheck = true
    }
  },
  openPage: function (e) {
    that.closeModal()
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  handleActivity1: function() {
    _activity.addTicketUser({
      code: that.data.activityCode
    }).then(data => {
      $Message({
        content: `您已成功绑定检票员，请进活动管理查看`
      })
      that.setData({
        activity1Modal: false
      })
    }).catch(errMsg => {
      $Message({
        content: errMsg,
        type: 'warning'
      })
    })
  },
  // 打开热度榜或者我的收藏和浏览记录
  selectTab: function (e) {
    wx.navigateTo({
      url: that.data.tabNavigate[e.currentTarget.dataset.id]
    })
  },
  selectSchool: function (e) {
    wx.navigateTo({
      url: `/pages/ui/selectpage?type=0`
    })
  },
  openInfo: function(e) {
    wx.navigateTo({
      url: `/pages/activity/info?id=${e.currentTarget.dataset.id}`
    })
  },
  //输入框输入获取到输入框的值
  bindKeyWordInput: function (e) {
    that.data.keywords = e.detail.value
  }, 
  //搜索按钮事件
  search: function (e) {
    if(that.data.keywords.length == 0) {
      $Message({
        content: `请输入关键字`,
        type: 'warning'
      })
      return
    }
    wx.navigateTo({
      url: `/pages/activity/searchlist?keywords=${that.data.keywords}`
    })
  },
  closeModal: function () {
    that.setData({
      activity1Modal: false,
      wlModal: false,
      wlNoticeModal: false
    })
  },
  toLogin: function(e) {
    if (e.detail.userInfo) {
      app.login(function() {
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
  getData: function() {

  },
  toH5: function(e) {
    wx.navigateTo({
      url: `/pages/ui/webview?url=${e.currentTarget.dataset.link}`
    })
    that.closeModal()
  },
  onShareAppMessage: function (res) {
    // 来自页面内转发按钮
    console.log(res.target)
    var path = `/pages/home/plaza`
    var title = `创建最酷校园活动，助力南北活动战队拿大奖！`
    return {
      title: title,
      imageUrl: `https://oss.dreamoncampus.com/img/share1234.png`,
      path: path
    }
  }
})