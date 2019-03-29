// pages/activity/apply.js
var _activity = require("../../service/activity.js")
var _upservice = require("../../service/upservice.js")
const {
  $Message
} = require('../../resources/dist/base/index')
var app = getApp()
var that
var formId
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityId: '',
    infoModal: false,
    themeId: 0,
    formInfo: {},
    formData: [],
    title: '',
    beginDate: '',
    endDate: '',
    themeList: [{
      buttonTheme: 'theme1',
        pic: "http://www.dreamoncampus.com/file/img/ic_theme_apply_tiele_1.png"
      },
      {
        buttonTheme: 'theme2',
        pic: "http://www.dreamoncampus.com/file/img/ic_theme_apply_tiele_2.png"
      },
      {
        buttonTheme: 'theme3',
        pic: "http://www.dreamoncampus.com/file/img/ic_theme_apply_tiele_3.png"
      },
      {
        buttonTheme: 'theme4',
        pic: "http://www.dreamoncampus.com/file/img/ic_theme_apply_tiele_4.png"
      },
      {
        buttonTheme: 'theme5',
        pic: "http://www.dreamoncampus.com/file/img/ic_theme_apply_tiele_5.png"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this
    that.data.activityId = options.id
    that.setData({
      title: options.title,
      beginDate: options.beginDate,
      endDate: options.endDate,
      themeId: parseInt(options.theme)
    })
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    _activity.getActivityForm({
      activityId: that.data.activityId,
      type: '1'
    }).then(data => {
      data.jsonData = JSON.parse(data.jsonData)
      // that.data.formData = data.jsonData.filter(c => c.required).map((d, i) => {
      that.data.formData = data.jsonData.map((d, i) => {
        d.data = ''
        return d
      })
      // .map((d,i) => {
      //   delete d.fieldType
      //   delete d.required
      //   delete d.inputType
      //   delete d.placeholder
      //   delete d.checked
      //   return d
      // })
      that.setData({
        formInfo: data,
        endDate: data.endDate.substr(0, 11)
      })
      wx.hideLoading()
    }).catch(errMsg => {
      console.error(errMsg)
      wx.navigateBack({})
      wx.hideLoading()
    })
  },
  changeInput: function(e) {
    that.data.formData[e.detail.currentTarget.dataset.key].data = e.detail.detail.value
  },
  radioChange: function(e) {
    console.error(e)
    // that.data.formData[e.currentTarget.dataset.inx].data = e.detail.value
    that.data.formData[e.currentTarget.dataset.inx].data = that.data.formData[e.currentTarget.dataset.inx].radioList[e.detail.value].name
    that.data.formData[e.currentTarget.dataset.inx].radioList.forEach(c => c.checked = false)
    that.data.formData[e.currentTarget.dataset.inx].radioList[e.detail.value].checked = true
  },
  checkboxChange: function(e) {
    // console.log(e, e.detail.value)
    that.data.formData[e.currentTarget.dataset.inx].checkList.forEach(c => {
      c.checked = false
    })
    that.data.formData[e.currentTarget.dataset.inx].data = ''
    let check = ''
    e.detail.value.forEach(c => {
      check += `${that.data.formData[e.currentTarget.dataset.inx].checkList[c].name},`
      that.data.formData[e.currentTarget.dataset.inx].checkList[c].checked = true
      // check += `${c},`
    })
    if (check.length > 0) {
      that.data.formData[e.currentTarget.dataset.inx].data = check.substr(0, check.length - 1)
    }
    // that.data.formData[e.currentTarget.dataset.inx].data = e.detail.value
  },
  bindDateChange: function(e) {
    that.data.formData[e.currentTarget.dataset.inx].data = e.detail.value
    that.setData({
      formInfo: that.data.formInfo,
      formData: that.data.formData
    })
  },
  upImage: function(e) {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        _upservice.upImg({
          filePath: tempFilePaths[0]
        }).then(data => {
          that.data.formData[e.currentTarget.dataset.inx].data = data
          that.setData({
            formInfo: that.data.formInfo,
            formData: that.data.formData
          })
        }).catch(errMsg => {
          $Message({
            content: '上传失败，请重试',
            type: 'warning'
          })
        })
      }
    })
  },
  handleClose: function () {
    that.setData({
      infoModal: false
    })
  },
  submit: function(e) {
    formId = e.detail.formId
    // console.error(formId)
    for (var c of that.data.formData) {
      if (c.required && (c.data == undefined || c.data.length == 0)) {
        $Message({
          content: `请检查${c.key}是否已经输入`,
          type: 'warning'
        })
        return
      }
    }
    
    var jsonData = that.data.formData.map((d, i) => {
      delete d.fieldType
      delete d.required
      delete d.inputType
      delete d.placeholder
      delete d.checked
      delete d.radioList
      delete d.checkList
      return d
    })
    wx.showLoading({
      title: '报名中...',
      mask: true
    })
    _activity.postUserApplyForm({
      activityId: that.data.activityId,
      jsonData: JSON.stringify(jsonData),
      formId: formId
    }).then(data => {
      app.toStatePage({
        state: 2,
        title: '报名',
        info: '报名成功',
        content: '报名成功，请前往个人中心查看！'
      })
      wx.hideLoading()
    }).catch(errMsg => {
      wx.hideLoading()
      if (errMsg == '不能重复报名'){
        that.setData({
          infoModal: true
        })
        return
      }
      $Message({
        content: errMsg,
        type: 'warning'
      })
    })
  },
  reCommit: function (e) {
    for (var c of that.data.formData) {
      if (c.required && (c.data == undefined || c.data.length == 0)) {
        $Message({
          content: `请检查${c.key}是否已经输入`,
          type: 'warning'
        })
        return
      }
    }
    var jsonData = that.data.formData.map((d, i) => {
      delete d.fieldType
      delete d.required
      delete d.inputType
      delete d.placeholder
      delete d.checked
      delete d.radioList
      delete d.checkList
      return d
    })
    wx.showLoading({
      title: '报名中...',
      mask: true
    })
    that.setData({
      infoModal: false
    })
    _activity.postReUserApplyForm({
      activityId: that.data.activityId,
      jsonData: JSON.stringify(jsonData),
      formId: formId
    }).then(data => {
      app.toStatePage({
        state: 2,
        title: '报名',
        info: '报名成功',
        content: '报名成功，请前往个人中心查看！'
      })
      wx.hideLoading()
    }).catch(errMsg => {
      $Message({
        content: errMsg,
        type: 'warning'
      })
      wx.hideLoading()
    })
  }
})