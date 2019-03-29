// component/iden-bottom/iden-bottom.js
var _special = require("../../service/special.js")
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleIden(event) {
      //点击记录
      _special.visitRecord({ type: 3 })
      wx.navigateTo({
        url: '/pages/my/identification?id=1&title=学生组织认证'
      })
    }
  }
})
