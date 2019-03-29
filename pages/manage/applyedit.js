// pages/manage/applyedit.js
var _activity = require("../../service/activity.js")
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
    activityId: '',  //活动id
    formId: '',
    nowDate: '',     //现在时间
    date: '',        //截止日期
    time: '00:00',   //截止时间
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
        key: '性别',
        value: 'sex',
        fieldType: 'radio',
        required: true,
        radioList: [{
          name: '男',
          value: 1
        }, {
          name: '女',
          value: 2
        }],
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
      },
      {
        key: '生日',
        value: 'college',
        fieldType: 'date',
        required: true,
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
        } ],
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
      },
      {
        key: '特长',
        value: 'speciality',
        fieldType: 'input',
        required: true,
        inputType: 'text',
        placeholder: '请描述你的特长',
        checked: false
      },
      {
        key: '寝室号',
        value: 'room',
        fieldType: 'input',
        required: true,
        inputType: 'text',
        placeholder: '请输入寝室号',
        checked: false
      },
      {
        key: '备注',
        value: 'other',
        fieldType: 'input',
        required: true,
        inputType: 'text',
        placeholder: '请输入备注',
        checked: false
      },
      {
        key: '图片',
        value: 'pic',
        fieldType: 'upImg',
        required: true,
        placeholder: '图片上传描述',
        checked: false
      }
    ],
    customTypes:[
      {
        name: '单行文本',
        value: 'input'
      },
      {
        name: '多行文本',
        value: 'textarea'
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
    ],
    jsonData:[]  //报名规则信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this
    that.data.activityId = options.id
    // 获取现在时间存入data.date
    that.data.nowDate = util.formatDate(new Date())
    that.data.date = that.data.nowDate
    that.setData({
      nowDate: that.data.nowDate,
      date: that.data.date
    })
    // 判断是否为活动第二次登陆 options.formId是活动ID
    console.log(options.endDate)
    if (options.formId) {
      that.cache(JSON.parse(options.formKeys))
      that.setData({
        formId: options.formId,
        time: options.endTime.substring(0,5),
        date:options.endDate
      })
    }
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
  //缓存如果用户是重新编辑的数据
  cache:function(jsonData){
    that.data.customFields=[]
    jsonData.forEach(item=>{
       if(item.value.indexOf("custom")==-1){
         that.data.formKeys.forEach((list,i)=>{
            if(item.key==list.key){
              that.data.formKeys[i] = item
            }
         })
       }else{
         that.data.customFields.push(item)
         console.log(that.data.customFields);
       }
    })
    if (that.data.customFields.length==0){
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
  checkboxChange: function(e) {
    // 循环吧所有checked变为false
    that.data.formKeys.forEach(c => {
      c.checked = false
    })
    // 这里吧点击的变为true
    e.detail.value.forEach(c => {
      that.data.formKeys[c].checked = true
    })
    that.setData({
      formKeys: that.data.formKeys
    })
  },
  bindDateChange: function(e) {
    that.data.date = e.detail.value
    that.setData({
      date: that.data.date
    })
  },
  // 获取截止日期
  bindTimeChange: function (e) {
    that.data.time = e.detail.value
    that.setData({
      time: that.data.time
    })
  },
  // 这里会让表单信息变成你输入的值
  changePicInput: function (e) {
    that.data.formKeys[14].picPlaceholder = e.detail.detail.value
  },
  // 报名表单自定义字段处理
  bindCustomTypeChange: function (e) {
    // 在这里取得用户选择的文本类型
    that.data.customFields[e.currentTarget.dataset.idx].fieldType = that.data.customTypes[parseInt(e.detail.value)].value
    console.log(parseInt(e.detail.value))
    that.data.customFields[e.currentTarget.dataset.idx].key = ''
    delete that.data.customFields[e.currentTarget.dataset.idx].inputType
    delete that.data.customFields[e.currentTarget.dataset.idx].radioList
    delete that.data.customFields[e.currentTarget.dataset.idx].checkList
    switch (parseInt(e.detail.value)){
      case 0:
        that.data.customFields[e.currentTarget.dataset.idx].inputType = 'text'
        break
      case 1:
        that.data.customFields[e.currentTarget.dataset.idx].inputType = 'textarea'
        break
      case 2:
        that.data.customFields[e.currentTarget.dataset.idx].radioList = [{ name: '' }]
        break
      case 3:
        that.data.customFields[e.currentTarget.dataset.idx].checkList = [{ name: '' }]
        break
    }
     that.setData({
       customFields: that.data.customFields
     })
  },
  changeFieldInput: function (e) {
    that.data.customFields[e.currentTarget.dataset.idx].key = e.detail.detail.value
    // that.setData({
    //   customFields: that.data.customFields
    // })
  },
  // 自定义字段输入内容
  setFieldInfo: function(e) {
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
  // 添加新的自定义字段
  addCustomField: function (e) {
    that.data.customFields.push({
      key: '',
      value: `custom${e.currentTarget.dataset.idx+1}`,
      fieldType: ``,
      required: true,
      placeholder: `自定义字段${e.currentTarget.dataset.idx+1}`
    })
    that.setData({
      customFields: that.data.customFields
    })
  },
  // 删除自定义字段
  minusCustomField: function (e) {
    that.data.customFields.splice(e.currentTarget.dataset.idx, 1)
    that.setData({
      customFields: that.data.customFields
    })
  },
  submit: function (e) {
    var customData = that.data.customFields.filter(c => c.key.length > 0)
    // console.error(customData)
    var formData = that.data.formKeys.filter(c => c.checked)
    formData = formData.concat(customData)
    if(formData.length == 0){
      $Message({
        content: '请至少选择一项报名数据',
        type: 'warning'
      })
      return
    }
    wx.showLoading({
      title: '提交中...',
      mask: true
    })
    if(that.data.formId){
      _activity.editActivityForm({
        activityId: that.data.activityId, type: '1', jsonData: JSON.stringify(formData), totalTickets: 0, formId: that.data.formId, endDate: `${that.data.date} ${ that.data.time }:00`
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
    }else {
      _activity.creatActivityForm({
        activityId: that.data.activityId, type: '1', jsonData: JSON.stringify(formData), totalTickets: 0, endDate: `${that.data.date} ${that.data.time }:00`
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