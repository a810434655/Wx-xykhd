// pages/activity/vote.js
var _activity = require("../../service/activity.js")
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
    themeId: 0,
    formInfo: {},
    vote: 0,
    formData: [],
    extraData:"",
    title: '',
    beginDate: '',
    endDate: '',
    themeList: [{
      buttonTheme: 'theme1',
      color: '#ffbf00',
      pic: "http://www.dreamoncampus.com/file/img/ic_theme_apply_tiele_1.png"
    },
    {
      buttonTheme: 'theme2',
      color: '#ff4c39',
      pic: "http://www.dreamoncampus.com/file/img/ic_theme_apply_tiele_2.png"
    },
    {
      buttonTheme: 'theme3',
      color: '#1dd89c',
      pic: "http://www.dreamoncampus.com/file/img/ic_theme_apply_tiele_3.png"
    },
    {
      buttonTheme: 'theme4',
      color: '#21a3f6',
      pic: "http://www.dreamoncampus.com/file/img/ic_theme_apply_tiele_4.png"
    },
    {
      buttonTheme: 'theme5',
      color: '#252436',
      pic: "http://www.dreamoncampus.com/file/img/ic_theme_apply_tiele_5.png"
    }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    that.data.activityId = options.id
    that.setData({
      vote: options.vote,
      title: options.title,
      beginDate: options.beginDate,
      endDate: options.endDate,
      themeId: parseInt(options.theme)
    })
  },
  onShow: function(){
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    _activity.getActivityForm({
      activityId: that.data.activityId,
      type: '3'
    }).then(data => {
      console.log(data);
      data.jsonData = JSON.parse(data.jsonData)
      data.extraData = JSON.parse(data.extraData)
      // data.endTime=data
      if (data.extraData.optionId){
        let selectItem = data.extraData.optionId.split(',')
        data.jsonData.forEach(c => {
          selectItem.some(d => {
            if (c.id == d){c.checked = true}
            return c.id == d
          })
        })
      }
      
      that.setData({
        formInfo: data,
        formData: data.jsonData,
        endDate: data.endDate.substring(0,16),
      })
      wx.hideLoading()
    }).catch(errMsg => {
      console.error(errMsg)
      wx.navigateBack({})
      wx.hideLoading()
    })
  },
  selectItem: function (e) {
    if (that.data.formInfo.extraData.optionId || that.data.vote <= 0) return
    if (that.data.formInfo.extraData.selectType == '0'){
      that.cleanItemCheck()
    }
    that.data.formData[e.currentTarget.dataset.inx].checked = !that.data.formData[e.currentTarget.dataset.inx].checked
    that.setData({
      formData: that.data.formData
    })
  },
  cleanItemCheck: function () {
    that.data.formData.forEach(c => c.checked = false)
  },
  submit: function (e) {
    formId = e.detail.formId
    let checkedData = that.data.formData.filter(c => c.checked)
    if (that.data.formInfo.extraData.selectType == '0' && checkedData.length != 1) {
      $Message({
        content: `请选择一项进行投票`,
        type: 'warning'
      })
      return
    }
    if (that.data.formInfo.extraData.selectType == '1') {
      if (that.data.formInfo.extraData.minItem > checkedData.length){
        $Message({
          content: `请至少选择${that.data.formInfo.extraData.minItem}项进行投票`,
          type: 'warning'
        })
        return
      }
      if (that.data.formInfo.extraData.maxItem < checkedData.length) {
        $Message({
          content: `至多只能选择${that.data.formInfo.extraData.maxItem}项进行投票`,
          type: 'warning'
        })
        return
      }
    }
    let selectStr = checkedData.map(d => {
      return d.id
    }).join(',')
    wx.showLoading({
      title: '投票中...',
      mask: true
    })
    _activity.postUserVoteForm({
      formId: that.data.formInfo.formId,
      optionId: selectStr
    }).then(data => {
      that.onShow()
      wx.hideLoading()
    }).catch(errMsg => {
      wx.hideLoading()
      $Message({
        content: errMsg,
        type: 'warning'
      })
    })
  }
})