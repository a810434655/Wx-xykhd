// pages/manage/vote/edit.js
var _activity = require("../../../service/activity.js")
const {
  $Message
} = require('../../../resources/dist/base/index')
var _upservice = require("../../../service/upservice.js")
var util = require('../../../utils/util.js')
var app = getApp()
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityId: undefined,
    formId: '',
    extraData: {
      name: '',
      content: '',
      maxItem:"",
      minItem:"",
      voteType:"1",
      showType:"1"
    },
    selectType: '0',
    nowDate: '',
    date: '',
    time: '00:00',
   
    itemList: [{
      id: 0,
      pic: '',
      name: '',
      num:0
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this
    that.data.activityId = options.id
    that.data.nowDate = util.formatDate(new Date())
    that.setData({
      date: that.data.nowDate
    })
    if (options.formId) {
      that.cache(JSON.parse(options.jsonData),JSON.parse(options.extraData))
      that.setData({
        formId: options.formId,
        date: options.endDate,
          time: options.endTime.substring(0, 5)
      })
    }
  },
  cache: function (jsonData, data){
      that.data.extraData=data
      that.setData({
        itemList:jsonData,
        extraData:that.data.extraData,
        selectType: data.selectType,
      })
  },
  addItem: function(e) {
    that.data.itemList.push({
      id: that.data.itemList[that.data.itemList.length - 1].id + 1,
      pic: '',
      name: '',
      num: 0
    })
    that.setData({
      itemList: that.data.itemList
    })
  },
  minusItem: function(e) {
    that.data.itemList.splice(e.currentTarget.dataset.idx, 1)
    that.setData({
      itemList: that.data.itemList
    })
  },
  upItemIMG: function(e) {
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
          that.data.itemList[e.currentTarget.dataset.idx].pic = data
          that.setData({
            itemList: that.data.itemList
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
  changeItemInput: function(e) {
    that.data.itemList[e.detail.currentTarget.dataset.key].name = e.detail.detail.value
  },
  changeCheckItemInput: function(e) {
    that.data.extraData[e.detail.currentTarget.dataset.key] = e.detail.detail.value
  },
  bindDateChange: function(e) {
    that.data.date = e.detail.value
    that.setData({
      date: that.data.date
    })
  },
  bindTimeChange: function(e) {
    that.data.time = e.detail.value
    that.setData({
      time: that.data.time
    })
  },
  radioSelectTypeChange: function(e) {
    that.setData({
      selectType: e.detail.value
    })
  },
  radioVoteTypeChange:function(e){
    that.data.extraData.voteType = e.detail.value
    that.setData({
      extraData:that.data.extraData
    })
  },
  radioShowTypeChange:function(e){
    that.data.extraData.showType = e.detail.value
    that.setData({
      extraData: that.data.extraData
    })
  },
  changeInput: function (e) {
    that.data.extraData[e.detail.currentTarget.dataset.key] = e.detail.detail.value
  },
  submit: function(e) {
    if (that.data.extraData.name.length == 0) {
      $Message({
        content: '请输入投票名称',
        type: 'warning'
      })
      return
    }
    var customItems = that.data.itemList.filter(c => c.name.length > 0)
    if (customItems.length < 2) {
      $Message({
        content: '请至少添加两个选项',
        type: 'warning'
      })
      return
    }
    if (that.data.selectType == '1' && (that.data.extraData.minItem == 0 || that.data.extraData.maxItem == 0)) {
      $Message({
        content: '投票选项不能为0',
        type: 'warning'
      })
      return
    }
    if (that.data.selectType == '1' && that.data.extraData.minItem > that.data.extraData.maxItem) {
      $Message({
        content: '投票最少项不能大于最多项',
        type: 'warning'
      })
      return
    }
    if (that.data.selectType == '1' && (that.data.extraData.minItem > customItems.length || that.data.extraData.maxItem > customItems.length)) {
      $Message({
        content: '投票最少项和最多项不能大于选项数量',
        type: 'warning'
      })
      return
    }
    that.data.extraData.selectType = that.data.selectType
    wx.showLoading({
      title: '提交中...',
      mask: true
    })
    if (that.data.formId) {
      _activity.editActivityForm({
        activityId: that.data.activityId, type: '3', jsonData: JSON.stringify(customItems), extraData: JSON.stringify(that.data.extraData), formId: that.data.formId, endDate: `${that.data.date} ${that.data.time}:00`
      }).then(data => {
        wx.navigateBack({})
        wx.hideLoading()
      }).catch(errMsg => {
        // wx.navigateBack({})
        $Message({
          content: errMsg,
          type: 'warning'
        })
        wx.hideLoading()
      })
    } else {
      _activity.creatActivityForm({
        activityId: that.data.activityId, type: '3', jsonData: JSON.stringify(customItems), extraData: JSON.stringify(that.data.extraData), endDate: `${that.data.date} ${that.data.time}:00`
      }).then(data => {
        wx.navigateBack({})
        wx.hideLoading()
      }).catch(errMsg => {
        // wx.navigateBack({})
        $Message({
          content: errMsg,
          type: 'warning'
        })
        wx.hideLoading()
      })
    }
  }
})