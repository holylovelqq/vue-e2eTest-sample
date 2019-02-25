import Vue from 'vue'
// 功能：基于iview的Message组件封装的一个带有倒计时的错误提示message
// 参数：time-必填，提示时长，也是倒计时时长 number
//      content-必填，除倒计时之外的提示内容 string
//      code-必填，标识每一个弹出的提示，使每一个提示的倒计时互不干扰 string
    //  top-选填，自定义提示显示的位置，默认像素 number-------已取消，参数top会影响弹窗内容的位置，使重叠
// 返回值：无
function errorMessage(time,content,code) {
    let tipDom = document.getElementsByClassName('messageA' + code);
     // 判断是否弹完全相同的另一个错误提示，是则取消弹出，否则弹出
    if(tipDom.length>0){
        return;
    }
    Vue.prototype.$Message.error({
        duration:time,
        closable:true,
        // top:top,
        render: h => {
            var count={};
            count[code]=time;
            let timerflag= setInterval(function () {
            if (count[code] > 0) {
                count[code]--;
                // console.log(count);
                tipDom.length>0?tipDom[0].innerHTML='  ('+count[code]+')':'';
            } else {
                clearInterval(timerflag); //清除计时器
            }
            }, 1000);
            return h('span', [
            content,
            h('a', {
                class:'messageA'+code,
                domProps:{
                innerHTML:'  ('+count[code]+')',
                }
            }),
            ])
        }
    });
}
export default errorMessage;