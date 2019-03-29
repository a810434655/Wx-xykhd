// pages/manage/poster.js
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
    imgPath:'',
    canvasHidden: true,
    activityId: '',
    title: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this
    wx.setNavigationBarTitle({
      title: options.title
    })
    that.setData({
      activityId: options.id,
      title: options.title
    })
  },
  upImg: function (e) {
    //创建节点选择器
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        that.setData({
          imgPath: tempFilePaths[0]
        })
      }
    })
  },
  save: function(e) {
    if(that.data.imgPath.length == 0){
      $Message({
        content: `请先选择宣传图片`,
        type: 'warning'
      })
      return
    }
    wx.showLoading({
      title: '正在绘制...',
      mask: true
    })
    const ctx = wx.createCanvasContext('share')
    ctx.rect(0, 0, 750, 1290)
    ctx.setFillStyle('white')
    ctx.fill()
    wx.getImageInfo({
      src: that.data.imgPath,
      success(res) {
        // console.log(res.width, res.height)
        // console.log((res.width * 100), (res.height * 67))
        let dx = (res.width / res.height) <= (67 / 100) ? res.width : (res.height * 670 / 1000)
        let dy = (res.width / res.height) <= (67 / 100) ? (res.width * 1000 / 670) : res.height
        let sx = (res.width / res.height) <= (67 / 100) ? 0 : (res.width - (res.height * 670 / 1000)) / 2
        let sy = (res.width / res.height) <= (67 / 100) ? (res.height - (res.width * 1000 / 670)) / 2 : 0
        if ((res.width / res.height) == (67 / 100)){
          dx = res.width
          dy = res.height
          sx = 0
        }
        // console.error(sx, sy, dx, dy)
        ctx.drawImage(res.path, sx, sy, dx, dy, 40, 30, 670, 1000)
        ctx.draw()
        wx.getImageInfo({
          // ${ that.data.activityId }
          src: `https://dreamoncampus.com/dreamact/index/getMiniCode?scene=${that.data.activityId}&page=pages/activity/info&width=200`,
          success(ress) {
            ctx.drawImage(ress.path, 80, 1065, 200, 200)

            ctx.setFillStyle('#3D3D3D')
            ctx.setFontSize(32)
            ctx.fillText("长按识别小程序二维码", 300, 1125)
            ctx.fillText("进入", 300, 1170)
            ctx.fillText("查看更多详情", 300, 1215)
            ctx.setFillStyle('#07C2FF')
            ctx.fillText(that.data.title, 375, 1170, 350)
            ctx.draw(true, function() {
              wx.canvasToTempFilePath({
                canvasId: 'share',
                success(resss) {
                  // wx.hideLoading()
                  // wx.previewImage({
                  //   urls: [resss.tempFilePath]
                  // })
                    wx.authorize({
                      scope: 'scope.writePhotosAlbum',
                      success() {
                        wx.saveImageToPhotosAlbum({
                          filePath: resss.tempFilePath,
                          success() {
                            wx.showToast({
                              title: '图片保存成功'
                            })
                          }
                        })
                      }
                    })
                }
              }, this)
            })


          },
          fail: function (res) {
            console.error('eee2', res)
          }
        })
      },
      fail: function(res) {
        console.error('eee', res)
      }
    })
  }
})