// pages/activity/info.jshandleInputFocus
var _activity = require("../../../service/activity.js")
var _activityTemp = require("../../../service/temp.js")
var _comment = require("../../../service/comment.js")
var _canvas = require("../../../utils/canvas.js")
var _user = require("../../../service/user.js")
var _params = require("../../../utils/params.js")
var URL = require("../../../config/config.js")
var _date = require("../../../utils/date.js")
const {
  $Message
} = require('../../../resources/dist/base/index')
var app = getApp()
var that
Page({
  /**
   * 页面的初始数据
   */
  data: {
    notice: '',
    like: {
      url: 'https://oss.dreamoncampus.com/img/noPrize.png'
    },
    // 分享模块
    shareImg: '',
    shareModel: false,
    shareSheetShow: false,
    shareSheet: [{
      name: '分享到朋友圈'
    },
    {
      name: '分享给好友',
      openType: 'share'
    }
    ],
    interval: {},
    activityId: '',
    contentType: 0,
    contentImg: '',
    tempActivity: {},
    activityInfo: {},
    apply: 0, //报名计时
    ticket: 0, //抢票计时
    vote: 0, //投票计时
    prize: 0, //抽奖计时
    span: 0,
    userList: "",
    actionable: false, //用户是否有管理操作权限
    tabId: 0,
    animationX: 0,
    animationData: {},
    collect: false,
    comment: '',
    replyInfo: {},
    commentList: [],
    page: 1,
    size: 10,
    userModal: false,//模态框
    voteType: 1,  //投票类型
    ticketType: 0,  //取票类型
    voteStatus: "",
    formList: [],
    userListFlag: false,
    prizeFormId: "",
    prize: 0,
    userInfo: {
      nickName: "",
      avatarUrl: ""
    },
    collectType: false,
    canvas: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    that.animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    if (wx.getStorageSync("activityId")) {
      wx.removeStorageSync("activityId")
    }
    // console.log(options.id)

    if (options.id) {
      that.data.activityId = options.id
    } else {
      let url = decodeURIComponent(options.q)
      if (url) {
        let index = url.indexOf("=")
        that.data.activityId = url.substring(index + 1)
      } else {
        wx.switchTab({
          url: '/pages/home/plaza/plaza'
        })
      }
    }
    // wx.showLoading({
    //   title: '加载中...',
    //   mask: true
    // })
    // 获取用户信息
    // console.error('1')
    // // //首页数据
    if (wx.getStorageSync('userId')) {
      let phone = wx.getStorageSync("phone")
      let uuid = wx.getStorageSync("uuid")
      app.toUserLogin("", phone, 4, uuid)
        .then(res => {
          app.getSchoolId()
            .then(res => {
              if (res.status == 200) {
                that.getActivityInfo()
                app.getUser()
              }
            })
            .catch(e => {
              $Message({
                content: e.message,
                type: 'warning'
              })
            })
        })
        .catch(e => {
          $Message({
            content: e.message,
            type: 'warning'
          })
        })
    } else {
      that.getActivityInfo()
    }
  },
  fixActivityInfo: function () {
    _activity.getUserActivityById({
      activityId: that.data.activityId
    }).then(data => { }).catch(e => {
      // console.log(errMsg)
      wx.navigateBack({})
      setTimeout(function () {
        that.fixActivityInfo()
      }, 3000)
      wx.hideLoading()
    })
  },
  // 现场投票false Modal
  handleUserModal: function (e) {
    that.setData({
      userModal: false,
    })
  },
  getActivityInfo: function () {
    // console.log(that.data.activityId);
    if (!that.data.activityId) {
      return false
    }
    let data
    if (wx.getStorageSync("userId")) {
      data = {
        activityId: that.data.activityId,
        userId: wx.getStorageSync('userId')
      }
      that.setData({
        collectType: true
      })
    } else {
      data = {
        activityId: that.data.activityId,
      }
    }
    var header = { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' }
    //网络请求
    wx.request({
      url: URL.dreamActServer + '/index/activity/selectById' + _params.getParams(data),
      // data: getData,
      method: 'GET',
      header: header,
      success: function (res) {
        // console.log(res)
        // console.error('GET', url + _params.getParams(getData), getData, res)
        //服务器返回数据
        if (res.data.status == 200) {
          // console.log(res)
          let data = res.data.data.activity
          let formList = res.data.data.formList
          data.bannerData = JSON.parse(data.bannerData)
          data.timeLine = JSON.parse(data.timeLine)
          wx.setNavigationBarTitle({
            title: data.name,
          })
          // data.ticket = data.ticket-60*1000e*20
          if (data.content.indexOf("img~") == 0) {
            that.setData({
              contentType: 1,
              contentImg: data.content.substr(4)
            })
          }
          res.data.data.activity.beginDate = _date.newDateH(res.data.data.activity.beginDate)
          res.data.data.activity.endDate = _date.newDateH(res.data.data.activity.endDate)
          // console.error('sss', data.fightValue, data.fightValue != undefined)
          if (data.fightValue != undefined) {
            that.data.tempActivity['area'] = data.area
            that.data.tempActivity['fightValue'] = data.fightValue
            that.setData({
              tempActivity: that.data.tempActivity
            })
          }
          let _span = 0
          if (formList.length != 0) {
            formList.forEach((item, key) => {
              if (item.type == 1 || item.type == 2 || item.type == 3) {
                _span++
                that.data.formList.push(item)
              } else if (item.type == 4) {
                that.setData({
                  prizeFormId: item.formId,
                  prize: 1
                })
              }
              item.timeDate = new Date().getTime()
              that.endTime()
            })
          }

          // apply: 0, //报名计时
          //   ticket: 0, //抢票计时
          //     vote: 0, //投票计时
          //       prize: 0, //抽奖计时

          if (_span != 0) _span = 24 / _span

          if (res.data.data.collect) {
            that.data.collect = res.data.data.collect
          }
          if (res.data.data.actionable) {
            that.data.actionable = res.data.data.actionable
          }
          that.setData({
            span: _span,
            formList: formList,
            activityInfo: data,
            collect: that.data.collect,
            actionable: that.data.actionable,
            userList: res.data.data
          })

          if (data.ticket > 0) {
            that.startLootTicket()
          }
          wx.hideLoading()
        }
        else if (res.data.status == 40101) {
          $Message({ content: res.data.message })
          wx.navigateTo({
            url: '/pages/login',
          })

        } else {
          wx.switchTab({
            url: '/pages/home/plaza/plaza'
          })
          //返回错误提示信息
          $Message({ content: res.data.message })
        }
      },
      error: function (e) {
        $Message({ content: res.data.message })
      }
    })
    that.getCommentData()
  },
  selectTab: function (e) {
    that.animation.translateX(e.target.offsetLeft).scaleX(1).step()
    that.setData({
      animationX: e.target.offsetLeft,
      animationData: that.animation.export(),
      tabId: e.currentTarget.dataset.id
    })
  },
  changeInput: function (e) {
    that.data[e.detail.currentTarget.dataset.key] = e.detail.detail.value
  },
  // 获取留言
  getCommentData: function () {
    var header = { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' }
    let data = {
      page: that.data.page,
      size: that.data.size,
      activityId: that.data.activityId
    }
    //网络请求
    wx.request({
      url: URL.dreamActServer + '/index/comment/selectPage' + _params.getParams(data),
      method: 'GET',
      header: header,
      success: function (res) {
        if (that.data.page == 1) {
          that.data.commentList.splice(0, that.data.commentList.length)
        }
        res.data.data.records.forEach(c => {
          let time = new Date(c.ctime);
          let Y, M, D, h, m, s
          Y = time.getFullYear() + '-';
          M = (time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1) + '-';
          D = time.getDate() + ' ';
          h = (time.getHours() < 10 ? '0' + time.getHours() : time.getHours()) + ':';
          m = (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()) + ':';
          s = (time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds());
          c.ctime = Y + M + D + h + m + s
        })
        that.setData({
          commentList: that.data.commentList.concat(res.data.data.records)
        })
      },
      error: function (e) {
        console.log(e)

      }
    })
  },
  onReachBottom: function () {
    if (that.data.tabId == 2) {
      that.data.page++
      that.getCommentData()
    }
  },
  shareHandler: function () {
    that.setData({
      shareSheetShow: true
    })
  },
  shareSheetHandler: function (e) {
    that.closeHandler()
    if (e.detail.index == 0) {
      that.setData({
        shareModel: true
      })
      that.drawSharePic()
    }
  },
  closeHandler: function () {
    that.setData({
      shareSheetShow: false,
      shareModel: false,
      canvas: true
    })
  },
  navigateTo: function () {
    wx.setStorageSync("activityId", that.data.activityId)
    wx.navigateTo({
      url: "/pages/login",
    })
  },
  drawSharePic: function () {
    if (that.data.shareImg.length > 0) {
      return
    }
    wx.showLoading({
      title: '正在绘制...',
      mask: true
    })
    that.setData({
      canvas: false
    })
    const ctx = wx.createCanvasContext('share')
    ctx.save()
    //上 蓝色
    ctx.beginPath(0)
    //左上角圆弧，弧度从PI到3/2PI 
    ctx.arc(20, 20, 20, Math.PI, Math.PI * 3 / 2)
    //上边线  
    ctx.lineTo(590 - 20, 0)
    //右上角圆弧  
    ctx.arc(590 - 20, 20, 20, Math.PI * 3 / 2, Math.PI * 2)
    //右边线  
    ctx.lineTo(590, 770)
    //下边线
    ctx.lineTo(0, 770)
    //左边线
    ctx.lineTo(0, 0)
    ctx.closePath()
    ctx.setFillStyle('#5a90ff')
    ctx.fill()
    //原点位移
    ctx.translate(0, 770)
    //下 白色
    ctx.beginPath(0)
    //上边线  
    ctx.lineTo(590, 0)
    //右边线  
    ctx.lineTo(590, 210 - 20)
    //右下角圆弧
    ctx.arc(590 - 20, 210 - 20, 20, 0, Math.PI / 2)
    //下边线
    ctx.lineTo(0, 210)
    //左下角圆弧  
    ctx.arc(20, 210 - 20, 20, Math.PI / 2, Math.PI)
    //左边线
    ctx.lineTo(0, 0)
    ctx.closePath()
    ctx.setFillStyle('#ffffff')
    ctx.fill()
    //复位
    ctx.restore()
    ctx.save()
    //原点位移
    ctx.translate(45, 40)
    _canvas.drawRoundRectPath(ctx, 500, 680, 10)
    ctx.setFillStyle('#ffffff')
    ctx.fill()
    //复位
    ctx.restore()
    ctx.save()
    //标题绘制
    ctx.setFillStyle('#051c33')
    ctx.setTextAlign('center')
    ctx.font = 'bold 38px SourceHanSansCN'
    const metrics = ctx.measureText(that.data.activityInfo.name)
    if (metrics.width > 420) {
      ctx.font = 'bold 30px SourceHanSansCN'
      ctx.fillText(that.data.activityInfo.name.substr(0, 11), 295, 483)
      ctx.fillText(that.data.activityInfo.name.substr(11, that.data.activityInfo.name.length), 295, 516)
    } else {
      ctx.fillText(that.data.activityInfo.name, 295, 483)
    }
    //底部文字绘制
    ctx.setFillStyle('#313e51')
    ctx.setTextAlign('left')
    ctx.font = 'bold 24px SourceHanSansCN-Regular'
    ctx.fillText(`长按识别小程序`, 225, 855)
    ctx.fillText(`查看活动详情`, 225, 900)


    //标签绘制
    const tag = []
    if (that.data.ticket < 0) {
      tag.push({
        color: 'rgb(255,203,18)',
        name: '正在抢票'
      })
    } else if (that.data.apply > 0) {
      tag.push({
        color: 'rgb(0,168,255)',
        name: '正在报名'
      })
    } else if (that.data.prize != 0) {
      tag.push({
        color: 'rgb(255,109,85)',
        name: '正在抽奖'
      })
    }
    switch (tag.length) {
      case 1:
        //复位
        ctx.restore()
        ctx.save()
        //中间标签绘制
        ctx.translate(235, 540)
        _canvas.drawRoundRectPath(ctx, 120, 48, 24)
        ctx.setFillStyle(tag[0].color)
        ctx.fill()
        //文字绘制
        ctx.setFillStyle('#FFFFFF')
        ctx.setTextAlign('center')
        ctx.font = 'bold 22px SourceHanSansCN'
        ctx.fillText(tag[0].name, 60, 32)
        break
      case 2:
        //复位
        ctx.restore()
        ctx.save()
        //左边标签绘制
        ctx.translate(160, 540)
        _canvas.drawRoundRectPath(ctx, 120, 48, 24)
        ctx.setFillStyle(tag[0].color)
        ctx.fill()
        //文字绘制
        ctx.setFillStyle('#FFFFFF')
        ctx.setTextAlign('center')
        ctx.font = 'bold 22px SourceHanSansCN'
        ctx.fillText(tag[0].name, 60, 32)
        //复位
        ctx.restore()
        ctx.save()
        //左边标签绘制
        ctx.translate(310, 540)
        _canvas.drawRoundRectPath(ctx, 120, 48, 24)
        ctx.setFillStyle(tag[1].color)
        ctx.fill()
        //文字绘制
        ctx.setFillStyle('#FFFFFF')
        ctx.setTextAlign('center')
        ctx.font = 'bold 22px SourceHanSansCN'
        ctx.fillText(tag[1].name, 60, 32)
        break
      case 3:
        //复位
        ctx.restore()
        ctx.save()
        //左边标签绘制
        ctx.translate(85, 540)
        _canvas.drawRoundRectPath(ctx, 120, 48, 24)
        ctx.setFillStyle(tag[0].color)
        ctx.fill()
        //文字绘制
        ctx.setFillStyle('#FFFFFF')
        ctx.setTextAlign('center')
        ctx.font = 'bold 22px SourceHanSansCN'
        ctx.fillText(tag[0].name, 60, 32)
        //复位
        ctx.restore()
        ctx.save()
        //左边标签绘制
        ctx.translate(235, 540)
        _canvas.drawRoundRectPath(ctx, 120, 48, 24)
        ctx.setFillStyle(tag[1].color)
        ctx.fill()
        //文字绘制
        ctx.setFillStyle('#FFFFFF')
        ctx.setTextAlign('center')
        ctx.font = 'bold 22px SourceHanSansCN'
        ctx.fillText(tag[1].name, 60, 32)
        //复位
        ctx.restore()
        ctx.save()
        //左边标签绘制
        ctx.translate(385, 540)
        _canvas.drawRoundRectPath(ctx, 120, 48, 24)
        ctx.setFillStyle(tag[2].color)
        ctx.fill()
        //文字绘制
        ctx.setFillStyle('#FFFFFF')
        ctx.setTextAlign('center')
        ctx.font = 'bold 22px SourceHanSansCN'
        ctx.fillText(tag[2].name, 60, 32)
        break
    }
    //复位
    ctx.restore()
    ctx.save()
    //分割线绘制
    ctx.beginPath()
    ctx.setStrokeStyle('#f4f6f9')
    ctx.setLineCap('round')
    ctx.setLineWidth(4)
    ctx.moveTo(80, 629)
    ctx.lineTo(510, 629)
    ctx.stroke()
    //复位
    ctx.restore()
    ctx.save()
    //承办标题绘制
    ctx.setFillStyle('#051c33')
    ctx.setTextAlign('center')
    ctx.font = 'bold 24px SourceHanSansCN'
    const organizer = `活动承办方:${that.data.activityInfo.organizer}`
    const org_metrics = ctx.measureText(organizer)
    if (org_metrics.width > 450) {
      ctx.fillText(organizer.substr(0, 15), 295, 667)
      ctx.fillText(organizer.substr(15, organizer.length), 295, 692)
    } else {
      ctx.fillText(organizer, 295, 667)
    }
    //宣传图绘制
    ctx.translate(80, 80)
    _canvas.drawRoundRectPath(ctx, 430, 344, 10)
    ctx.fill()
    ctx.clip()
    let banner
    if (that.data.activityInfo.shareLink) {
      banner = that.data.activityInfo.shareLink
    } else {
      banner = that.data.activityInfo.bannerData[0]
    }
    wx.getImageInfo({
      src: banner,
      success(res) {
        let dx = (res.width / res.height) <= (5 / 4) ? res.width : (res.height * 5 / 4)
        let dy = (res.width / res.height) <= (5 / 4) ? (res.width * 4 / 5) : res.height
        let sx = (res.width / res.height) <= (5 / 4) ? 0 : (res.width - (res.height * 5 / 4)) / 2
        let sy = (res.width / res.height) <= (5 / 4) ? (res.height - (res.width * 4 / 5)) / 2 : 0
        if ((res.width / res.height) == (5 / 4)) {
          dx = res.width
          dy = res.height
          sx = 0
        }
        ctx.drawImage(res.path, sx, sy, dx, dy, 0, 0, 430, 344)
        ctx.draw()
        //复位
        ctx.restore()
        ctx.save()
        wx.getImageInfo({
          src: `https://api.dreamoncampus.com/dreamact/index/getMiniCode?scene=${that.data.activityId}&page=pages/activity/info/info&width=150`,
          success(ress) {
            ctx.drawImage(ress.path, 40, 798, 150, 150)
            console.error(ress)
            ctx.draw(true, function () {
              wx.canvasToTempFilePath({
                canvasId: 'share',
                success(resss) {
                  wx.hideLoading()
                  // wx.previewImage({
                  //   urls: [resss.tempFilePath]
                  // })

                  that.setData({
                    shareImg: resss.tempFilePath,
                  })
                }
              }, this)
            })
            that.setData({
              canvas: true
            })
          },
          fail: function (res) {
            that.setData({
              notice: `$2${res}`
            })
          }
        })
      },
      fail: function (res) {
        that.setData({
          notice: `$1${res}`
        })
      }
    })
  },
  openImg: function () {
    wx.previewImage({
      urls: [that.data.shareImg]
    })
  },
  collectHandler: function () {
    let type = this.data.collect == true ? type = 0 : type = 1
    _activity.collectActivity({
      activityId: that.data.activityId,
      type: type
    }).then(data => {
      $Message({
        content: data ? '收藏成功' : '取消收藏成功'
      })
      that.setData({
        collect: data
      })
    }).catch(e => {
      $Message({
        content: e.message,
        type: 'warning'
      })
    })
  },
  // 跳转H5
  toH5: function (e) {
    wx.navigateTo({
      url: `/pages/ui/webview?url=${e.currentTarget.dataset.link}`
    })
    that.closeModal()
  },
  // 提示
  onShareAppMessage: function (res) {
    var path = `/pages/activity/info/info?id=${that.data.activityId}`
    var title = that.data.activityInfo.name
    if (that.data.ticket < 0) {
      title = `【${title}】正在抢票哦，快来看看吧！`
    } else if (that.data.apply > 0) {
      title = `【${title}】正在报名哦，快来看看吧！`
    } else if (that.data.activityInfo.viewNumber > 100) {
      title = `${that.data.activityInfo.viewNumber}位同学都在看【${title}】哦，快点进来看看吧！`
    } else {
      title = `同学，快来看看【${title}】吧！`
    }
    that.closeHandler()
    return {
      title: `${title}`,
      imageUrl: that.data.activityInfo.shareLink,
      path: path
    }
  },
  // 获取截止时间
  endTime() {
    let time = new Date().getTime()
    that.data.formList.forEach(item => {
      if (item.type == 1) that.data.apply = item.endDate - time
      if (item.type == 2) that.data.ticket = item.beginDate - time;
      if (item.type == 3) that.data.vote = item.endDate - time
      if (item.type == 4) that.data.prize = item.endDate - time
    })
  },
  commit: function (e) {
    that.endTime()
    if (wx.getStorageSync('uuid') && wx.getStorageSync('token')) {
      switch (e.currentTarget.dataset.type) {
        case 'comment':
          if (wx.getStorageSync('uuid')) {
            // 评论
            if (that.data.comment.length == 0) {
              $Message({
                content: `评论不能为空`,
                type: 'warning'
              })
            } else {
              wx.showLoading({
                title: '评论中...',
                mask: true
              })
              _comment.creatActivityComment({
                content: that.data.comment,
                pid: that.data.replyInfo.commentId,
                puserId: that.data.replyInfo.userId,
                pnickname: that.data.replyInfo.nickname,
                activityId: that.data.activityId,
                nickname: that.data.userInfo.nickName,
                avatar: that.data.userInfo.avatarUrl
              }).then(data => {
                $Message({
                  content: `评论成功`
                })
                that.setData({
                  comment: '',
                  replyInfo: {}
                })
                that.data.page = 1
                that.getCommentData()
                wx.hideLoading()
              }).catch(e => {
                $Message({
                  content: e.message,
                  type: 'warning'
                })
                wx.hideLoading()
              })
            }
          } else {

          }
          break
        case 1:
          if (wx.getStorageSync('uuid')) {
            let flag = false
            that.data.userList.userJoinList.forEach(item => {
              if (item.formId == e.currentTarget.dataset.formid) {
                flag = true
              }
            })
            if (flag == true) {
              wx.showModal({
                content: '您已经报名本次活动',
                cancelText: "重新报名",
                confirmText: "取消",
                success(res) {
                  if (res.confirm) {

                  } else if (res.cancel) {
                    if (that.data.apply < 0) {
                      $Message({
                        content: `报名已结束，请下次抓紧`,
                        type: 'warning'
                      })
                    } else {
                      wx.navigateTo({
                        url: `/pages/activity/apply/apply?formId=${e.currentTarget.dataset.formid}&title=${that.data.activityInfo.name}&beginDate=${that.data.activityInfo.beginDate}&endDate=${that.data.activityInfo.endDate}&theme=${that.data.activityInfo.theme}`
                      })
                    }
                  }
                }
              })
              return false
            }
            // 正常报名
            if (that.data.apply < 0) {
              $Message({
                content: `报名已结束，请下次抓紧`,
                type: 'warning'
              })
            } else {
              wx.navigateTo({
                url: `/pages/activity/apply/apply?formId=${e.currentTarget.dataset.formid}&title=${that.data.activityInfo.name}&beginDate=${that.data.activityInfo.beginDate}&endDate=${that.data.activityInfo.endDate}&theme=${that.data.activityInfo.theme}`
              })
            }
          } else {
            that.navigateTo()
          }
          break
        case 2:
          if (wx.getStorageSync('uuid')) {
            let flag = false
            that.data.userList.userJoinList.forEach(item => {
              if (item.formId == e.currentTarget.dataset.formid) {
                flag = true
              }
            })
            if (flag == true) {
              wx.showModal({
                content: '您已抢票成功',
                cancelText: "点击查看",
                confirmText: "取消",
                success(res) {
                  if (res.confirm) {

                  } else if (res.cancel) {
                    wx.navigateTo({
                      url: '/pages/my/ticket/ticket',
                    })
                  }
                }
              })
              return false
            }
            // 抢票
            if (that.data.ticket > 0) {
              $Message({
                content: `抢票暂未开始，请留意抢票时间`,
                type: 'warning'
              })
            } else {
              // console.log()
              wx.navigateTo({
                url: `/pages/activity/lootticket/lootticket?formId=${e.currentTarget.dataset.formid}&title=${that.data.activityInfo.name}&ticketType=${JSON.parse(that.data.formList[e.currentTarget.dataset.key].extraData).redeemCode}`
              })
            }
          } else {
            that.navigateTo()
          }
          break
        case 3:
          if (wx.getStorageSync('uuid')) {
            if (e.currentTarget.dataset.url) {
              wx.navigateTo({
                url: `/pages/ui/webview/webview?url=${e.currentTarget.dataset.url}`
              })
              return false
            }
            // 投票
            // console.log(that.data)
            if (that.data.vote < 0 && that.data.formList[e.currentTarget.dataset.key].status == 0) {
              $Message({
                content: `请等待投票开启`,
                type: 'warning'
              })
              return false
            }
            // 访问是否有权限投票
            _activity.getSceneInfo({
              formId: e.currentTarget.dataset.formid
            }).then(data => {
              wx.navigateTo({
                url: `/pages/activity/vote/vote?formId=${e.currentTarget.dataset.formid}&title=${that.data.activityInfo.name}&beginDate=${that.data.activityInfo.beginDate}&endDate=${that.data.activityInfo.endDate}&theme=${that.data.activityInfo.theme}&vote=${that.data.vote}`
              })
            }).catch(e => {
              if (e.message == "无投票权限") {
                that.setData({
                  userModal: true
                })
              }
            })
            wx.hideLoading()
          } else {
            that.navigateTo()
          }
          break
      }
    } else {
      wx.showModal({
        content: '更多功能请登录后使用',
        confirmText: "登录",
        success(res) {
          if (res.confirm) {
            that.navigateTo({
              url: `/pages/login`
            })
          }
        }
      })
    }
  },
  showAction: function (e) {
    if (that.data.actionable) {
      wx.showActionSheet({
        itemList: ["删除该留言", "屏蔽此人所有留言"],
        success: res => {
          switch (res.tapIndex) {
            case 0:
              wx.showLoading({
                title: '删除中...',
                mask: true
              })
              // console.error(e.currentTarget.dataset.id)
              _comment.deleteComment({
                id: e.currentTarget.dataset.id
              }).then(data => {
                $Message({
                  content: `删除成功`
                })
                that.data.page = 1
                that.getCommentData()
                wx.hideLoading()
              }).catch(e => {
                $Message({
                  content: e.message,
                  type: 'warning'
                })
                wx.hideLoading()
              })
              break
            case 1:
              wx.showLoading({
                title: '屏蔽中...',
                mask: true
              })
              _comment.deleteUserComment({
                id: e.currentTarget.dataset.id
              }).then(data => {
                $Message({
                  content: `屏蔽成功`
                })
                that.data.page = 1
                that.getCommentData()
                wx.hideLoading()
              }).catch(e => {
                $Message({
                  content: e.message,
                  type: 'warning'
                })
                wx.hideLoading()
              })
              break
          }
        }
      })
    }
  },
  reply: function (e) {
    if (that.data.replyInfo.commentId == e.currentTarget.dataset.id) {
      that.setData({
        replyInfo: {
          commentId: undefined,
          userId: undefined,
          nickname: undefined
        }
      })
    } else {
      that.setData({
        replyInfo: {
          commentId: e.currentTarget.dataset.id,
          userId: e.currentTarget.dataset.uid,
          nickname: e.currentTarget.dataset.name
        }
      })
    }
  },
  lottery: function (e) {
    if (wx.getStorageSync("uuid")) {
      wx.navigateTo({
        url: `/pages/activity/lottery/lottery?formId=${e.currentTarget.dataset.formid}&title=${that.data.activityInfo.name}`
      })
    } else {
      wx.showModal({
        content: '更多功能请登录后使用',
        confirmText: "登录",
        success(res) {
          if (res.confirm) {
            that.navigateTo({
              url: `/pages/login`
            })
          }
        }
      })
    }
  },
  onHide: function () {
    clearInterval(that.data.interval)
  },
  onUnload: function () {
    clearInterval(that.data.interval)
  },
})