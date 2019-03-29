// pages/activity/info.js
var _activity = require("../../service/activity.js")
var _activityTemp = require("../../service/temp.js")
var _comment = require("../../service/comment.js")
var _canvas = require("../../utils/canvas.js")
const {
  $Message
} = require('../../resources/dist/base/index')
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
    userModal:false,//模态框
    voteType:1,  //投票类型
    ticketType:0  //取票类型
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this
    that.animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    that.data.activityId = options.id
    if (options.id == undefined) {
      that.data.activityId = options.scene
    }
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    // 获取用户信息
    // console.error('1')
    if (wx.getStorageSync('user')) {
      that.getActivityInfo()
    } else {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            if (!wx.getStorageSync('token')) {
              app.login(that.getActivityInfo)
            } else {
              that.getActivityInfo()
            }
          } else {
            app.noAuthLogin(that.getActivityInfo)
          }
          if (this.userInfoReadyCallback) {
            this.userInfoReadyCallback(res)
          }
        }
      })
    }
  },
  fixActivityInfo: function() {
    _activity.getUserActivityById({
      id: that.data.activityId
    }).then(data => {}).catch(errMsg => {
      // wx.navigateBack({})
      setTimeout(function() {
        that.fixActivityInfo()
      }, 3000)
      wx.hideLoading()
    })
  },
  // 现场投票false Modal
  handleUserModal:function(e){
    that.setData({
      userModal: false,
    })
  },
  
  getActivityInfo: function() {
    _activity.getUserActivityById({
      id: that.data.activityId
    }).then(data => {
      data.activity.bannerData = JSON.parse(data.activity.bannerData)
      data.activity.timeLine = JSON.parse(data.activity.timeLine)
      wx.setNavigationBarTitle({
        title: data.activity.name,
      })
      // 获取接口返回的来判断显示
       that.setData({
         ticketType: data.ticketType,
         voteType: data.voteType
       })
       console.log(data);
       console.log(data.voteType)
      // data.ticket = data.ticket-60*1000*20
      if (data.activity.content.indexOf("img~") == 0) {
        that.setData({
          contentType: 1,
          contentImg: data.activity.content.substr(4)
        })
      }
      // console.error('sss', data.fightValue, data.fightValue != undefined)
      if (data.fightValue != undefined) {
        that.data.tempActivity['area'] = data.area
        that.data.tempActivity['fightValue'] = data.fightValue
        that.setData({
          tempActivity: that.data.tempActivity
        })
      }
      //计算功能 设置span
      let _span = 0
      if (data.enroll != 0) _span++
        if (data.ticket != 0) _span++
          if (data.vote != 0) _span++
            if (_span != 0) _span = 24 / _span
      that.setData({
        apply: data.enroll,
        ticket: data.ticket,
        vote: data.vote,
        prize: data.prize,
        span: _span,
        activityInfo: data.activity,
        collect: data.collect,
        actionable: data.actionable
      })
      if (data.ticket > 0) {
        that.startLootTicket()
      }
      if (!data.login) {
        app.noAuthLogin(that.fixActivityInfo)
      }
      wx.hideLoading()
    }).catch(errMsg => {
      // wx.navigateBack({})
      setTimeout(function() {
        that.getActivityInfo()
      }, 3000)
      wx.hideLoading()
    })
    that.getCommentData()
  },
  selectTab: function(e) {
    that.animation.translateX(e.target.offsetLeft).scaleX(1).step()
    that.setData({
      animationX: e.target.offsetLeft,
      animationData: that.animation.export(),
      tabId: e.currentTarget.dataset.id
    })
    // that.getHomeCourse(e.currentTarget.dataset.id)
  },
  changeInput: function(e) {
    that.data[e.detail.currentTarget.dataset.key] = e.detail.detail.value
  },
  getCommentData: function() {
    _comment.getActivityCommentPage({
      page: that.data.page,
      size: that.data.size,
      activityId: that.data.activityId
    }).then(data => {
      if (that.data.page == 1) {
        that.data.commentList.splice(0, that.data.commentList.length)
      }
      data.records.forEach(c => {
        c.ctime = `${c.ctime.substring(5, 10)} ${c.ctime.substring(11, 16)}`
      })
      that.setData({
        commentList: that.data.commentList.concat(data.records)
      })
    }).catch(errMsg => {

    })
  },
  onReachBottom: function() {
    if (that.data.tabId == 2) {
      that.data.page++
        that.getCommentData()
    }
  },
  shareHandler: function() {
    that.setData({
      shareSheetShow: true
    })
  },
  shareSheetHandler: function(e) {
    that.closeHandler()
    if (e.detail.index == 0) {
      that.setData({
        shareModel: true
      })
      that.drawSharePic()
    }
  },
  closeHandler: function() {
    that.setData({
      shareSheetShow: false,
      shareModel: false
    })
  },
  drawSharePic: function() {
    if (that.data.shareImg.length>0){
      return
    }
    wx.showLoading({
      title: '正在绘制...',
      mask: true
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
    wx.getImageInfo({
      src: that.data.activityInfo.shareLink,
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
          src: `https://dreamoncampus.com/dreamact/index/getMiniCode?scene=${that.data.activityId}&page=pages/activity/info&width=150`,
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
                    shareImg: resss.tempFilePath
                  })
                }
              }, this)
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
    // ctx.rect(0, 0, 590, 770)
    // ctx.setFillStyle('#5a90ff')
    // ctx.fill()
    // wx.getImageInfo({
    //   src: that.data.activityInfo.shareLink,
    //   success(res) {
    //     let dx = (res.width / res.height) <= (67 / 100) ? res.width : (res.height * 670 / 1000)
    //     let dy = (res.width / res.height) <= (67 / 100) ? (res.width * 1000 / 670) : res.height
    //     let sx = (res.width / res.height) <= (67 / 100) ? 0 : (res.width - (res.height * 670 / 1000)) / 2
    //     let sy = (res.width / res.height) <= (67 / 100) ? (res.height - (res.width * 1000 / 670)) / 2 : 0
    //     if ((res.width / res.height) == (67 / 100)) {
    //       dx = res.width
    //       dy = res.height
    //       sx = 0
    //     }
    //     // console.error(sx, sy, dx, dy)
    //     ctx.drawImage(res.path, sx, sy, dx, dy, 45, 40, 670, 1000)
    //     ctx.draw()
    //     wx.getImageInfo({
    //       // ${ that.data.activityId }
    //       src: `https://dreamoncampus.com/dreamact/index/getMiniCode?scene=${that.data.activityId}&page=pages/activity/info&width=200`,
    //       success(ress) {
    //         ctx.drawImage(ress.path, 80, 1065, 200, 200)

    //         ctx.setFillStyle('#3D3D3D')
    //         ctx.setFontSize(32)
    //         ctx.fillText("长按识别小程序二维码", 300, 1125)
    //         ctx.fillText("进入", 300, 1170)
    //         ctx.fillText("查看更多详情", 300, 1215)
    //         ctx.setFillStyle('#07C2FF')
    //         ctx.fillText(that.data.activityInfo.name, 375, 1170, 350)
    //         ctx.draw(true, function () {
    //           wx.canvasToTempFilePath({
    //             canvasId: 'share',
    //             success(resss) {
    //               wx.hideLoading()
    //               // wx.previewImage({
    //               //   urls: [resss.tempFilePath]
    //               // })
    //               that.setData({
    //                 shareImg: resss.tempFilePath
    //               })
    //             }
    //           }, this)
    //         })


    //       },
    //       fail: function (res) {
    //         console.error('eee2', res)
    //       }
    //     })
    //   },
    //   fail: function (res) {
    //     console.error('eee', res)
    //   }
    // })
  },
  openImg: function() {
    wx.previewImage({
      urls: [that.data.shareImg]
    })
  },
  collectHandler: function() {
    _activity.collectActivity({
      activityId: that.data.activityId
    }).then(data => {
      $Message({
        content: data ? '收藏成功' : '取消收藏成功'
      })
      that.setData({
        collect: data
      })
    }).catch(errMsg => {
      $Message({
        content: errMsg,
        type: 'warning'
      })
    })
  },
  toH5: function(e) {
    wx.navigateTo({
      url: `/pages/ui/webview?url=${e.currentTarget.dataset.link}`
    })
    that.closeModal()
  },
  onShareAppMessage: function(res) {
    var path = `/pages/activity/info?id=${that.data.activityId}`
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
  toLogin: function(e) {
    app.login(function() {
      $Message({
        content: '授权成功，请继续您的操作'
      })
    })
  },
  commit: function(e) {
    console.log(e)
    if (e.detail.userInfo) {
      switch (e.currentTarget.dataset.type) {
        case 'comment':
          if (wx.getStorageSync('user')) {
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
                nickname: e.detail.userInfo.nickName,
                avatar: e.detail.userInfo.avatarUrl
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
              }).catch(errMsg => {
                console.error(errMsg)
                $Message({
                  content: errMsg,
                  type: 'warning'
                })
                wx.hideLoading()
              })
            }
          } else {
            // console.error('1')
            that.toLogin()
          }
          break
        case 'apply':
          if (wx.getStorageSync('user')) {
            // 报名
            if (that.data.apply <= 0) {
              $Message({
                content: `报名已结束，请下次抓紧`,
                type: 'warning'
              })
            } else {
              wx.navigateTo({
                url: `/pages/activity/apply?id=${that.data.activityId}&title=${that.data.activityInfo.name}&beginDate=${that.data.activityInfo.beginDate}&endDate=${that.data.activityInfo.endDate}&theme=${that.data.activityInfo.theme}`
              })
            }
          } else {
            that.toLogin()
          }
          break
        case 'lootticket':
          if (wx.getStorageSync('user')) {
            // 抢票
            if (that.data.ticket > 0) {
              $Message({
                content: `抢票暂未开始，请留意抢票时间`,
                type: 'warning'
              })
            } else {
              wx.navigateTo({
                url: `/pages/activity/lootticket?id=${that.data.activityId}&title=${that.data.activityInfo.name}`
              })
            }
          } else {
            that.toLogin()
          }
          break
        case 'vote':
          if (wx.getStorageSync('user')) {
            // 投票
            // 访问是否有权限投票
            _activity.getSceneInfo({
              activityId: that.data.activityId
            }).then(data=>{
              wx.navigateTo({
                url: `/pages/activity/vote?id=${that.data.activityId}&title=${that.data.activityInfo.name}&beginDate=${that.data.activityInfo.beginDate}&endDate=${that.data.activityInfo.endDate}&theme=${that.data.activityInfo.theme}&vote=${that.data.vote}`
              })
            }).catch(errMsg=>{
                 if(errMsg=="无投票权限"){
                   that.setData({
                     userModal:true
                   })
                 }
              })
              wx.hideLoading()
          } else {
            that.toLogin()
          }
          break
      }
    } else {
      $Message({
        content: '更多功能请授权后使用',
        type: 'warning'
      })
    }
  },
  lottery: function(e) {
    wx.navigateTo({
      url: `/pages/activity/lottery?id=${that.data.activityId}&title=${that.data.activityInfo.name}`
    })
  },
  showAction: function(e) {
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
              console.error(e.currentTarget.dataset.id)
              _comment.deleteComment({
                id: e.currentTarget.dataset.id
              }).then(data => {
                $Message({
                  content: `删除成功`
                })
                that.data.page = 1
                that.getCommentData()
                wx.hideLoading()
              }).catch(errMsg => {
                console.error(errMsg)
                $Message({
                  content: errMsg,
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
              }).catch(errMsg => {
                console.error(errMsg)
                $Message({
                  content: errMsg,
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
  reply: function(e) {
    that.setData({
      replyInfo: {
        commentId: e.currentTarget.dataset.id,
        userId: e.currentTarget.dataset.uid,
        nickname: e.currentTarget.dataset.name
      }
    })
  },
  onHide: function() {
    clearInterval(that.data.interval)
  },
  onUnload: function() {
    clearInterval(that.data.interval)
  },
  startLootTicket: function() {
    that.data.interval = setInterval(function() {
      that.setData({
        ticket: that.data.ticket - 1000
      })
      // 毫秒数
      var second = parseInt(that.data.ticket / 1000);
      if (second < 3600) {
        // 分钟位
        var min = Math.floor(second / 60);
        var minStr = min.toString();
        if (minStr.length == 1) minStr = '0' + minStr;

        // 秒位
        var sec = second - min * 60;
        var secStr = sec.toString();
        if (secStr.length == 1) secStr = '0' + secStr
        $Message({
          content: `还有${minStr}:${secStr}可以参加抢票`,
          type: 'error'
        })
      }
      if (second <= 0) {
        if (that.data.ticket >= 0) {
          that.setData({
            ticket: -1
          })
        }
        clearInterval(that.data.interval)
        $Message({
          content: `抢票开始`
        })
      }
    }.bind(this), 1000)
  }
})