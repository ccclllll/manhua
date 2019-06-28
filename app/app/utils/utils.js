import {Dimensions,
    Platform } from 'react-native';

//获取屏幕大小
const { width, height } = Dimensions.get("window");
const ScreenWidth = Math.min( width, 540); //判断是否是 iphone Plus
/**
 * 适配单位
 */
function getPixel(num, designWidth = 375) {
   return num * ScreenWidth / designWidth ;
}
export {
    getPixel,
    http,
    screen,
    httpPromise
}
const screen = {
    width: width,
    height: height
}
function http(url,options){
    var request = new XMLHttpRequest();
    request.onreadystatechange = (e) => {
        if (request.readyState !== 4) {
            return;
        }
        if (request.status === 200 || request.send === 304) { 
            options.success(request.responseText);
        } else {
            options.fail(request.status);
        }
    };
    options.header? request.setRequestHeader(options.header):'';
    request.open(options.method? options.method : 'GET', url);
    options.body?request.send(options.body):request.send();
}

async function httpPromise(url){
    return new Promise((resolve,reject)=> {
        http(url,{
            success: (data)=> resolve(data),
            fail: (status) => reject(status)
        });
    })
}