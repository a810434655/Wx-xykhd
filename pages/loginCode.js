// pages/loginCode.js
let that
let _user = require("../service/user.js")
let uuid = require("../utils/uuid.js")
let windos = windos
const {
  $Message
} = require('../resources/dist/base/index')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    code:"",
    disabled:false,
    codeDown:"发送验证码",
    phone:"",
    id:"",
    number:-1,
    focus:false,
    text:[
      {
        content: ""
      },
      {
        content: ""
      },
      {
        content: ""
      }, 
      {
        content: ""
      }
    ]
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    if(options.phone){
      that.setData({
        phone: options.phone
      })
      that.handleClick()
    }else{
      $Message({
        content:"手机号不存在"
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
  bindClick:function(e){
    that.setData({
      number:e.target.dataset.index,
      focus:true
    })
    that.data.code = that.data.code.substring(0, that.data.number)
    that.setData({
      code:that.data.code
    })
    setTimeout(function(){
      for (let i = 0; i < e.target.dataset.index; i++) {
        if (that.data.text[i].content.length == 0) {
          if(that.number != i){
            that.setData({
              number: i,
            })
          }
          return false
        }
      }
    },100)
  },
  handleInput:function(e){
    that.setData({
      code:e.detail.value
    })
    for(let i=0;i<that.data.code.length;i++){
        that.data.text[i].content = that.data.code[i]
    }
    that.data.text.forEach((item,key) => {
      if (key < that.data.code.length){
        return false
      }else{
        item.content = ""
      }
    })  
    that.setData({
      number:that.data.code.length-1,
      text: that.data.text
    })
    if (that.data.code.length == 1) that.setData({ number: 1 })
    if (that.data.code.length == 2) that.setData({ number: 2 })
    if (that.data.code.length == 3) that.setData({ number: 3 })
    if (that.data.code.length == 4) that.setData({ number: 4 })
    if(that.data.code.length == 4){
      wx.showLoading({
        title: '加载中',
      })
       let _uuid = uuid.wxuuid();
      _user.phoneLogin({ code: that.data.code, phone: that.data.phone, systemId: 4, uniqueId: _uuid})
      .then(res =>{
        wx.setStorageSync("uuid", _uuid)
        wx.setStorageSync("token", res.token)
        wx.setStorageSync("phone", res.username)
        wx.setStorageSync("userId", res.userId)
        // wx.setStorageSync("uuid", 'ee6a0fc1-fbd6-47cf-88b4-508a6674a7a5')
        // wx.setStorageSync("token", 'bdb8fabf-31b9-40a3-8d2e-bb5088231bd7')
        // wx.setStorageSync("phone", '17608558160')
        // wx.setStorageSync("userId", 'zupvoxvqabcqzlonawzgmqfqeajplevc')
        // 登录成功 判断是否是新用户 需要选择学校 如果从活动页面过来的跳回活动页面
        _user.getUserMeage().then(res => {
          _user.getSchool({ userId:res.userId })
            .then(data => {
              wx.hideLoading()
              if (data.schoolId) {
                wx.setStorageSync("schoolId", data.schoolId)
                if (wx.getStorageSync("activityId")) {
                  wx.redirectTo({
                    url: `/pages/activity/info/info?id=${wx.getStorageSync("activityId")}`,
                  })  
                  wx.removeStorageSync("activityId")
                } else {
                  wx.switchTab({
                    url: '/pages/home/plaza/plaza',
                  })
                }
              } else {
                wx.reLaunch({
                  url: `/pages/my/guidance/guidance`
                })
              }
            })
            .catch(e => {
              wx.hideLoading()
              $Message({
                content: e.message,
                type: 'warning'
              })
            })
        })
      })
      .catch(e => {
        wx.hideLoading()
        $Message({
          content: e.message,
          type: 'warning'
        })
      })
    }
  },
  handleClick:function(e){
    _user.phoneCode({codeType:1,phone:that.data.phone})
    .then(res =>{
      if(res == "验证码发送成功"){
        that.setData({
          disabled: true
        })
        let down = 60
        $Message({
          content:"发送验证码成功"
        })
        that.data.id = setInterval(function () {
          down--
          if (down <= 0) {
            that.setData({
              codeDown: "发送验证码",
              disabled: false
            })
            clearInterval(that.data.id)
          } else {
            that.data.codeDown = down + 's'
            that.setData({
              codeDown: that.data.codeDown
            })
          }
        }, 1000)
        that.setData({
          id:that.data.id
        })
      }
    })
    .catch(e =>{
      $Message({
        content: e.message,
        type: 'warning'
      })
    })
  }
  
})