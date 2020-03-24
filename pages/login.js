// pages/login.js
const {
  $Message
} = require('../resources/dist/base/index')
const app = getApp()
let that
Page({
  data: {
    checked:false,
    phone:""
  },
  onLoad: function (opstion) {
    that = this
    if (opstion.message){
      $Message({
        content:opstion.message,
        type: 'error'
      })
    }
  },
  handleAnimalChange:function(e){
    // console.log(e)
    that.setData({
      checked:e.detail.current
    })
  },
  handleInput:function(e){
    that.setData({
      phone:e.detail.value
    })
  },
  handleTap:function(e){
    let url = 'https://h5.dreamoncampus.com/file/html/privacypolicy.html'
    wx.navigateTo({
      url: `/pages/ui/webview/webview?url=${url}`,
    })
  },
  handleClick:function(e){
    //  console.log(that.data.phone)
    if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(that.data.phone))) {
      // console.log(that.data.phone)
      $Message({
        content:"请输入正确的手机号"
      })
      return
    }
    if(that.data.checked != true){
      $Message({
        content: "请阅读并同意聚芒星球使用条款和隐私政策"
      })

      return
    }
    // console.log(that.data.phone)
    wx.navigateTo({
      url: `/pages/loginCode?phone=${that.data.phone}`,
    })

  }
  
})