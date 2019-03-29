export function getParams (data) {
  let paramsArray = []
  // 拼接参数
  Object.keys(data).forEach(key => {
    // console.error(key, data[key], data[key] != undefined)
    if (data[key] != undefined) { paramsArray.push(key + '=' + encodeURI(data[key]))}})
  // console.error(paramsArray)
  let par = ''
  if (par.search(/\?/) === -1) {
    par += '?' + paramsArray.join('&')
  } else {
    par += '&' + paramsArray.join('&')
  }
  return par
}
