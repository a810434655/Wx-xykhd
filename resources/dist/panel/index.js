Component({
  externalClasses: ['i-class'],

  properties: {
    color: {
      type: String,
      value: '#999'
    },
    title: {
      type: String,
      value: ''
    },
    content: {
      type: String,
      value: ''
    },
    // 是否展示问号
    showQuestion: {
      type: Boolean,
      value: false
    },
    // 是否展示右侧箭头并开启尝试以 url 跳转
    isInfo: {
      type: Boolean,
      value: false
    },
    // 是否展示右侧箭头并开启尝试以 url 跳转
    isTitle: {
      type: Boolean,
      value: false
    },
    // 是否展示右侧箭头并开启尝试以 url 跳转
    isLink: {
      type: null,
      value: ''
    },
    // 标题顶部距离
    hideTop: {
      type: Boolean,
      value: false
    },
    hideBorder: {
      type: Boolean,
      value: false
    },
    questionData: {
      type: String,
      value: ''
    }
  },
  methods: {
    tapQuestion: function () {
      this.triggerEvent('tapQuestion', this.data.questionData)
    }
  }
});