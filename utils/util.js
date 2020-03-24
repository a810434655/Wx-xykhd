const formatTime = (date,index) => {
  let year
  let month 
  let day
  let hour
  let minute
  let second
  if (index == 0){
    year = date.getFullYear()
    month = date.getMonth() + 1
    day = date.getDate()
    hour = date.getHours()+8
    minute = date.getMinutes()
    second = date.getSeconds()
  }else if(index == 1){
    year = date.getFullYear()
    month = date.getMonth() + 1
    day = date.getDate()
    hour = date.getHours()
    minute = date.getMinutes()
    second = date.getSeconds()
  }
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

/**
 * 用于判断空，Undefined String Array Object
 */
const isBlank = str => {
  if (Object.prototype.toString.call(str) === '[object Undefined]') {//空
    return true
  } else if (
    Object.prototype.toString.call(str) === '[object String]' ||
    Object.prototype.toString.call(str) === '[object Array]') { //字条串或数组
    return str.length == 0 ? true : false
  } else if (Object.prototype.toString.call(str) === '[object Object]') {
    return JSON.stringify(str) == '{}' ? true : false
  } else {
    return true
  }

}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const checkMobile = phone => {
  return (/^1[3|4|5|7|8|9][0-9]\d{4,8}$/.test(phone))
} 
module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  isBlank: isBlank,
  checkMobile: checkMobile
}
