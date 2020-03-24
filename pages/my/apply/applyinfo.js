// pages/my/applyinfo.js
let _user = require('../../../service/user.js')
let that
// const {
//   $Message
// } = require('../../../resources/dist/base/index')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataInfo:[],
    number:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
  
    _user.getApplyInfo({id:options.id})
    .then(data=>{
      that.setData({
        number:data.number
      })
      // console.log(JSON.parse(data.jsonData))
      that.setData({
        dataInfo:JSON.parse(data.jsonData)
      })
      that.dataInfo
    })
    .catch(e=>{
      $Message({
        content: e.message,
        type: 'warning'
      })
    })
  }
  
})