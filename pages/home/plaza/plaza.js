// pages/home/plaza.js
var _activity = require("../../../service/activity.js")
var _home = require("../../../service/home.js")
var _temp = require("../../../service/temp.js")
var _util = require("../../../utils/util.js")
var _user = require("../../../service/user.js")
var _activityclassify = require("../../../data/activityclassify.js")
var URL = require("../../../config/config.js")
var _params = require("../../../utils/params.js")
var Province = require("../../../data/province.js")
const { $Toast } = require('../../../resources/dist/base/index');
const {
  $Message
} = require('../../../resources/dist/base/index')
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
    }],
    // 热门活动Data
    hotActivityList: [],
    // 本校热门活动数据或各大校园热门活动
    schoolActivityList: [],
    //H5小活动数组
    dreamH5List: [],
    // 搜索下面工具按钮地址
    tabNavigate: [
      '/pages/activity/top/top',
      '/pages/activity/record/record?type=0',
      '/pages/activity/record/record?type=1'
    ],
    //搜索框内容
    keywords: '',
    // initCheck: false, // 初始检查 - 活动一类
    // wlModal: false, //物料抽奖窗口
    // wlNoticeModal: false,
    // wlActivity:{}, //物料活动信息
    activity1Modal: false,
    activityList: [],
    showLogin: false,
    h5iconAnimation: {},
    _scene: undefined,
    activityCode: '',
    // activityclassifyList:
    //   [{ id: -1, name: '全部' }].concat(_activityclassify),
    activityClassify: { name: '同城' },
    key: -1,
    height: 500,
    page: 1,
    pageType: false,
    loading: false,
    provinceId: "",
    editModal: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    // 存储动态路由传递的值
    $Toast({
      content: '加载中',
      type: 'loading'
    });
    that.data._scene = options.scene
  },
  onShow: function () {
    // wx.getClipboardData({
    //   success:function(res){
    //     $Message({ 
    //     content:res.data
    //     })
    //   }
    // })
    // 取到信息
    that.loginIntercept()
    // that.getDreamH5()    
  },
  loginIntercept() {
    if (wx.getStorageSync("userId")) {
      that.data.activityClassify.name = "同校"
      that.setData({
        activityClassify: that.data.activityClassify
      })
      app.toUserLogin("", wx.getStorageSync("phone"), 4, wx.getStorageSync("uuid"))
        .then(res => {
          app.getSchoolId()
            .then(res => {
              if (res.status == 200) {
                app.getUser()
                that.getList()
              }
            })
            .catch(e => {
              $Message({
                content: e.message,
                type: 'warning'
              })
            })
        })
      that.setData({
        provinceId: 22
      })
    } else {
      that.data.activityClassify.name = "同城"
      that.setData({
        activityClassify: that.data.activityClassify
      })
      that.setData({
        provinceId: 22
      })
      that.getList()
    }
  },

  handleEdit: function () {
    app.toAuth()
    that.setData({
      editModal: false
    })
  },
  handleClose: function () {
    that.setData({
      provinceId: 22,
      editModal: false
    })
    that.getList()
  },
  getList: function () {
    // console.log(res)
    //Banner默认里面有一张图 ==1的话获取服务器的Banner图
    if (that.data.bannerList.length == 1) {
      that.getBanner()
    }
    //热门活动
    if (that.data.hotActivityList.length == 0) {
      that.getHotActivity()
    }
    // 高校热门活动
    if (that.data.schoolActivityList.length == 0) {
      that.bindPickerChange()
    }
    // wx.getStorage({
    //   key: 'schoolId',
    //   success: function (res) {

    //   },
    // })
  },
  // banner图点击事件 根据SWITCH来判断是进入那个图里
  getBanner: function () {
    //获取banner图 如若出错3秒后重新获取
    if (wx.getStorageSync("userId")) {
      _activity.getBanner()
      .then(res => {
        that.setData({
          bannerList: res
        })
      })
      .catch(e=>{
        setTimeout(function(){
          that.getBanner()
        },3000)
      })
    } else {
      let data = {
        areaId: that.data.provinceId
      }
      var header = { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' }
      wx.request({
        url: URL.dreamActServer + '/index/banner/selectAll' + _params.getParams(data),
        method: 'GET',
        header: header,
        success: function (res) {
          if (!res.data.data) {
            return false
          }
          that.setData({
            bannerList: res.data.data
          })
        },
        fail: function (e) {
          setTimeout(function () {
            that.getBanner()
          }, 3000)
        }
      })
    }
  },
  openBanner: function (e) {
    var item = e.currentTarget.dataset.item
    if (item.jsonData) item.jsonData = JSON.parse(item.jsonData)
    switch (item.skipType) {
      // h5
      case 1:
        wx.navigateTo({
          url: `/pages/ui/webview/webview?url=${item.skipContent}`
        })
        break
      // 活动
      case 2:
        wx.navigateTo({
          url: `/pages/activity/info/info?id=${item.skipContent}`
        })
        break
      // 全图
      case 3:
        wx.navigateTo({
          url: `/pages/my/fullimg/fullimg?url=${item.skipContent}`
        })
        break
      // 页面
      case 4:
        wx.navigateTo({
          url: `/pages/ui/webview/webview?url=${item.skipContent}`
        })
        // console.log(`${item.jsonData.url}`)
        break
    }
  },
  // 换一批热门活动按钮事件
  getHotActivity: function () {
    if (wx.getStorageSync("userId")) {
      _activity.getHotActivity({ schoolId: wx.getStorageSync("schoolId")})
        .then(res => {
          // console.log(res)
          res.forEach(e => {
            if (e.posterData) {
              e.image = e.posterData
            } else {
              e.bannerData = JSON.parse(e.bannerData)
              e.image = e.bannerData[0]
            }
            if (e.tag) {
              e.tag = JSON.parse(e.tag)
              if (e.tag.enroll == 0 && e.tag.prize == 0 && e.tag.ticket == 0 && e.tag.vote == 0) {
                e.tag = false
              }
            } else {
              e.tag = false
            }
          })
          that.setData({
            hotActivityList: res
          })
        })
        .catch(e => {
          setTimeout(function () {
            that.getHotActivity()
          }, 4000)
        })
    } else {
      let data = {
        areaId: that.data.provinceId
      }
      var header = { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' }
      wx.request({
        url: URL.dreamActServer + '/index/activity/selectHotAll' + _params.getParams(data),
        method: 'GET',
        header: header,
        success: function (res) {
          // console.log(res)
          if (!res.data.data) {
            return false
          }
          let data = res.data.data
          data.forEach(e => {
            if (e.posterData) {
              e.image = e.posterData
            } else {
              e.bannerData = JSON.parse(e.bannerData)
              e.image = e.bannerData[0]
            }
            if (e.tag) {
              e.tag = JSON.parse(e.tag)
              if (e.tag.enroll == 0 && e.tag.prize == 0 && e.tag.ticket == 0 && e.tag.vote == 0) {
                e.tag = false
              }
            } else {
              e.tag = false
            }
          })
          that.setData({
            hotActivityList: data
          })
        },
        fail: function (e) {
          setTimeout(function () {
            that.getHotActivity()
          }, 4000)
        }
      })
    }
  },
  // 获取高校热门活动
  bindPickerChange: function (e) {
    if (wx.getStorageSync("userId")) {
      _activity.getPickerChange({ page: that.data.page, size: 6, schoolId: wx.getStorageSync("schoolId")})
        .then(res => {
          res.records.forEach(e => {
            if (Math.round(new Date(e.endDate).getTime() / 1000) < Math.round(new Date().getTime() / 1000)) {
              if (e.posterData) {
                e.image = e.posterData
              } else {
                e.bannerData = JSON.parse(e.bannerData)
                e.image = e.bannerData[0]
              }
              e.tag = {
                enroll: "0",
                prize: "0",
                ticket: "0",
                vote: "0"
              }
              e.remark = JSON.parse(e.remark)
            } else {
              if (e.posterData) {
                e.image = e.posterData
              } else {
                e.bannerData = JSON.parse(e.bannerData)
                e.image = e.bannerData[0]
              }
              if (e.tag) {
                e.tag = JSON.parse(e.tag)
              }
              e.remark = JSON.parse(e.remark)
            }
          })
          // that.data.activityclassifyList.forEach(item => {
          //   if(item.id == that.data.key){
          //     that.data.activityClassify.name = item.name
          //     that.setData({
          //       activityClassify: that.data.activityClassify
          //     })
          //   }
          // })
          if (res.records.length != 0) {
            that.setData({
              schoolActivityList: that.data.schoolActivityList.concat(res.records),
              loading: false
            })
          } else {
            // console.log(res)
            that.setData({
              pageType: true,
              loading: false
            })
          }
          $Toast.hide();
          wx.hideLoading()
        })
        .catch(e => {
          setTimeout(function () {
            that.bindPickerChange()
          }, 3000)
        })
    } else {
      let data = {
        page: that.data.page,
        size: 6,
        areaId: that.data.provinceId
      }
      var header = { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' }
      wx.request({
        url: URL.dreamActServer + '/index/activity/selectPage' + _params.getParams(data),
        method: 'GET',
        header: header,
        success: function (result) {
          
          $Toast.hide();
          if (!result.data.data) {
            return false
          }
          let res = result.data.data
          res.records.forEach(e => {
            if (Math.round(new Date(e.endDate).getTime() / 1000) < Math.round(new Date().getTime() / 1000)) {
              if (e.posterData) {
                e.image = e.posterData
              } else {
                e.bannerData = JSON.parse(e.bannerData)
                e.image = e.bannerData[0]
              }
              e.tag = {
                enroll: "0",
                prize: "0",
                ticket: "0",
                vote: "0"
              }
              e.remark = JSON.parse(e.remark)
            } else {
              if (e.posterData) {
                e.image = e.posterData
              } else {
                e.bannerData = JSON.parse(e.bannerData)
                e.image = e.bannerData[0]
              }
              if (e.tag) {
                e.tag = JSON.parse(e.tag)
              }
              e.remark = JSON.parse(e.remark)
            }
          })
          // that.data.activityclassifyList.forEach(item => {
          //   if(item.id == that.data.key){
          //     that.data.activityClassify.name = item.name
          //     that.setData({
          //       activityClassify: that.data.activityClassify
          //     })
          //   }
          // })
          if (res.records.length != 0) {
            that.setData({
              schoolActivityList: that.data.schoolActivityList.concat(res.records),
              loading: false
            })
          } else {
            // console.log(res)
            that.setData({
              pageType: true,
              loading: false
            })
          }

          wx.hideLoading()
        },
        fail: function (e) {
          setTimeout(function () {
            that.bindPickerChange()
          }, 3000)
        }
      })
    }

  },
  // // 查询聚能小活动
  //   getDreamH5: function () {
  //     _home.getDreamH5().then(data => {
  //       that.setData({
  //         dreamH5List: data
  //       })
  //     }).catch(errMsg => {
  //       setTimeout(function () {
  //         that.getDreamH5()
  //       }, 3000)
  //     })
  //   },
  bindMore: function () {
    if (that.data.pageType) {
      return false
    }
    that.data.page++
    that.setData({
      page: that.data.page,
      loading: true
    })
    that.bindPickerChange()
  },
  //  //抽奖活动事件
  // actionActivity: function() {
  //   if (that.data._scene != undefined && that.data.scene.length > 2) {
  //     let acId = that.data.scene.substr(0, 2)
  //     that.data.activityCode = that.data.scene.substr(2, that.data.scene.length)
  //     if (acId == 'a1') {
  //       // a1 活动 绑定检票员
  //       that.setData({
  //         activity1Modal: true
  //       })
  //     }
  //     that.data.scene = ''
  //     // console.error(acId, that.data.activityCode)
  //   } 
  //   // else if(!that.data.initCheck) {

  //   //   // 二级弹窗
  //   //   // 检查第一次启动弹窗 - 提示物料活动弹窗
  //   //   if (!wx.getStorageSync('wlNotice')){
  //   //     that.setData({
  //   //       wlNoticeModal: true
  //   //     })
  //   //     wx.setStorageSync('wlNotice', true)
  //   //     return
  //   //   }

  //   //   // 正常进入小程序，检查物料抽奖资格
  //   //   _temp.wl_checkDrawPrize().then(data => {
  //   //     // 每超过一个档位提示一次窗口
  //   //     const wlViewNumber = wx.getStorageSync('wlViewNumber')
  //   //     if (wlViewNumber != undefined){
  //   //       if (data.activity.viewNumber < wlViewNumber){
  //   //         return
  //   //       }else {
  //   //         if (data.activity.viewNumber >= 2000){
  //   //           wx.setStorageSync('wlViewNumber', 99999)
  //   //         } else if (data.activity.viewNumber >= 1500) {
  //   //           wx.setStorageSync('wlViewNumber', 2000)
  //   //         } else if (data.activity.viewNumber >= 1000) {
  //   //           wx.setStorageSync('wlViewNumber', 1500)
  //   //         } else if (data.activity.viewNumber >= 500) {
  //   //           wx.setStorageSync('wlViewNumber', 1000)
  //   //         } else if (data.activity.viewNumber >= 200) {
  //   //           wx.setStorageSync('wlViewNumber', 500)
  //   //         }
  //   //       }
  //   //     }
  //   //     if (data.activity.name.length >12){
  //   //       data.activity.name = `${data.activity.name.substr(0, 12)}...`
  //   //     }
  //   //     that.setData({
  //   //       wlModal: true,
  //   //       wlActivity: data.activity
  //   //     })
  //   //   }).catch(errMsg => {

  //   //   })
  //   //   that.data.initCheck = true
  //   // }
  // },
  openPage: function (e) {
    that.closeModal()
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  handleActivity1: function () {
    _activity.addTicketUser({
      code: that.data.activityCode
    }).then(data => {
      $Message({
        content: `您已成功绑定检票员，请进活动管理查看`
      })
      that.setData({
        activity1Modal: false
      })
    }).catch(e => {
      $Message({
        content: e.message,
        type: 'warning'
      })
    })
  },
  // 打开热度榜或者我的收藏和浏览记录
  selectTab: function (e) {
    if (wx.getStorageSync("userId")) {
      wx.navigateTo({
        url: that.data.tabNavigate[e.currentTarget.dataset.id]
      })
    } else {
      wx.switchTab({
        url: "/pages/home/my/my"
      })
    }

  },
  selectSchool: function (e) {
    wx.navigateTo({
      url: `/pages/ui/selectpage/selectpage?type=0`
    })
  },
  openInfo: function (e) {
    wx.navigateTo({
      url: `/pages/activity/info/info?id=${e.currentTarget.dataset.id}`
    })
  },
  //输入框输入获取到输入框的值
  bindKeyWordInput: function (e) {
    that.data.keywords = e.detail.value
  },
  //搜索按钮事件
  search: function (e) {
    if (that.data.keywords.length == 0) {
      $Message({
        content: `请输入关键字`,
        type: 'warning'
      })
      return false
    }
    if (!wx.getStorageSync("userId")) {
      $Message({
        content: `请登录后使用搜索功能`,
        type: 'warning'
      })
      return false
    } else {
      wx.navigateTo({
        url: `/pages/activity/searchlist/searchlist?keywords=${that.data.keywords}`
      })
    }
  },
  closeModal: function () {
    that.setData({
      activity1Modal: false,
      // wlModal: false,
      // wlNoticeModal: false
    })
  },
  getData: function () {

  },
  toH5: function (e) {
    wx.navigateTo({
      url: `/pages/ui/webview/webview?url=${e.currentTarget.dataset.link}`
    })
    that.closeModal()
  },
  onShareAppMessage: function (res) {
    // 来自页面内转发按钮
    // console.log(res.target)
    var path = `/pages/home/plaza/plaza`
    var title = `创建最酷校园活动，助力南北活动战队拿大奖！`
    return {
      title: title,
      imageUrl: `https://oss.dreamoncampus.com/img/share1234.png`,
      path: path
    }
  }
})