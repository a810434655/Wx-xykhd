  // pages/manage/lootticket.js
var _activity = require("../../../service/activity.js")
var _user = require("../../../service/user.js")
const { $Message } = require('../../../resources/dist/base/index')
var util = require('../../../utils/util.js')
var app = getApp()
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    studentIden: false,  //学号
    activityId: undefined,
    sceneCode: '',  //二维码
    role: 0,
    lootInfo: undefined,
    ticketModal: false,
    downloadModal: false,  //下载数据
    editModal: false,  //重新编辑
    addTicketModal: false, //追加票数
    deleteUserModal: false,
    email: '',
    addTicketNum: 0,
    ticketUserId: '',
    page: 1,
    size: 20,
    total: 0,
    checked: 0,
    lootDatas:[
    ],
    ticketUserList:[],  //检票员信息
    codeUrl:``,
    jsonData:[], //抢票需要基本信息
    endDate:"",   //截止时间
    beginDate:"", //抢票时间
    remainTickets:"", //票数
    extraData:""  //地点和抢票模式
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    that.data.activityId = options.id
    that.data.role = parseInt(options.role) 
    
    that.setData({
      role: that.data.role,
      email: wx.getStorageSync('email'),
      studentIden: wx.getStorageSync('studentIden')
    })
  },
  onShow: function () {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    that.getTicketUser()
    that.getUserIdentification()

    _activity.getActivityForm({
      activityId: that.data.activityId, type: '2'
    }).then(data => {
      // a1开头活动(添加检票)
      that.data.codeUrl = `https://dreamoncampus.com/dreamact/index/getMiniCode?scene=a1${data.code}&page=pages/home/plaza&width=150`
      that.setData({
        lootInfo: data,
        sceneCode: data.code,
        codeUrl: that.data.codeUrl,
        jsonData:data.jsonData,
        beginDate:data.beginDate,
        endDate:data.endDate,
        extraData:data.extraData,
        remainTickets:data.remainTickets
      })
      that.data.page = 1
      that.getData()
      wx.hideLoading()
    }).catch(errMsg => {
      // wx.navigateBack({})
      wx.hideLoading()
    })
  },
  //认证学生组织
  getUserIdentification: function () {
    _user.getUserIdentification().then(data => {
      data.forEach(e => {
        if (e.type == 1) {
          if (e.status == 2) {
            //设置全局认证通过
            wx.setStorageSync('studentIden', true)
            that.setData({
              studentIden: true
            })
          }
        }
      })
    }).catch(errMsg => {
      setTimeout(function () {
        that.getUserIdentification()
      }, 2000)
    })
  },
  // 获取票号数据
  getData: function () {
    _activity.getActivityFormPage({ page: that.data.page, size: that.data.size, formId: that.data.lootInfo.formId }).then(data => {
      if (that.data.page == 1) {
        that.data.lootDatas.splice(0, that.data.lootDatas.length)
      }
      data.records.forEach(c =>{
        if (c.ctime){
          c.jsonData = JSON.parse(c.jsonData)
          c.ctime = c.ctime.substring(0, 10)
        }
      })
      that.setData({
        checked: data.current,
        total: data.total,
        lootDatas: that.data.lootDatas.concat(data.records)
      })
      wx.stopPullDownRefresh()
      wx.hideLoading()
    }).catch(errMsg => {
      wx.stopPullDownRefresh()
      wx.hideLoading()
    })
  },
  //活动检票员
  getTicketUser: function () {
    _activity.getAllTicketUser({
      activityId: that.data.activityId
    }).then(data => {
      for(var a = data.length; a < 3; a++){
        data.push({})
      }
      that.setData({
        ticketUserList: data
      })

    }).catch(errMsg => {
      // setTimeout(that.getTicketUser(),2000)
    })
  },
  onPullDownRefresh: function () {
    that.data.page = 1
    that.getData()
  },
  onReachBottom: function () {
    that.data.page++
    that.getData()
  },
  showModal: function (e) {
    if (e.currentTarget.dataset.modal == 'downloadModal' && !that.data.studentIden){
      $Message({
        content: `请先进行学生组织认证验证真实性`,
        type: 'warning'
      })
      return
    }
    that.data[e.currentTarget.dataset.modal] = true
    if (that.data.deleteUserModal){
      that.data.ticketUserId = e.currentTarget.dataset.id
    }
    that.setData({
      ticketModal: that.data.ticketModal,
      downloadModal: that.data.downloadModal,
      editModal: that.data.editModal,
      addTicketModal: that.data.addTicketModal,
      deleteUserModal: that.data.deleteUserModal
    })
  },
  changeInput: function (e) {
    that.data[e.detail.currentTarget.dataset.key] = e.detail.detail.value
  },
  changeNumInput: function (e) {
    if (parseInt(e.detail.detail.value) > 0) {
      that.data[e.detail.currentTarget.dataset.key] = parseInt(e.detail.detail.value)
    } else {
      that.data[e.detail.currentTarget.dataset.key] = 0
    }
    that.setData({
      addTicketNum: that.data.addTicketNum
    })
  },
  handleClose: function () {
    if (that.data.ticketModal) {
      that.getTicketUser()
    }
    that.setData({
      ticketModal: false,
      downloadModal: false,
      editModal: false,
      addTicketModal: false,
      deleteUserModal: false
    })
  },

  handleAddTicket: function (e) {
    that.handleClose()
    if(that.data.addTicketNum < 1){
      $Message({
        content: `请至少追加1张票`,
        type: 'warning'
      })
      return
    }
    wx.showLoading({
      title: '追加中...',
      mask: true
    })
    _activity.addTicketNum({
      activityId: that.data.activityId, number: that.data.addTicketNum
    }).then(data => {
      $Message({
        content: '追加成功'
      })
      that.onPullDownRefresh()
      wx.hideLoading()
    }).catch(errMsg => {
      $Message({
        content: errMsg,
        type: 'warning'
      })
      wx.hideLoading()
    })
  },
  handleDeleteUser: function (e) {
    that.handleClose()
    wx.showLoading({
      title: '删除中...',
      mask: true
    })
    console.error(e)
    _activity.deleteTicketUser({
      id: that.data.ticketUserId
    }).then(data => {
      $Message({
        content: `删除成功`
      })
      that.getTicketUser()
      wx.hideLoading()
    }).catch(errMsg => {
      $Message({
        content: errMsg,
        type: 'warning'
      })
      wx.hideLoading()
    })
  },
  handleDownload: function (e) {
    that.handleClose()
    wx.showLoading({
      title: '发送中...',
      mask: true
    })
    if (that.data.email == undefined || that.data.email.length == 0) {
      $Message({
        content: '请输入邮箱地址',
        type: 'warning'
      })
      return
    }
    wx.setStorageSync('email', that.data.email)
    _activity.sendMailFormData({
      activityId: that.data.activityId, email: that.data.email, type: 2
    }).then(data => {
      $Message({
        content: '发送成功'
      })
      wx.hideLoading()
    }).catch(errMsg => {
      $Message({
        content: errMsg,
        type: 'warning'
      })
      wx.hideLoading()
    })
  },
  handleEdit: function (e) {
    that.handleClose()
    wx.navigateTo({
      url: `/pages/manage/lootticketedit?id=${that.data.activityId}&formId=${that.data.lootInfo.formId}&jsonData=${that.data.jsonData}&beginDate=${that.data.beginDate}&endData=${that.data.endDate}&remainTickets=${that.data.remainTickets}&extraData=${that.data.extraData}`
    })
  },
  handleSacn: function (e) {
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res)
        wx.showLoading({
          title: '检票中...',
          mask: true
        })
        var code = res.result
        _activity.putUserApplyForm({
          activityId: that.data.activityId, number: code
        }).then(data => {
          $Message({
            content: '检票成功'
          })
          that.onPullDownRefresh()
          wx.hideLoading()
        }).catch(errMsg => {
          $Message({
            content: errMsg,
            type: 'warning'
          })
          wx.hideLoading()
        })
      },
      fail: (res) => {
        $Message({
          content: `请扫描正确的二维码`,
          type: 'warning'
        })
      }
    })
  }
})