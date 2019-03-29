// pages/manage/edit.js
var _activityclassify = require("../../data/activityclassify.js")
var _upservice = require("../../service/upservice.js")
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
    activityId: undefined,
    defaultActivityJson: '{"name":"歌手大赛（示例活动）","content":"img~https://oss.dreamoncampus.com/img/1539251921177_QpiE6.jpg","address":"聚芒校园大礼堂","organizer":"聚芒校园","beginDate":"2019-03-01","endDate":"2019-07-01","areaId":22,"notice":"报名截止日期：9月24日 请尽快报名哦","posterData":"http://pc5h1qatj.bkt.clouddn.com/img/1537335954381_OrgHn.jpg","shareLink":"https://oss.dreamoncampus.com/img/1537335962004_mJfbU.jpg","type":13,"theme":4,"timeLine":[{\"date\":\"2019-02-18\",\"type\":\"date\",\"info\":\"海选报名\"},{\"date\":\"2019-03-06\",\"type\":\"date\",\"info\":\"海选开始\"},{\"date\":\"2019-03-16\",\"type\":\"date\",\"info\":\"海选结束\"},{\"date\":\"2019-03-22\",\"type\":\"date\",\"info\":\"100进60\"},{\"date\":\"2019-03-26\",\"type\":\"date\",\"info\":\"60进20\"},{\"date\":\"2019-04-01\",\"type\":\"date\",\"info\":\"20进10\"},{\"date\":\"2019-04-10\",\"type\":\"date\",\"info\":\"十佳歌手决赛（晚会）\"},{\"date\":\"17:00\",\"type\":\"time\",\"info\":\"入场\"},{\"date\":\"17:30\",\"type\":\"time\",\"info\":\"晚会开始\"},{\"date\":\"17:36\",\"type\":\"time\",\"info\":\"一号选手-火烧的寂寞\"},{\"date\":\"17:45\",\"type\":\"time\",\"info\":\"二号选手-平凡的一天\"},{\"date\":\"17:58\",\"type\":\"time\",\"info\":\"三号选手-Never Enough\"}],"bannerData":[\"https://oss.dreamoncampus.com/img/1537336473073_xRgDp.jpg\",\"https://oss.dreamoncampus.com/img/1537337392814_J4sab.jpg\"]}',
    contentType: 0,
    contentImg: '',
    questionModal: false,
    questionUrl: '',
    questionInfo: '',
    question: [{
        url: 'http://www.dreamoncampus.com/file/img/ic_question_banner.png',
        info: '该图片将用于活动微官网页面顶部进行轮播'
      },
      {
        url: 'http://www.dreamoncampus.com/file/img/ic_question_posters.png',
        info: '该图片将用于活动列表缩略图以及分享宣传图'
      },
      {
        url: 'http://www.dreamoncampus.com/file/img/ic_question_share.png',
        info: `将图片用于分享链接中
      建议添加如图【戳此进入】按钮
      不添加该图片将使用活动页面截图进行分享`
      }
    ],
    nowDate: '',
    activityclassifyList: _activityclassify,
    timelineType: 'date',
    timeLine: [{
      date: '',
      type: 'date',
      info: '活动启动'
    }],
    bannerData: [],
    activityInfo: {
      address: '',
      bannerData: '',
      beginDate: '',
      content: '',
      endDate: '',
      name: '',
      notice: '',
      organizer: '',
      shareLink: '',
      timeLine: '',
      theme: '0',
      type: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this
    that.data.nowDate = util.formatDate(new Date())
    that.data.activityInfo.beginDate = that.data.nowDate
    that.data.activityInfo.endDate = that.data.nowDate
    that.data.timeLine[0].date = that.data.nowDate
    that.setData({
      nowDate: that.data.nowDate,
      activityInfo: that.data.activityInfo,
      timeLine: that.data.timeLine
    })
    if (options.id != 'undefined') {
      that.data.activityId = options.id
      that.getData(options.id)
      wx.setNavigationBarTitle({
        title: '活动编辑'
      })
    } else {
      wx.setNavigationBarTitle({
        title: '创建活动'
      })
    }
  },
  getData: function(id) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    _activity.getActivityById({
      id: id
    }).then(data => {
      var timeLine = JSON.parse(data.timeLine)
      if (timeLine.length != 0) {
        data.timeLine = timeLine
        that.setData({
          timeLine: data.timeLine
        })
      }
      data.bannerData = JSON.parse(data.bannerData)
      delete data.realname
      delete data.logicDelete
      delete data.remark
      delete data.phone
      delete data.viewNumber
      delete data.dataNumber
      delete data.status
      if (data.content.indexOf("img~") == 0) {
        that.setData({
          contentType: 1,
          contentImg: data.content.substr(4)
        })
        data.content = ''
      }
      that.setData({
        bannerData: data.bannerData,
        activityInfo: data
      })
      wx.hideLoading()
    }).catch(errMsg => {
      // wx.navigateBack({})
      wx.hideLoading()
    })
  },
  defaultActivity: function (e) {
    let data = JSON.parse(that.data.defaultActivityJson)
    if (data.timeLine.length != 0) {
      that.setData({
        timeLine: data.timeLine
      })
    }
    if (data.content.indexOf("img~") == 0) {
      that.setData({
        contentType: 1,
        contentImg: data.content.substr(4)
      })
      data.content = ''
    }
    that.setData({
      bannerData: data.bannerData,
      activityInfo: data
    })
  },
  tapQuestion: function(e) {
    console.error(e)
    let inx = parseInt(e.detail)
    that.setData({
      questionUrl: that.data.question[inx].url,
      questionInfo: that.data.question[inx].info,
      questionModal: true
    })
  },
  handleClose: function() {
    that.setData({
      questionModal: false
    })
  },
  changeInput: function(e) {
    that.data.activityInfo[e.detail.currentTarget.dataset.key] = e.detail.detail.value
  },
  radioContentChange: function(e) {
    that.setData({
      contentType: e.detail.value
    })
  },
  radioTimelineChange: function(e) {
    that.data.timelineType = e.detail.value
  },
  // radioJoinChange: function (e) {
  //   that.data.activityInfo[`join`] = e.detail.value
  // },
  radioThemeChange: function(e) {
    that.data.activityInfo['theme'] = parseInt(e.detail.value)
  },
  bindDateChange: function(e) {
    that.data.activityInfo[e.currentTarget.dataset.key] = e.detail.value
    that.setData({
      activityInfo: that.data.activityInfo
    })
  },
  bindActivityClassify: function(e) {
    that.data.activityInfo.type = e.detail.value
    that.setData({
      activityInfo: that.data.activityInfo
    })
  },
  addTimeLine: function(e) {
    that.data.timeLine.push({
      date: that.data.timelineType == 'date' ? that.data.nowDate : '00:00',
      type: that.data.timelineType,
      info: ''
    })
    that.setData({
      timeLine: that.data.timeLine
    })
  },
  minusTimeLine: function(e) {
    that.data.timeLine.splice(e.currentTarget.dataset.idx, 1)
    that.setData({
      timeLine: that.data.timeLine
    })
  },
  bindTimeLineChange: function(e) {
    that.data.timeLine[e.currentTarget.dataset.idx].date = e.detail.value
    that.setData({
      timeLine: that.data.timeLine
    })
  },
  changeTimeLineInput: function(e) {
    that.data.timeLine[e.detail.currentTarget.dataset.key].info = e.detail.detail.value
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
            case 'banner':
              that.data.bannerData.push(data)
              that.setData({
                bannerData: that.data.bannerData
              })
              break
              // case 'posterData':
              //   that.data.activityInfo.posterData = data
              //   that.setData({
              //     activityInfo: that.data.activityInfo
              //   })
              //   break
            case 'shareLink':
              that.data.activityInfo.shareLink = data
              that.setData({
                activityInfo: that.data.activityInfo
              })
              break
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
  removeImgInfo: function(e) {
    $Message({
      content: '长按可删除图片',
      type: 'warning'
    })
  },
  removeImg: function(e) {
    switch (e.currentTarget.dataset.inx) {
      // case '5':
      //   that.data.activityInfo.posterData = ''
      //   that.setData({
      //     activityInfo: that.data.activityInfo
      //   })
      //   break
      case '6':
        that.data.activityInfo.shareLink = ''
        that.setData({
          activityInfo: that.data.activityInfo
        })
        break
      case '7':
        that.setData({
          contentImg: ''
        })
        break
      default:
        that.data.bannerData.splice(e.currentTarget.dataset.inx, e.currentTarget.dataset.inx + 1)
        that.setData({
          bannerData: that.data.bannerData
        })
    }
    $Message({
      content: '删除成功'
    })
  },
  creatActivity: function(e) {
    // console.error(that.data.contentType == '1', that.data.contentImg == '')
    // if (that.data.contentType == '1' && that.data.contentImg == '') {
    //   $Message({
    //     content: '请检查活动详情图片是否上传',
    //     type: 'warning'
    //   })
    //   return
    // }

    // return
    that.data.activityInfo.timeLine = JSON.stringify(that.data.timeLine.filter(e => e.info.length > 0))
    if (that.data.timeLine < 1 || that.data.timeLine[0].type != 'date') {
      $Message({
        content: '日程不能为空且第一条日程必须为日期',
        type: 'warning'
      })
      return
    }
    that.data.activityInfo.bannerData = JSON.stringify(that.data.bannerData)
    if (that.data.contentType == '1' && that.data.contentImg == '') {
      $Message({
        content: '请检查活动详情图片是否上传',
        type: 'warning'
      })
      return
    }
    for (var key in that.data.activityInfo) {
      if (!(key == 'address' || key == 'notice') && (that.data.activityInfo[key] == undefined || that.data.activityInfo[key].length == 0)) {
        if (key == 'content' && that.data.contentType == '1') {
          break
        }
        // console.error(key, that.data.activityInfo[key])
        $Message({
          content: '请检查必填项目是否已经输入',
          type: 'warning'
        })
        return
      }
    }
    if (that.data.activityId == undefined) {
      wx.showLoading({
        title: '活动创建中...',
        mask: true
      })
      let activityInfo = that.data.activityInfo
      if (that.data.contentType == '1') {
        activityInfo.content = `img~${that.data.contentImg}`
      }
      _activity.creatActivity(activityInfo).then(data => {
        app.toStatePage({
          state: 3,
          title: '活动创建',
          info: '活动创建成功',
          content: '活动创建成功，快去分享吧！'
        })
        wx.hideLoading()
      }).catch(errMsg => {
        $Message({
          content: errMsg,
          type: 'warning'
        })
        wx.hideLoading()
      })
    } else {
      wx.showLoading({
        title: '活动保存中...',
        mask: true
      })
      let activityInfo = that.data.activityInfo
      activityInfo.activityId = that.data.activityId
      if (that.data.contentType == '1') {
        activityInfo.content = `img~${that.data.contentImg}`
      }
      _activity.editActivity(activityInfo).then(data => {
        app.toStatePage({
          state: 3,
          title: '活动编辑',
          info: '活动编辑成功',
          content: '活动编辑成功，快去分享吧！'
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
    console.error(that.data.activityInfo)
  }
})