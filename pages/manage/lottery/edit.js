// pages/manage/lottery/edit.js
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
    contentType: 0,
    contentImg: '',
    contentText:'',
    ruleData:"",
    extraData: {
      contact: '',
      content: '',
      lotteryType: '0',
      lotteryData:''
    },
    selectType: '0',
    nowDate: '',
    date: '',
    time: '00:00',
    peopleNum: 0,
    itemList: [{
      id: 0,
      pic: '',
      name: '',
      num: 0
    }]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    that.data.activityId = options.id
    that.data.nowDate = util.formatDate(new Date())
    that.setData({
      date: that.data.nowDate
    })
    if (options.formId) {
      options.extraData=JSON.parse(options.extraData)
      that.setData({
        formId: options.formId,
        itemList:JSON.parse(options.jsonData),
        extraData: options.extraData,
        selectType:options.extraData.lotteryType
      })
      //判断是多行文本还是单张长图 使用内容里标识的img~来判断
      if(options.extraData.content.substring(0,4)=="img~"){
         that.setData({
          contentImg:options.extraData.content.substring(4),
          contentType:1
         })
      }else{
        that.setData({
          contentText: options.extraData.content,
          contentType: 0
        })
      }
      
      // 判断开奖规则是根据时间来还是根据人数或者手动开奖
      if(options.extraData.lotteryType=="0"){
        that.setData({
          date: options.extraData.lotteryData.substring(0, 10),
          time: options.extraData.lotteryData.substring(11, 16)
        })
      }else if(options.extraData.lotteryType=="1"){
        that.setData({
          ruleData: options.extraData.lotteryData
        })
      }
    }
  },
  addItem: function (e) {
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
  minusItem: function (e) {
    that.data.itemList.splice(e.currentTarget.dataset.idx, 1)
    that.setData({
      itemList: that.data.itemList
    })
  },
  radioContentChange: function (e) {
    that.setData({
      contentType: e.detail.value
    })
  },
  upItemIMG: function (e) {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
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
  upImg: function (e) {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        _upservice.upImg({
          filePath: tempFilePaths[0]
        }).then(data => {
          switch (e.currentTarget.dataset.key) {
            case 'contentData':
              that.setData({
                contentImg: data
              })
              break
          }

        }).catch(errMsg => {
          $Message({
            content: '上传失败，请重试',
            type: 'warning'
          })
        })
      }
    })
  },
  removeImgInfo: function (e) {
    $Message({
      content: '长按可删除图片',
      type: 'warning'
    })
  },
  removeImg: function (e) {
    switch (e.currentTarget.dataset.inx) {
      case '7':
        that.setData({
          contentImg: ''
        })
        break
    }
    $Message({
      content: '删除成功'
    })
  },
  changeItemInput: function (e) {
    that.data.itemList[e.detail.currentTarget.dataset.key].name = e.detail.detail.value
  },
  changeItemNumInput: function (e) {
    if (parseInt(e.detail.detail.value) > 0) {
      that.data.itemList[e.detail.currentTarget.dataset.key].num = parseInt(e.detail.detail.value)
    } else {
      that.data.itemList[e.detail.currentTarget.dataset.key].num = 0
    }
  },
  changePeopleNumInput: function (e) {
    if (parseInt(e.detail.detail.value) > 0) {
      that.data.peopleNum = parseInt(e.detail.detail.value)
    }else{
      that.data.peopleNum = 0
    }
    that.setData({
      peopleNum: that.data.peopleNum
    })
  },
  bindDateChange: function (e) {
    that.data.date = e.detail.value
    that.setData({
      date: that.data.date
    })
  },
  bindTimeChange: function (e) {
    that.data.time = e.detail.value
    that.setData({
      time: that.data.time
    })
  },
  radioSelectChange: function (e) {
    that.setData({
      selectType: e.detail.value
    })
  },
  changeInput: function (e) {
    that.data.extraData[e.detail.currentTarget.dataset.key] = e.detail.detail.value
  },
  submit: function (e) {
   var customItems = that.data.itemList.filter(c => c.name.length > 0)
    if (customItems.length < 1) {
      $Message({
        content: '请至少添加一个奖品',
        type: 'warning'
      })
      return
    }
    for (let c in customItems){
      console.error(customItems[c])
      if (customItems[c].num < 1) {
        $Message({
          content: '奖品份数不能小于1',
          type: 'warning'
        })
        return
      }
    }
    if (that.data.selectType == '1' && that.data.peopleNum < 1) {
      $Message({
        content: '开奖人数不能小于1',
        type: 'warning'
      })
      return
    }
    if (that.data.contentType == '1' && that.data.contentImg == '') {
      $Message({
        content: '请检查补充描述图片是否上传',
        type: 'warning'
      })
      return
    }
    if (that.data.contentType == '1') {
      that.data.extraData.content = `img~${that.data.contentImg}`
    }
    wx.showLoading({
      title: '提交中...',
      mask: true
    })
    that.data.extraData.lotteryType = that.data.selectType
    switch (that.data.selectType) {
      case '0':
        that.data.extraData.lotteryData = `${that.data.date} ${that.data.time}:00`
        break
      case '1':
        that.data.extraData.lotteryData = that.data.peopleNum
        break
      case '2':
        that.data.extraData.lotteryData = ``
        break    
    }
    if (that.data.formId) {
      _activity.editActivityForm({
        activityId: that.data.activityId, type: '4', jsonData: JSON.stringify(customItems), extraData: JSON.stringify(that.data.extraData), formId: that.data.formId
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
        activityId: that.data.activityId, type: '4', jsonData: JSON.stringify(customItems), extraData: JSON.stringify(that.data.extraData)
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