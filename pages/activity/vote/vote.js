// pages/activity/vote.js
var _activity = require("../../../service/activity.js")
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
    formId: '',
    themeId: 0,
    formInfo: {},
    formData: [],
    extraData:"",
    title: '',
    beginDate: '',
    endDate: '',
    endText:"",
    id:"",
    voteflag: false,
    content: "",
    userVoteNumber: "",
    themeList: [{
      buttonTheme: 'theme1',
      color: '#ffbf00',
      pic: "https://oss.dreamoncampus.com//file/img/theme1@2x.png"
    },
    {
      buttonTheme: 'theme2',
      color: '#ff4c39',
      pic: "https://oss.dreamoncampus.com//file/img/theme2@2x.png"
    },
    {
      buttonTheme: 'theme3',
      color: '#1dd89c',
      pic: "https://oss.dreamoncampus.com//file/img/theme3@2x.png"
    },
    {
      buttonTheme: 'theme4',
      color: '#21a3f6',
      pic: "https://oss.dreamoncampus.com//file/img/theme4@2x.png"
    },
    {
      buttonTheme: 'theme5',
      color: '#252436',
      pic: "https://oss.dreamoncampus.com//file/img/theme5@2x.png"
    }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    console.log(options)
    that.setData({
      title: options.title,
      beginDate: options.beginDate,
      endDate: options.endDate,
      themeId: parseInt(options.theme),
      formId: options.formId,
      vote:options.vote,
     
      
    })
  },
  onShow: function(){
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    _activity.getActivityForm({
      formId:that.data.formId
    }).then(data => {
      console.log(data)
      that.setData({
        userVoteNumber: data.userVoteNumber
      })
      data.form.jsonData = JSON.parse(data.form.jsonData)
      data.form.extraData = JSON.parse(data.form.extraData)
      // data.endTime=data
      if (data.form.extraData.optionId){
        let selectItem = data.form.extraData.optionId.split(',')
        // console.log(selectItem)
        data.form.jsonData.forEach(c => {
          selectItem.some(d => {
            if (c.id == d){c.checked = true}
            return c.id == d
          })
        })
      }
      // 转换截止时间
      that.data.endText = new Date(data.form.endDate).getFullYear() + '-' + (parseInt(new Date(data.form.endDate).getMonth()) + 1) + '-' + new Date(data.form.endDate).getDate() + ' ' + new Date(data.form.endDate).getHours() + ':' + new Date(data.form.endDate).getMinutes()
      that.setData({
        formInfo: data.form,
        formData: data.form.jsonData,
        endText: that.data.endText,
      })
      that.data.formInfo.extraData.voteType == "0" ? wx.setNavigationBarTitle({ title: "投票" }) : wx.setNavigationBarTitle({ title: "现场投票" })
      wx.hideLoading()
    }).catch(e => {
      console.error(e)
      wx.navigateBack({})
      wx.hideLoading()
    })
  },
  selectItem: function (e) {
    // console.log(e)
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
  previewImg:function(e){
    // console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index;
    var imgArr=[]
    this.data.formData.forEach(item=>{
      if(item.pic!=''){
        imgArr.push(item.pic)
      }else{
        imgArr.push("/resources/image/ic_banner_loading.png")
      }
    })
    // console.log(imgArr)
    wx.previewImage({
      current: imgArr[index],     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function (res) {
        console.log("预览")
       },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  submit: function (e) {
    formId = e.detail.formId
    let checkedData = that.data.formData.filter(c => c.checked)
    // console.log(checkedData)

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
    // console.log(selectStr)
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
    }).catch(e => {
      wx.hideLoading()
      $Message({
        content: e.message,
        type: 'warning'
      })
    })
  },
  voteF:function(e){
    that.setData({
      voteflag:true,
      content: e.currentTarget.dataset.content,
      id: e.currentTarget.dataset.id
    })
  },
  voteQ:function(){
    that.setData({
      voteflag: false,
    })
  },
  voteYes:function(){
    that.setData({
      voteflag: false,
    })
    _activity.castVote(that.data.id, that.data.formInfo.formId)
    .then(res =>{
      if(res == "投票成功"){
        that.data.formData[that.data.id].num = that.data.formData[that.data.id].num + 1
        that.setData({
          userVoteNumber: that.data.userVoteNumber-1,
          formData: that.data.formData
        })
      }
    })
    .catch(e =>{
      console.log(e)
    })
  }
})