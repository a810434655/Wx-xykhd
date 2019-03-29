// pages/manage/applyfieldedit.js
const {
  $Message
} = require('../../resources/dist/base/index')
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    feildInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    that.data.feildInfo = JSON.parse(wx.getStorageSync('applyfieldedit'))
    console.error(that.data.feildInfo)
    that.setData({
      feildInfo: that.data.feildInfo
    })
  },
  changeKeyInput: function(e) {
    // console.error(e)
    that.data.feildInfo.key = e.detail.detail.value
  },
  inputTypeChange: function (e) {
    // console.error(e)
    that.data.feildInfo.inputType = e.detail.value
  },
  requiredChange: function (e) {
    // console.error(e)
    if (e.detail.value === '0'){
      that.data.feildInfo.required = true
    }else{
      that.data.feildInfo.required = false
    }
  },
  addRadioField: function (e) {
    that.data.feildInfo.radioList.push({
      name: ''
    })
    that.setData({
      feildInfo: that.data.feildInfo
    })
  },
  minusRadioField: function (e) {
    that.data.feildInfo.radioList.splice(e.currentTarget.dataset.idx, 1)
    that.setData({
      feildInfo: that.data.feildInfo
    })
  },
  changeRadioInput: function (e) {
    //console.error(e)
    that.data.feildInfo.radioList[parseInt(e.detail.target.dataset.key)].name = e.detail.detail.value
  },
  addCheckField: function (e) {
    that.data.feildInfo.checkList.push({
      name: ''
    })
    that.setData({
      feildInfo: that.data.feildInfo
    })
  },
  minusCheckField: function (e) {
    that.data.feildInfo.checkList.splice(e.currentTarget.dataset.idx, 1)
    that.setData({
      feildInfo: that.data.feildInfo
    })
  },
  changeCheckInput: function (e) {
    //console.error(e)
    that.data.feildInfo.checkList[parseInt(e.detail.target.dataset.key)].name = e.detail.detail.value
  },
  submit: function (){
    console.log(that.data.feildInfo)
    if (that.data.feildInfo.key.length < 1){
      $Message({
        content: `请检查必填信息是否输入`,
        type: 'warning'
      })
      return
    }
    if (that.data.feildInfo.fieldType === 'radio') {
      let radioList = that.data.feildInfo.radioList.filter(c => c.name.length > 0)
      if (radioList.length == 0) {
        $Message({
          content: `请至少录入一个选项`,
          type: 'warning'
        })
        return
      }
      that.data.feildInfo.radioList = radioList
    }
    if (that.data.feildInfo.fieldType === 'checkbox') {
      let checkList = that.data.feildInfo.checkList.filter(c => c.name.length > 0)
      if (checkList.length == 0) {
        $Message({
          content: `请至少录入一个选项`,
          type: 'warning'
        })
        return
      }
      that.data.feildInfo.checkList = checkList
    }
    wx.removeStorageSync('applyfieldedit')
    wx.setStorageSync('applyfieldeditre', JSON.stringify(that.data.feildInfo))
    wx.navigateBack({})
  }
})