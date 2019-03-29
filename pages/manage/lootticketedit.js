// pages/manage/lootticketedit.js
var _activity = require("../../service/activity.js")
var _upservice = require("../../service/upservice.js")
const {
  $Message
} = require('../../resources/dist/base/index')
var util = require('../../utils/util.js')
var app = getApp()
var that
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    questionModal: false,
    questionUrl: '',
    questionInfo: '',
    question: [
      {
        url: 'http://www.dreamoncampus.com/file/img/ic_question_ticket.png', info: `该图片展示在用户获得的门票上
      可使用活动海报或赞助商广告等` }
    ],
    activityId: '',
    formId: '',
    nowDate: '',
    date: '',
    time: '00:00',
    joinDate: '',
    joinTime: '00:00',
    redeemCode: '0',
    beginDate:"",
    endDate:"",
    formKeys: [{
        key: '姓名',
        value: 'name',
        fieldType: 'input',
        required: true,
        inputType: 'text',
        placeholder: '请输入姓名',
        checked: false
      },
      {
        key: '学院',
        value: 'college',
        fieldType: 'input',
        required: true,
        inputType: 'text',
        placeholder: '请输入学院名',
        checked: false
      }, {
        key: '年级',
        value: 'grade',
        fieldType: 'radio',
        required: true,
        radioList: [{
          name: '大一',
          value: 1
        }, {
          name: '大二',
          value: 2
        }, {
          name: '大三',
          value: 3
        }, {
          name: '大四',
          value: 4
        }, {
          name: '其他',
          value: 5
        }],
        checked: false
      },
      {
        key: '班级',
        value: 'class',
        fieldType: 'input',
        required: true,
        inputType: 'text',
        placeholder: '请输入班级',
        checked: false
      },
      {
        key: '学号',
        value: 'schoolId',
        fieldType: 'input',
        required: true,
        inputType: 'number',
        placeholder: '请输入学号',
        checked: false
      },
      {
        key: '微信号',
        value: 'wechatID',
        fieldType: 'input',
        required: true,
        inputType: 'text',
        placeholder: '请输微信号',
        checked: false
      },
      {
        key: '邮箱',
        value: 'email',
        fieldType: 'input',
        required: true,
        inputType: 'text',
        placeholder: '请输入邮箱',
        checked: false
      },
      {
        key: '电话',
        value: 'phone',
        fieldType: 'input',
        required: true,
        inputType: 'number',
        placeholder: '请输入手机号',
        checked: false
      },
      {
        key: 'QQ',
        value: 'qq',
        fieldType: 'input',
        required: true,
        inputType: 'number',
        placeholder: '请输入QQ号',
        checked: false
      }
    ],
    extraData: {
      address: '',
      ticketImg: ''
    },
    ticketNumber: 1,
    customTypes: [
      {
        name: '单行文本',
        value: 'input'
      },
      {
        name: '单项选择',
        value: 'radio'
      },
      {
        name: '多项选择',
        value: 'checkbox'
      }
    ],
    customFields: [
      {
        key: '',
        value: 'custom0',
        fieldType: ``,
        required: true,
        placeholder: `自定义字段0`
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this
    that.data.activityId = options.id
    that.data.nowDate = util.formatDate(new Date())
    that.data.date = that.data.nowDate
    console.log(options)
    that.setData({
      nowDate: that.data.nowDate,
      date: that.data.date,
      joinDate: that.data.date
    })
    
    if (options.formId) {
      console.log(options)
      that.cache(JSON.parse(options.jsonData)); //操作抢票信息 
      that.Date(options.beginDate, options.endData) //操作抢票时间
      if (options.remainTickets=="0"){
        options.remainTickets=1
      }
      that.setData({
        formId: options.formId,
        ticketNumber:parseInt(options.remainTickets),
        extraData: JSON.parse(options.extraData),
        redeemCode: JSON.parse(options.extraData).redeemCode
      })
    }
  },
  //
  cache:function(jsonData){
    that.data.customFields = []
    jsonData.forEach(item => {
      if (item.value.indexOf("custom") == -1) {
        that.data.formKeys.forEach((list, i) => {
          if (item.key == list.key) {
            that.data.formKeys[i] = item
          }
        })
      } else {
        that.data.customFields.push(item)
      }
    })
    if (that.data.customFields.length == 0) {
      var custom = {
        key: '',
        value: 'custom0',
        fieldType: ``,
        required: true,
        placeholder: `自定义字段0`
      }
      that.data.customFields.push(custom);
    }
    that.setData({
      formKeys: that.data.formKeys,
      customFields: that.data.customFields
    })
  },
  Date:function(beginDate,endDate){
    var date = beginDate.substring(0, 10); //抢票日期
    var time = beginDate.substring(11, 16); //抢票时间
    var joinDate = endDate.substring(0, 10); //入场日期
    var joinTime = endDate.substring(11, 16); //入场时间
    this.setData({
      date,
      time,
      joinDate,
      joinTime
    })
  },
  onShow: function () {
    let dataJson = wx.getStorageSync('applyfieldeditre')
    if (dataJson != '') {
      let data = JSON.parse(dataJson)
      let inx = parseInt(wx.getStorageSync('applyfieldeditinx'))
      that.data.customFields[inx] = data
      that.setData({
        customFields: that.data.customFields
      })
      wx.removeStorageSync('applyfieldeditinx')
      wx.removeStorageSync('applyfieldeditre')
    }
  },
  setFieldInfo: function (e) {
    if (that.data.customFields[e.currentTarget.dataset.idx].fieldType == ``) {
      $Message({
        content: '请先选择字段类型',
        type: 'warning'
      })
      return
    }
    wx.setStorageSync('applyfieldeditinx', e.currentTarget.dataset.idx)
    wx.setStorageSync('applyfieldedit', JSON.stringify(that.data.customFields[e.currentTarget.dataset.idx]))
    wx.navigateTo({
      url: `/pages/manage/applyfieldedit`
    })
  },
  bindCustomTypeChange: function (e) {
    that.data.customFields[e.currentTarget.dataset.idx].fieldType = that.data.customTypes[parseInt(e.detail.value)].value
    that.data.customFields[e.currentTarget.dataset.idx].key = ''
    delete that.data.customFields[e.currentTarget.dataset.idx].inputType
    delete that.data.customFields[e.currentTarget.dataset.idx].radioList
    delete that.data.customFields[e.currentTarget.dataset.idx].checkList
    switch (parseInt(e.detail.value)) {
      case 0:
        that.data.customFields[e.currentTarget.dataset.idx].inputType = 'text'
        break
      case 1:
        that.data.customFields[e.currentTarget.dataset.idx].radioList = [{ name: '' }]
        break
      case 2:
        that.data.customFields[e.currentTarget.dataset.idx].checkList = [{ name: '' }]
        break
    }
    that.setData({
      customFields: that.data.customFields
    })
  },
  addCustomField: function (e) {
    that.data.customFields.push({
      key: '',
      value: `custom${e.currentTarget.dataset.idx + 1}`,
      fieldType: ``,
      required: true,
      placeholder: `自定义字段${e.currentTarget.dataset.idx + 1}`
    })
    that.setData({
      customFields: that.data.customFields
    })
  },
  minusCustomField: function (e) {
    that.data.customFields.splice(e.currentTarget.dataset.idx, 1)
    that.setData({
      customFields: that.data.customFields
    })
  },
  checkboxChange: function(e) {
    that.data.formKeys.forEach(c => {
      c.checked = false
    })
    e.detail.value.forEach(c => {
      that.data.formKeys[c].checked = true
    })
    that.setData({
      formKeys: that.data.formKeys
    })
  },
  changeInput: function (e) {
    that.data.extraData[e.detail.currentTarget.dataset.key] = e.detail.detail.value
  },
  redeemChange: function (e) {
    that.data.redeemCode = e.detail.value
    that.setData({
      redeemCode: that.data.redeemCode
    })
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
  bindJoinDateChange: function(e) {
    that.data.joinDate = e.detail.value
    that.setData({
      joinDate: that.data.joinDate
    })
  },
  bindJoinTimeChange: function(e) {
    that.data.joinTime = e.detail.value
    that.setData({
      joinTime: that.data.joinTime
    })
  },
  bindTicketChange: function({
    detail
  }) {
    that.setData({
      ticketNumber: detail.value
    })
  },
  upImg: function(e) {
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
          switch (e.currentTarget.dataset.key) {
            case 'ticketImg':
              that.data.extraData.ticketImg = data
              that.setData({
                extraData: that.data.extraData
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
  removeImgInfo: function(e) {
    $Message({
      content: '长按可删除图片',
      type: 'warning'
    })
  },
  removeImg: function(e) {
    switch (e.currentTarget.dataset.inx) {
      case '0':
        that.data.extraData.ticketImg = ''
        that.setData({
          extraData: that.data.extraData
        })
        break
    }
    $Message({
      content: '删除成功'
    })
  },
  tapQuestion: function (e) {
    let inx = parseInt(e.detail)
    that.setData({
      questionUrl: that.data.question[inx].url,
      questionInfo: that.data.question[inx].info,
      questionModal: true
    })
  },
  handleClose: function () {
    that.setData({
      questionModal: false
    })
  },
  submit: function(e) {
    var customData = that.data.customFields.filter(c => c.key.length > 0)
    var formData = that.data.formKeys.filter(c => c.checked)
    var endDate = `${that.data.date} ${that.data.time}:00`
    var joinDate = `${that.data.joinDate} ${that.data.joinTime}:00`
    //处理时间
    if (Math.round(new Date(endDate) / 1000) > Math.round(new Date(joinDate) / 1000)){
      $Message({
        content: '抢票时间不能大于入场时间',
        type: 'warning'
      })
      return
    }
    formData = formData.concat(customData)
    if (formData.length == 0) {
      $Message({
        content: '请至少选择一项报名数据',
        type: 'warning'
      })
      return
    }
    
    for (var key in that.data.extraData) {
      if (that.data.extraData[key].length == 0) {
        $Message({
          content: '请检查必填项目是否输入',
          type: 'warning'
        })
        return
      }
    }
    
    that.data.extraData.join = `${that.data.joinDate} ${that.data.joinTime}:00`
    that.data.extraData.redeemCode = that.data.redeemCode
    if (that.data.redeemCode == '1'){
      formData.push({
        key: '兑换码',
        value: 'key',
        fieldType: 'input',
        required: true,
        placeholder: '请输入兑换码'
      })
    }
    wx.showLoading({
      title: '提交中...',
      mask: true
    })
    if (that.data.formId) {
      _activity.editActivityForm({
        activityId: that.data.activityId,
        type: '2',
        jsonData: JSON.stringify(formData),
        totalTickets: that.data.ticketNumber,
        formId: that.data.formId,
        beginDate: `${that.data.date} ${that.data.time}:00`,
        extraData: JSON.stringify(that.data.extraData)
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
        activityId: that.data.activityId,
        type: '2',
        jsonData: JSON.stringify(formData),
        totalTickets: that.data.ticketNumber,
        beginDate: `${that.data.date} ${that.data.time}:00`,
        extraData: JSON.stringify(that.data.extraData)
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