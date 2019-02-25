import Vue from 'vue';
import errorMessage from './errorMessage.js'
// 功能：同步searchGroup和appIdList的对应,用在AppManage.vue组件下
// 参数：appIdList-必填，[],请在传值前清空appIdList然后传入函数
//      searchGroup-必填，当前选中的searchGroupId,基于此值查询对应的appIdList
// 返回值：无
function groupChangeAppId(appIdList,searchGroup){
  // 职场获取成功后-获取该职场下的APP编号，填充搜索列表
  Vue.prototype.$axios.get('groups/' + searchGroup + '/apps?pageSize=100').then(response => {
    // console.log(response);
    if (response.data.rtcode == 200) {
      let tmpdataappid = response.data.result.list;
      for (let i = 0; i < tmpdataappid.length; i++) {
        appIdList.push({
          "value": tmpdataappid[i].appId,
          "label": tmpdataappid[i].appId
        });
      }
      
    } else {
      // Vue.prototype.$Message.error(res.data.result);
      errorMessage(5,res.data.result,searchGroup);
    }
  }).catch(err => {
    console.log(err);
    // Vue.prototype.$Message.error('APPID获取失败~~~');
  })  
  // console.log(appIdList);
};
export default groupChangeAppId;