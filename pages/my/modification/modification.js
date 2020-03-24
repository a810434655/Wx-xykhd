// pages/my/modification/modification.js
let that = this
let _user = require("../../../service/user.js")
const {
  $Message
} = require('../../../resources/dist/base/index')
let _activity = require("../../../service/activity.js")
let _upservice = require("../../../service/upservice.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    userName: "",
    sex: [{ name: "保密", id: "0" }, { name: "男", id: "1" }, { name: "女", id: "2" }],
    bannerData: "",
    editModal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    that.getUser()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  bindSex(e) {
    that.data.userInfo.sex = e.detail.value
    that.setData({
      userInfo: that.data.userInfo
    })
  },
  bindinputCollege(e) {
    that.data.userInfo.college = e.detail.value
    that.setData({
      userInfo: that.data.userInfo
    })
  },
  bindinputNickName(e) {
    that.data.userInfo.nickname = e.detail.value
    that.setData({
      userInfo: that.data.userInfo
    })
  },
  save(e) {
    if (that.data.userInfo.nickname.length == 0) {
      $Message({
        content: '请输入昵称',
        type: 'warning'
      })
    }
    // console.log(that.data.userInfo.sex)
    let arr = that.data.bannerData
    let data = {
      avatar: arr,
      nickname: that.data.userInfo.nickname,
      sex: that.data.userInfo.sex,
      college: that.data.userInfo.college
    }
    _activity.putUpdata(data)
      .then(res => {
        if (res == "更新成功") {
          $Message({
            content: res
          })
        }
      })
      .catch(e => {
        $Message({
          content: e.message,
          type: 'warning'
        })
      })
  },
  quit() {
    that.setData({
      editModal: true
    })
  },
  handleEdit() {
    _user.quit()
      .then(res => {
        if (res == "登出成功") {
          wx.clearStorage()
          $Message({
            content: "退出登录成功"
          })
          wx.reLaunch({
            url: '/pages/login',
          })
        }
      })
      .catch(e => {
        $Message({
          content: e.message,
          type: 'warning'
        })
      })

  },
  handleClose() {
    that.setData({
      editModal: false
    })
  },
  upImg: function (e) {
    console.log(e)
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        res.tempFiles.forEach((item) => {
          if (item.size >= 5242880) {
            $Message({
              content: '上传失败，请上传小于5M的文件',
              type: 'warning'
            })
            return false
          }
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        _upservice.upImg({
          filePath: tempFilePaths[0]
        }).then(data => {
          switch (e.currentTarget.dataset.key) {
            case 'banner':
              that.data.bannerData.push(data)
              that.setData({
                bannerData: that.data.bannerData
              })
              break
            // case 'posterData':
            //   that.data.activityInfo.posterData = data
            //   that.setData({
            //     activityInfo: that.data.activityInfo
            //   })
            //   break
            case 'shareLink':
              that.data.activityInfo.shareLink = data
              that.setData({
                activityInfo: that.data.activityInfo
              })
              break
            case 'contentData':
              that.setData({
                bannerData: data
              })
              break
          }

        }).catch(e => {
          $Message({
            content: '上传失败，请重试',
            type: 'warning'
          })
        })
      }
    })
  },
  getUser() {
    let userId = wx.getStorageSync("userId")
    _user.getSchool({ userId: userId })
      .then(item => {
        if (!item.sex) {
          item.sex = 0
        }

        that.data.userInfo = item
        that.setData({
          userInfo: that.data.userInfo
        })
      })
      .catch(e => {
        $Message({
          content: e.message,
          type: 'warning'
        })
      })
  },
})