const formatTime = (date, format) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  if(format) {
    format = format.replace(/YYYY/gi, year);
    format = format.replace(/MM/g, formatNumber(month, 2));
    format = format.replace(/DD/gi, formatNumber(day, 2));
    format = format.replace(/hh/g, formatNumber(hour, 2));
    format = format.replace(/mm/g, formatNumber(minute, 2));
    format = format.replace(/ss/g, formatNumber(second, 2));
    return format;
  }else {
    return [year, month, day].map(formatNumber, 2).join('/') + ' ' + [hour, minute, second].map(formatNumber, 2).join(':')
  }
}

const getTimeByFormat = (timeString, format) => {
  var yearInfo = /YYYY/i.exec(format);
  var monthInfo = /MM/i.exec(format);
  var dayInfo = /DD/i.exec(format);
  var hourceInfo = /hh/.exec(format);
  var minuteInfo = /mm/.exec(format);
  var secondInfo = /ss/.exec(format);

  var year = yearInfo ? Number(timeString.substr(yearInfo.index, yearInfo[0].length)) : 0;
  var month = monthInfo ? Number(timeString.substr(monthInfo.index, monthInfo[0].length)) - 1 : 0;
  var day = dayInfo ? Number(timeString.substr(dayInfo.index, dayInfo[0].length)) : 0;
  var hource = hourceInfo ? Number(timeString.substr(hourceInfo.index, hourceInfo[0].length)) : 0;
  var minute = minuteInfo ? Number(timeString.substr(minuteInfo.index, minuteInfo[0].length)) : 0;
  var second = secondInfo ? Number(timeString.substr(secondInfo.index, secondInfo[0].length)) : 0;

  return new Date(year, month, day, hource, minute, second)
}

const getDateDiff = function (currentDate, beforeData) {
  var result;
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var halfamonth = day * 15;
  var month = day * 30;
  var diffValue = currentDate - beforeData;
  if (diffValue < 0) {
    return;
  }
  var monthC = diffValue / month;
  var weekC = diffValue / (7 * day);
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;
  if (monthC >= 1) {
    result = "" + parseInt(monthC) + "月前";
  } else if (weekC >= 1) {
    result = "" + parseInt(weekC) + "周前";
  } else if (dayC >= 1) {
    result = "" + parseInt(dayC) + "天前";
  } else if (hourC >= 1) {
    result = "" + parseInt(hourC) + "小时前";
  } else if (minC >= 1) {
    result = "" + parseInt(minC) + "分钟前";
  } else {
    result = "刚刚";
  }
  return result;
}

const formatNumber = (n, amount) => {
  n = n.toString()
  var a = amount - n.length;
  if(a < 0) {
    return n
  }else{
    return Array(a).fill("0").join("") + n
  }
}

const textEllipsis = (text, number) => {
  if(text.length > number) {
    return text.slice(0, number) + "..."
  }else {
    return text;
  }
}

// 截取出 number 个全角字符宽的字符串
const textEllipsisBySBC = (text, number) => {
  if (getLengthBySBC(text) > number) {
    for(var i=0; i<text.length; i++) {
      if (getLengthBySBC(text.slice(0, i)) > number){
        break;
      }
    }
    i--;
    return text.slice(0, i) + "..." 
  } else {
    return text;
  }
}

// 取得传入的 str 的宽度相当于多少个全角符字符的宽度 
const getLengthBySBC = (str) => {
  var reg1 = /[\u0000-\u00ff]/g; // 半角，一字节
  // var reg2 = /[\u4e00-\u9fa5]/g; // 中文，两字节
  // var reg3 = /[\uff00-\uffff]/g; // 全角，两字节
  // var reg4 = /[\u3002|\u3001|\u201c|\u201d|\u2018|\u2019|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\ufe4f]/g; // 中文符号
  var len1 = str.match(reg1) ? str.match(reg1).length : 0;
  return str.length - len1 / 2
}

// 显示繁忙提示
var showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
})

// 显示失败提示
var showModel = (title, content) => {
    wx.hideToast();

    wx.showModal({
        title,
        content: JSON.stringify(content),
        showCancel: false
    })
}

const parseUrl = function (url) {
  var result = {};
  var query = url.split("?")[1] ? url.split("?")[1] : url;
  var queryArr = query.split("&");
  queryArr.forEach(function (item) {
    var value = item.split("=")[1];
    var key = item.split("=")[0];
    result[key] = value;
  });
  return result;
}

module.exports = { 
  formatTime, 
  showBusy, 
  showSuccess, 
  showModel, 
  getTimeByFormat,
  getDateDiff,
  textEllipsis,
  formatNumber,
  textEllipsisBySBC,
  parseUrl
}
