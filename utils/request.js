var _params = require("params.js")
function POST({url, data}) {
  return new Promise((resolve, reject) => {
    //init
    var that = this
    //参数
    var postData = data
    var header = {}
    var token = wx.getStorageSync('token')
    if (token){ 
      // console.error('token!', token)
      header['j4sc-token'] = token
    }
    //网络请求
    wx.request({
      url: url,
      data: postData,
      method: 'POST',
      header: header,
      success: function (res) {
        // console.error('POST', url, postData, res)
        //服务器返回数据
        if (res.data.status == 200) {
          resolve(res.data.data)
        } else {
          reject(res.data)
        }
      },  
      error: function (e) {
        reject('网络出错')
      }
    })
  })
}
function PUT({ url, data }) {
  return new Promise((resolve, reject) => {
    //init
    var that = this
    var postData = data
    var header = {}
    var token = wx.getStorageSync('token')
    if (token) {
      // console.error('token!', token)
      header['j4sc-token'] = token
    }
    //网络请求
    wx.request({
      url: url,
      data: postData,
      method: 'PUT',
      header: header,
      success: function (res) {
        // console.error('PUT', url, postData, res)
        //服务器返回数据
        if (res.data.status == 200) {
          resolve(res.data.data)
        } else {
          reject(res.data)
        }
      },
      error: function (e) {
        reject('网络出错')
      }
    })
  })
}

function DEL({ url, data }) {
  return new Promise((resolve, reject) => {
    //init
    var that = this
    var postData = data
    var header = { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8'}
    var token = wx.getStorageSync('token')
    if (token) {
      // console.error('token!', token)
      header['j4sc-token'] = token
    }
    //网络请求
    wx.request({
      url: url + _params.getParams(postData),
      // data: postData,
      method: 'DELETE',
      header: header,
      success: function (res) {
        // console.error('DEL', url, postData, res)
        //服务器返回数据
        if (res.data.status == 200) {
          resolve(res.data.data)
        } else if (res.data.status == 40101) {
          reject(res.data)
        } else {
          reject(res.data)
        }
      },
      error: function (e) {
        reject('网络出错')
      }
    })
  })
}

function GET({ url, data }) {
  // console.error('gg', this, typeof this.GET == 'function')
  return new Promise((resolve, reject) => {
    //init
    var that = this
    var getData = data
    var header = { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8'}
    var token = wx.getStorageSync('token')
    if (token) {
      // console.error('token!', token)
      header['j4sc-token'] = token
    }
    //网络请求
    wx.request({
      url: url + _params.getParams(getData),
      // data: getData,
      method: 'GET',
      header: header,
      success: function (res) {
        // console.error('GET', url + _params.getParams(getData), getData, res)
        //服务器返回数据
        if (res.data.status == 200) {
          resolve(res.data.data)
        } else {
          reject(res.data)
        }
      },
      error: function (e) {
        reject('网络出错')
      }
    })
  })
}

function UP({ url, data }) {
  return new Promise((resolve, reject) => {
    //init
    var that = this
    var header = {}
    var token = wx.getStorageSync('token')
    if (token) {
      // console.error('token!', token)
      header['j4sc-token'] = token
    }
    //网络请求
    wx.uploadFile({
      url: url,
      filePath: data.filePath,
      name: 'file',
      header: header,
      success: function (res) {
        // console.error('UP', url, data, res)
        res.data = JSON.parse(res.data)
        //服务器返回数据
        if (res.data.status == 200) {
          resolve(res.data.data)
        } else {
          reject(res.data)
        }
      },
      error: function (e) {
        reject('网络出错')
      }
    })
  })
}

module.exports = {
  POST: POST,
  PUT: PUT,
  DEL: DEL,
  GET: GET,
  UP: UP
}