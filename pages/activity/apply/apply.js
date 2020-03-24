// pages/activity/apply.js
var _activity = require("../../../service/activity.js")
var _upservice = require("../../../service/upservice.js")
const {
  $Message
} = require('../../../resources/dist/base/index')
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
      pic: "https://oss.dreamoncampus.com//file/img/theme1@2x.png"
      },
      {
        buttonTheme: 'theme2',
        pic: "https://oss.dreamoncampus.com//file/img/theme2@2x.png"
      },
      {
        buttonTheme: 'theme3',
        pic: "https://oss.dreamoncampus.com//file/img/theme3@2x.png"
      },  
      {
        buttonTheme: 'theme4',
        pic: "https://oss.dreamoncampus.com//file/img/theme4@2x.png"
      },
      {
        buttonTheme: 'theme5',
        pic: "https://oss.dreamoncampus.com//file/img/theme5@2x.png"
      }
    ],
    formId:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this
    that.data.formId = options.formId
    // console.log(options.theme)
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
      formId: that.data.formId
    }).then(data => {
      // console.log(data)
      data.form.jsonData = JSON.parse(data.form.jsonData)
      // that.data.formData = data.jsonData.filter(c => c.required).map((d, i) => {
      that.data.formData = data.form.jsonData.map((d, i) => {
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
      // console.log(data.form.endDate)
      that.data.endDate = new Date(data.form.endDate).getFullYear() + '-' + (parseInt(new Date(data.form.endDate).getMonth()) + 1) + '-' + new Date(data.form.endDate).getDate() + ' ' + new Date(data.form.endDate).getHours() + ':' + new Date(data.form.endDate).getMinutes()
      that.setData({
        formInfo: data.form,
        endDate: that.data.endDate
      })
      // console.log(that.data.endDate)
      wx.hideLoading()
    }).catch(e => {
      $Message({
        content: e.message,
        type: 'warning'
      })
      wx.navigateBack({})
      wx.hideLoading()
    })
  },

  changeInput: function(e) {
    that.data.formData[e.detail.currentTarget.dataset.key].data = e.detail.detail.value
  },

  radioChange: function(e) {
    // console.error(e)
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
    let name = ""
    jsonData.forEach(item=>{
      // console.log(item)
      if(name.length == 0){
        if (item.key == "姓名") {
          name = item.data
          console.log(name)
          return false
        } else {
          name = wx.getStorageSync("userInfo").nickName
          console.log(name)
          return false
        }
      } 
    })
  //  console.log(name)
    _activity.postUserApplyForm({
      jsonData: JSON.stringify(jsonData),
      formId: that.data.formId,
      name:name
    }).then(data => {
      // console.log(data)
      app.toStatePage({
        state: 2,
        title: '报名',
        info: '报名成功',
        content: '报名成功，请前往个人中心查看！'
      })
      wx.hideLoading()
    }).catch(e => {
      wx.hideLoading()
      if (e.message == '不能重复报名'){
        that.setData({
          infoModal: true
        })
        return
      }
      // console.log(errMsg)
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
    // console.log("进入")
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
    let name = ""
    jsonData.forEach(item => {
      // console.log(item)
      if (item.key == "姓名") {
        name = item.data
      } else {
        name = wx.getStorageSync("userInfo").nickName 
      }
    })
    _activity.postReUserApplyForm({
      jsonData: JSON.stringify(jsonData),
      formId: that.data.formId,
      name:name
    }).then(data => {
      app.toStatePage({
        state: 2,
        title: '报名',
        info: '报名成功',
        content: '报名成功，请前往个人中心查看！'
      })
      wx.hideLoading()
    }).catch(e => {
      $Message({
        content: e.message,
        type: 'warning'
      })
      wx.hideLoading()
    })
  }
})