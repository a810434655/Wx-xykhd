function newDateS(date) {
  let time = new Date(parseInt(date));
  let Y, M, D, h, m, s
  Y = time.getFullYear() + '-';
  M = (time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1) + '-';
  D = (time.getDate() < 10 ? '0' + (time.getDate()) : time.getDate()) + '-';
  h = (time.getHours() + 1 < 10 ? '0' + (time.getHours()) : time.getHours()) + '-';

  m = time.getMinutes() + ':';
  s = time.getSeconds();
  return Y + M + D + h + m + s
}
function newDateM(date) {
  let time = new Date(parseInt(date));
  let Y, M, D, h, m
  Y = time.getFullYear() + '-';
  M = (time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1) + '-';
  D = (time.getDate() < 10 ? '0' + time.getDate() : time.getDate()) + ' ';
  h = (time.getHours() < 10 ? '0' + time.getHours() : time.getHours()) + ':';
  m = (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes());
  return Y + M + D + h + m
}
function newDateH(date) {
  let time = new Date(parseInt(date));
  // console.log(time)
  let Y, M, D, h
  Y = time.getFullYear() + '-';
  M = (time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1) + '-';
  D = (time.getDate() < 10 ? '0' + time.getDate(): time.getDate());
  return Y + M + D
}

module.exports = {
  newDateS,
  newDateM,
  newDateH
}
