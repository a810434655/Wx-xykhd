var _audio = require("../../service/audio.js")
var that
Component({
  properties: {
    course: Object,
    title: {
      type: String
    },
    src: {
      type: String
    }
  },
  data: {
    playing: !1,
    endTime: '00:00',
    curTime: '00:00'
  },
  attached: function() {
    that = this
    console.log(this.data.src)
    if (_audio.curIndex() == 'sdfsd'){
      that.onCurPlay()
    }
  },
  detached: function() {
    // this._removeEvent();
  },
  methods: {
    tap: function() {

    },
    play: function() {
      that.playAudio();
    },
    pause: function() {
      that.pauseAudio();
    },
    playAudio: function() {
      console.log('开始播放')
      var _course = that.properties.course || {}
      _audio.play({
        title: that.data.title,
        epname: _course.epname, 
        singer: _course.singer, 
        coverImgUrl: _course.coverImgUrl,
        src: that.data.src, 
        hash: 'sdfsd'
      }, function () {
        console.log('播放回调')
        that.onCurPlay()
      })
    },
    pauseAudio: function() {
      console.log('暂停播放')
      that.setData({
        playing: !1
      })
      _audio.pause()
    },
    onCurPlay: function() {
      console.log('记录', _audio.playing(), _audio.curTime())
      that.setData({
        endTime: that.prefixInteger(parseInt(_audio.duration() / 60), 2) + ':' + that.prefixInteger(parseInt(_audio.duration() % 60), 2),
        curTime: that.prefixInteger(parseInt(_audio.curTime() / 60), 2) + ':' + that.prefixInteger(parseInt(_audio.curTime() % 60), 2)
      })
      if (_audio.playing()){
        that.setData({
          playing: !0
        })
        setTimeout(function () {
          that.onCurPlay()
        }, 400)
      }else {
        that.setData({
          playing: !1
        })
      }
    },
    prefixInteger: function (num, length) {
      return (Array(length).join('0') + num).slice(-length)
    }
  }
});