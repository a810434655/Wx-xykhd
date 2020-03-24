//app.js
// 引入URL配置的接口信息
var URL = require("config/config.js")

var gio = require("utils/gio-minp.js").default;
// version 是你的小程序的版本号, 发版时请调整
gio('init', 'bcc8362c1d615894', 'wx561771c8f2873c7f', { version: URL.version, followShare: true })
var _user = require("service/user.js")
var that
App({
  onLaunch: function () {
    that = this
    // if(!wx.getStorageSync("userInfo")){
    //   that.getUser()
    // }
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
      wx.showToast({
        title: '新版本下载失败,请确定在网络畅通的情况下重启小程序',
        icon: 'none',
        duration: 2000
      })
    })
    // },
    // // login登录方法
    // login: function (callback) {
    //   wx.showLoading({
    //     title: '正在登陆...',
    //     mask: true
    //   })
    //   // 登录
    //   wx.login({
    //     success: ress => {
    //       // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //       if (ress.code) {
    //         //发起网络请求
    //         wx.getUserInfo({
    //           success: res => {
    //             // 可以将 res 发送给后台解码出 unionId
    //             console.error(res)
    //             //encryptedData是微信给的加密码来获取unionId 需要传递encryptedData和iv给后台进行解码
    //             that.globalData.encryptedData = res.encryptedData
    //             that.globalData.iv = res.iv
    //             that.globalData.userInfo = res.userInfo
    //             // 调用后台login登录
    //             _user.login({
    //               rdCode: ress.code,
    //               exJson: that.globalData.userInfo,
    //               encryptedData: that.globalData.encryptedData,
    //               iv: that.globalData.iv
    //             })  
    //               .then(data => {
    //                 console.log(data)
    //             // 使用then来异步获取数据
    //                 console.error('then', data)
    //                 // 调用setStorageSync来改变登录状态 需要传递token userInfo用户信息
    //                 wx.setStorageSync('token', data.token)
    //                 wx.setStorageSync('user', res.userInfo)
    //                 wx.hideLoading();
    //                 if (callback) {
    //                   callback()
    //                 }
    //               }).catch(errMsg => {
    //                 console.error(errMsg)
    //                 wx.hideLoading()
    //                 that.login(callback)
    //               })
    //             // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //             // 所以此处加入 callback 以防止这种情况
    //             if (this.userInfoReadyCallback) {
    //               this.userInfoReadyCallback(res)
    //             }
    //           }
    //         })
    //       } else {
    //         that.login(callback);
    //         console.log('登录失败！' + res.errMsg)
    //       }
    //     }
    //   })
    // },

    // noAuthLogin: function (callback) {
    //   // 登录
    //   wx.login({
    //     success: res => {
    //       // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //       if (res.code) {
    //         //发起网络请求
    //         _user.login({
    //           rdCode: res.code,
    //           exJson: {},
    //           encryptedData: {},
    //           iv: {}
    //         })
    //           .then(data => {
    //             console.error('then', data)
    //             console.log(data)
    //             wx.setStorageSync('token', data.token)
    //             if (callback) {
    //               callback()
    //             }
    //           }).catch(errMsg => {
    //             that.noAuthLogin(callback)
    //           })
    //       } else {
    //         that.noAuthLogin(callback)
    //         console.log('登录失败！' + res.errMsg)
    //       }
    //     }
    //   })
  },
  getSchoolId() {
    return new Promise((resolve, reject) => {
      _user.getUserMeage().then(res => {
        _user.getSchool({ userId: res.userId })
          .then(data => {
            if (data.schoolId) {
              wx.setStorageSync("schoolId", data.schoolId)
              resolve({ status: 200 })
            } else {
              wx.reLaunch({
                url: `/pages/my/guidance/guidance`
              })
            }
          })
          .catch(e => {
            reject(e)
          })
      })
    })
  },
  getUser() {
    _user.getUserMeage()
      .then(item => {
        let data = {
          nickName: item.nickname,
          avatar: item.avatar
        }
        wx.setStorageSync("userInfo", data)
        wx.setStorageSync("phone", item.phone)
        
      })
      .catch(e => {
        console.log(e)
      })
    _user.getSchool({userId:wx.getStorageSync("userId")})
    .then(res =>{
      wx.setStorageSync("areaId", res.areaId)
    })
    .catch(e =>{
      console.log(e)
    })
  },
  toUserLogin(code, phone, sysemId, uniqueId) {
    return new Promise((resolve, reject) => {
      _user.phoneLogin({ code, phone, sysemId, uniqueId })
        .then(res => {
          wx.setStorageSync("token", res.token)
          resolve(res)
        })
        .catch(e => {
          reject(e)
        })
    })
  },
  toLogin: function () {
    // 前往登录界面
    wx.navigateTo({
      url: '/pages/login',
    })
  },
  toLoginCode: function () {
    wx.navigateTo({
      url: '/pages/loginCode',
    })
  },
  toStatePage: function ({ state, title, info, content }) {
    // 前往状态页
    wx.redirectTo({
      url: `/pages/ui/statepage/statepage?state=${state}&title=${title}&info=${info}&content=${content}`,
    })
  },
  //向右滑动渐入渐出
  sliderightshow: function (_that, param, px, opacity) {
    var animation = wx.createAnimation({
      duration: 900,
      timingFunction: 'ease',
    });
    animation.translateX(-px).opacity(opacity).step()
    //将param转换为key
    var json = '{"' + param + '":""}'
    json = JSON.parse(json);
    json[param] = animation.export()
    //设置动画
    _that.setData(json)
  },
  globalData: {
    //用户信息
    userInfo: null,
    // 包括敏感数据在内的完整用户信息的加密数据，详细见加密数据解密算法
    encryptedData: null,
    // 加密算法的初始向量，详细见加密数据解密算法
    iv: null
  }
})