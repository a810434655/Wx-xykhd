// pages/activity/lootticket.js
var _activity = require("../../service/activity.js")
const { $Message } = require('../../resources/dist/base/index')
var app = getApp()
var that
var formId
var key
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityId: '',
    title: '',
    formInfo:{},
    formData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    that.data.activityId = options.id
    that.setData({
      title: options.title
    })
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    _activity.getActivityForm({
      activityId: that.data.activityId,
      type: '2'
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
        formInfo: data
      })
      wx.hideLoading()
    }).catch(errMsg => {
      console.error(errMsg)
      wx.navigateBack({})
      wx.hideLoading()
    })
  },
  changeInput: function (e) {
    that.data.formData[e.detail.currentTarget.dataset.key].data = e.detail.detail.value
  },
  // radioChange: function (e) {
  //   that.data.formData[e.currentTarget.dataset.inx].data = e.detail.value
  // },
  radioChange: function (e) {
    console.error(e)
    // that.data.formData[e.currentTarget.dataset.inx].data = e.detail.value
    that.data.formData[e.currentTarget.dataset.inx].data = that.data.formData[e.currentTarget.dataset.inx].radioList[e.detail.value].name
    that.data.formData[e.currentTarget.dataset.inx].radioList.forEach(c => c.checked = false)
    that.data.formData[e.currentTarget.dataset.inx].radioList[e.detail.value].checked = true
  },
  checkboxChange: function (e) {
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
  commit: function(e) {
    formId = e.detail.formId
    console.error(formId)
    for (var c of that.data.formData){
      if (c.value == 'key'){
        key = c.data
      }
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
        return d
      })
    wx.showLoading({
      title: '抢票中...',
      mask: true
    })
    _activity.postUserTicketForm({
      activityId: that.data.activityId,
      jsonData: JSON.stringify(jsonData),
      key: key,
      formId: formId
    }).then(data => {
      app.toStatePage({
        state: 2,
        title: '抢票',
        info: '抢票成功',
        content: '抢票成功，请前往个人中心查看！'
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