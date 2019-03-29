// pages/my/identification.js
var _upservice = require("../../service/upservice.js")
var _special = require("../../service/special.js")
var _user = require("../../service/user.js")
var _util = require("../../utils/util.js")
const { $Message } = require('../../resources/dist/base/index')
var that
var inter
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    telCode: '',
    getCode: 0,
    studioScaleList: [{
      name: '<10人'
    }, {
      name: '10-30人'
    }, {
      name: '30-50人'
    }, {
      name: '50-150人'
    }, {
      name: '150-250人'
    }, {
      name: '>250人'
    }],
    studioClassList: [{
      name: '2018'
    }, {
      name: '2017'
    }, {
      name: '2016'
    }, {
      name: '2015'
    }, {
      name: '研究生及以上'
    }, {
      name: '其他'
    }],
    mediaPlatformList: [{
      name: '微信公众号'
    }, {
      name: '抖音'
    }, {
      name: '快手'
    }, {
      name: '微博'
    }, {
      name: '其他图文平台'
    }, {
      name: '其他视频平台'
    }, {
      name: '多平台'
    }],
    mediaContentList: [{
      name: '搞笑类'
    }, {
      name: '文学类'
    }, {
      name: '时事评论类'
    }, {
      name: '餐饮美食类'
    }, {
      name: '社会新闻类'
    }, {
      name: '教育培训类'
    }, {
      name: '艺术文化类'
    }, {
      name: '美妆时尚类'
    }, {
      name: '情感类'
    }, {
      name: '军事历史类'
    }, {
      name: '娱乐新闻类'
    }, {
      name: '体育类'
    }, {
      name: '其他'
    }],
    imgList: [],
    identInfo: {
      name: '',
      wechatNumber: '',
      phone: ''
    },
    studentInfo: {
      schoolName: '',
      schoolGroup: '',
      schoolPosition: '',
      schoolGroupScale: '',
      schoolClass: '',
    },
    mediaInfo: {
      schoolName: '',
      mediaPlatform: '',
      mediaContent: '',
      mediaName: ''
    },
    agreePrivacyPolicy: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    that.setData({
      id: options.id
    })
    wx.setNavigationBarTitle({
      title: options.title
    })
  },
  onShow: function () {
    let schoolInfo = wx.getStorageSync('studentSchoolInfo')
    // console.error(schoolInfo)
    if (schoolInfo.name) {
      that.data.studentInfo.schoolName = schoolInfo.name
      //我的学校
      that.setData({
        studentInfo: that.data.studentInfo
      })
    }
    wx.removeStorageSync('studentSchoolInfo')
  },
  changeInput: function (e) {
    that.data.identInfo[e.detail.currentTarget.dataset.key] = e.detail.detail.value
  },
  changeCodeInput: function (e) {
    that.data.telCode = e.detail.detail.value
  },
  changeStudent: function (e) {
    that.data.studentInfo[e.detail.currentTarget.dataset.key] = e.detail.detail.value
  },
  changeMedia: function (e) {
    that.data.mediaInfo[e.detail.currentTarget.dataset.key] = e.detail.detail.value
  },
  bindScaleListChange: function (e) {
    that.data.studentInfo.schoolGroupScale = that.data.studioScaleList[e.detail.value].name
    that.setData({
      studentInfo: that.data.studentInfo
    })
  },
  bindClassChange: function (e) {
    that.data.studentInfo.schoolClass = that.data.studioClassList[e.detail.value].name
    that.setData({
      studentInfo: that.data.studentInfo
    })
  },
  bindPlatformListChange: function (e) {
    that.data.mediaInfo.mediaPlatform = that.data.mediaPlatformList[e.detail.value].name
    that.setData({
      mediaInfo: that.data.mediaInfo
    })
  },
  selectSchool: function (e) {
    wx.navigateTo({
      url: `/pages/ui/selectpage?type=1`
    })
  },
  bindContentChange: function (e) {
    that.data.mediaInfo.mediaContent = that.data.mediaContentList[e.detail.value].name
    that.setData({
      mediaInfo: that.data.mediaInfo
    })
  },
  upImg: function (e) {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.error('res', res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        _upservice.upImg({ filePath: tempFilePaths[0] }).then(data => {
          that.data.imgList.push({ url: data })
          that.setData({
            imgList: that.data.imgList
          })
        }).catch(errMsg => {
          console.error(errMsg)
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
    console.error('long', e)
    that.data.imgList.splice(e.currentTarget.dataset.inx, e.currentTarget.dataset.inx + 1)
    that.setData({
      imgList: that.data.imgList
    })
    $Message({
      content: '删除成功'
    })
  },
  getTelCode: function (e) {
    if (!_util.checkMobile(that.data.identInfo[`phone`])){
      $Message({
        content: `请验证手机号是否正确`,
        type: 'warning'
      })
      return
    }
    _special.getPhoneCode({ phone: that.data.identInfo[`phone`], type: 0 }).then(data => {
      $Message({
        content: `验证码已发送`
      })
      that.data.getCode = 60
      that.sendCodeSussesc()
      inter = setInterval(that.sendCodeSussesc, 1000)
    }).catch(errMsg => {
      $Message({
        content: errMsg,
        type: 'warning'
      })
    })
  },
  sendCodeSussesc: function (){
    if (that.data.getCode > 0){
      that.data.getCode--
      if (that.data.getCode == 0) {
        clearInterval(inter)
      }
      that.setData({
        getCode: that.data.getCode
      })
    }
  },
  checkboxChange: function (e) {
    that.data.agreePrivacyPolicy = e.detail.value.length>0
  },
  openH5Page: function (e) {
    wx.navigateTo({
      url: `/pages/ui/webview?url=${e.currentTarget.dataset.url}`
    })
  },
  submit: function (e) {
    if (!that.data.agreePrivacyPolicy) {
      $Message({
        content: '请确认同意隐私保护政策',
        type: 'warning'
      })
      return
    }
    var formId = e.detail.formId
    for (var key in that.data.identInfo) {
      if (that.data.id == 3 && key == 'wechatNumber'){
        continue
      }
      if (that.data.identInfo[key] == undefined || that.data.identInfo[key].length == 0) {
        $Message({
          content: '请检查必填项目是否已经输入',
          type: 'warning'
        })
        return
      }
    }
    // console.error(that.data.id, that.data.id == 1, that.data.id===1)
    if (that.data.id == 1) {
      that.data.identInfo.jsonData = JSON.stringify(that.data.studentInfo)
      that.data.identInfo.type = 1
      for (var key in that.data.studentInfo) {
        if (that.data.studentInfo[key] == undefined || that.data.studentInfo[key].length == 0) {
          $Message({
            content: '请检查学生组织信息认证信息是否正确',
            type: 'warning'
          })
          return
        }
      }
    } else if (that.data.id == 2) {
      that.data.identInfo.jsonData = JSON.stringify(that.data.mediaInfo)
      that.data.identInfo.type = 2
      for (var key in that.data.mediaInfo) {
        if (that.data.mediaInfo[key] == undefined || that.data.mediaInfo[key].length == 0) {
          $Message({
            content: '请检查自媒体认证信息是否正确',
            type: 'warning'
          })
          return
        }
      }
    } else if (that.data.id == 3) {
      delete that.data.studentInfo.schoolGroup
      delete that.data.studentInfo.schoolPosition
      delete that.data.studentInfo.schoolGroupScale
      that.data.identInfo.jsonData = JSON.stringify(that.data.studentInfo)
      that.data.identInfo.type = 3
      for (var key in that.data.studentInfo) {
        if (that.data.studentInfo[key] == undefined || that.data.studentInfo[key].length == 0) {
          $Message({
            content: '请检查在校学生认证信息是否正确',
            type: 'warning'
          })
          return
        }
      }
    }
    that.data.identInfo.resources = JSON.stringify(that.data.imgList)
    if (that.data.imgList.length == 0) {
      $Message({
        content: '请至少上传一项身份资料图片',
        type: 'warning'
      })
      return
    }
    wx.showLoading({
      title: '提交中...',
      mask: true
    })
    that.data.identInfo.formId = formId
    that.data.identInfo.code = that.data.telCode
    _user.putUserIdentification(that.data.identInfo).then(data => {
      app.toStatePage({
        state: 1,
        title: '认证成功',
        info: '提交成功，请等待管理员审核',
        content: '您的认证信息已提交，我们会在一个工作日内完成审核，届时认证图标将会点亮'
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