// pages/my/guidance/guidance.js
let that
const { $Message } = require('../../../resources/dist/base/index')
let _activity = require("../../../service/activity.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    session: "",
    schoolId: "",
    schoolName: "",
    date: [
    ],
    nickName: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    if (options.schoolId) {
      wx.setStorageSync("schoolId", options.schoolId)
      that.setData({
        schoolId: options.schoolId
      })
    } else if (wx.getStorageSync("schoolId")) {
      that.setData({
        schoolId: wx.getStorageSync("schoolId")
      })
    }
    if (options.schoolName) {
      wx.setStorageSync("schoolName", options.schoolName)
      that.setData({
        schoolName: options.schoolName
      })
    } else if (wx.getStorageSync("schoolName")) {
      that.setData({
        schoolName: wx.getStorageSync("schoolName")
      })
    }
    if (wx.getStorageSync("session")) {
      that.setData({
        session: wx.getStorageSync("session")
      })
    }
    if (wx.getStorageSync("nickname")) {
      that.setData({
        nickName: wx.getStorageSync("nickname")
      })
    }

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let date = new Date().getFullYear()
    for (let i = (date - 10); i <= date; i++) {
      that.data.date.push(i)
    }
    that.setData({
      date: that.data.date
    })

  },
  bindinput: function (e) {
    that.setData({
      nickName: e.detail.value
    })
    wx.setStorageSync("nickname", e.detail.value)
  },
  bindschool: function () {
    wx.navigateTo({
      url: '/pages/ui/selectpage/selectpage',
    })
  },
  bindcollege: function () {
    wx.navigateTo({
      url: `/pages/my/name/name?url=/pages/my/guidance/guidance`,
    })
  },
  bindguidance: function () {
    if (that.data.nickName == "") {
      $Message({
        content: "请输入您的昵称"
      })
      return false
    }
    if (that.data.schoolId == "") {
      $Message({
        content: "请选择学校"
      })
      return false
    }
    if (that.data.session == "") {
      $Message({
        content: "请选择届别"
      })
      return false
    }
    let data = {
      schoolId: that.data.schoolId,
      enrollYear: that.data.session,
      nickname: that.data.nickName
    }
    _activity.putUpdata(data)
      .then(res => {
        if (res == "更新成功") {
          wx.removeStorageSync("session")
          wx.removeStorageSync("nickName")
          wx.removeStorageSync("schoolName")
          if (wx.getStorageSync("activityId")) {
            wx.reLaunch({
              url: `/pages/activity/info/info?id=${wx.getStorageSync("activityId")}`,
            })
            wx.removeStorageSync("activityId")
          } else {
            wx.switchTab({
              url: "/pages/home/plaza/plaza"
            })
          }
        }
      })
      .catch(e => {
        $Message({
          content: e.message,
          type: 'warning'
        })
      })

  },
  bindsession: function (e) {
    wx.setStorageSync("session", that.data.date[e.detail.value])
    that.setData({
      session: that.data.date[e.detail.value]
    })
  }

})