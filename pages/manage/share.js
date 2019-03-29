// pages/manage/share.js
var _activity = require("../../service/activity.js")
var _special = require("../../service/special.js")
const {
  $Message
} = require('../../resources/dist/base/index')
var util = require('../../utils/util.js')
var app = getApp()
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeModal: false,
    posterModal: false,
    wxModal: false,
    authModal: false,
    codeImg: '',
    activityId: '',
    activityInfo: {},
    codeSize: '80',
    codeSizeList: [{
        key: '8*8cm',
        value: '240',
        checked: true
      },
      {
        key: '20*20cm',
        value: '600',
        checked: false
      },
      {
        key: '50*50cm',
        value: '1500',
        checked: false
      },
      {
        key: '100*100cm',
        value: '3000',
        checked: false
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this
    that.data.activityId = options.id
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    _activity.getActivityById({
      id: that.data.activityId
    }).then(data => {
      data.bannerData = JSON.parse(data.bannerData)
      that.setData({
        activityInfo: data
      })
      that.drawPoster()
      wx.hideLoading()
    }).catch(errMsg => {
      console.error(errMsg)
      wx.navigateBack({})
      wx.hideLoading()
    })
    //that.getMiniCode(`id${that.data.activityId}`, `pages/activity/info`, `80`)
  },
  drawPoster:function () {
    // var canvas = wx.createCanvasContext('posterCanvas')
    // canvas.drawImage(that.data.activityInfo.posterData, 0, 0, 100, 100)
    // canvas.setFillStyle('#5F6FEE')//文字颜色：默认黑色
    // canvas.setFontSize(20)//设置字体大小，默认10
    // canvas.fillText("LXT", 20, 20)//绘制文本
    // //调用draw()开始绘制
    // canvas.draw()
  },
  radioChange: function(e) {
    that.data.codeSizeList.forEach(c => {
      c.checked = false
    })
    that.data.codeSizeList[e.detail.value].checked = true
    that.data.codeSize = that.data.codeSizeList[e.detail.value].value
    that.setData({
      codeSizeList: that.data.codeSizeList
    })
  },
  onShareAppMessage: function(res) {
    console.log(res)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
      var path = `/pages/activity/info?id=${that.data.activityId}`
      var title = that.data.activityInfo.name
      return {
        title: `同学，快来看看${title}吧！`,
        imageUrl: that.data.activityInfo.shareLink,
        path: path
      }
    }
  },
  showModal: function(e) {
    console.error(e)
    that.data[e.currentTarget.dataset.modal] = true
    that.setData({
      codeModal: that.data.codeModal,
      posterModal: that.data.posterModal,
      wxModal: that.data.wxModal
    })
  },
  openPoster: function(e) {
    wx.navigateTo({
      url: `/pages/manage/poster?title=${that.data.activityInfo.name}&id=${that.data.activityInfo.activityId}`
    })
  },
  handleClose: function() {
    that.setData({
      codeModal: false,
      posterModal: false,
      wxModal: false,
      authModal: false
    })
  },
  getMiniCode: function(scene, page, width) {
    console.error(`200`, `https://dreamoncampus.com/dreamact/index/getMiniCode?scene=${scene}&page=${page}&width=${width}`)
    wx.request({
      url: `http://172.16.10.114/dreamact/index/getMiniCode?scene=${scene}&page=${page}&width=${width}`,
      method: 'GET',
      responseType: 'arraybuffer',
      success: function (res) {
        console.error(`res`,res)
        //服务器返回数据
        if (res.statusCode == 200) {
          const base64 = wx.arrayBufferToBase64(res.data)
          that.setData({
            codeImg: `data:image/jpg;base64,${base64}`
          })
        } else {
          console.error(`else`, res)
        }
      },
      error: function (e) {
        console.error(`error`, e)
      }
    })
  },
  handleSave: function() {
    that.setData({
      codeModal: false,
      posterModal: false
    })
    wx.showLoading({
      title: '正在保存...',
      mask: true
    })
    wx.getSetting({
      success(res) {
        if (!res.authSetting[`scope.writePhotosAlbum`]) {
          wx.authorize({
            scope: `scope.writePhotosAlbum`,
            success() {
              wx.hideLoading()
              that.saveQrCode()
            },
            fail(){
              wx.hideLoading()
              that.setData({
                authModal: true
              })
            }
          })
        }else{
          wx.hideLoading()
          that.saveQrCode()
        }
      }
    })
  },
  handleAuth:function(e) {
    that.handleClose()
    //console.error('e',e)
  },
  saveQrCode: function (){
    wx.showLoading({
      title: '保存中...',
      mask: true
    })
    wx.downloadFile({
      url: `https://dreamoncampus.com/dreamact/index/getMiniCode?scene=${that.data.activityInfo.activityId}&page=pages/activity/info&width=${that.data.codeSize}`,
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            $Message({
              content: `保存成功！`
            })
            wx.hideLoading()
          },
          fail: function (res) {
            console.error(res)
            $Message({
              content: res,
              type: 'warning'
            })
            wx.hideLoading()
          }
        })
      },
      fail: function () {
        $Message({
          content: '保存失败 请重试',
          type: 'warning'
        })
        wx.hideLoading()
      }
    })
  }
})