<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>Accounts Manage</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <Row>
        <Col>
        <Row>
          <!-- <Select v-model="searchGroup.code" style="width:200px" label-in-value @on-change="searchGroupChange">
            <Option v-for="(item,index) in groupList" :value="item.value" :key="index">{{ item.label }}</Option>
          </Select>
          <Select v-model="searchAppId" clearable style="width:200px" placeholder="请选择编号" clearable>
            <Option v-for="(item,index) in appIdList" :value="item.value" :key="index">{{ item.label }}</Option>
          </Select> -->
           <Input v-model="searchGroup.userId" clearable placeholder="search userId" style="width: 200px" />
            <Input v-model="searchGroup.name" clearable  placeholder="search name" style="width: 200px" />

          <Button type="primary" @click="search" style="margin-left: 30px">search</Button>
          
        </Row>

        <Table border stripe :columns="tablecolumns" :data="tabledata" style="margin-top: 35px" ref="table"></Table>
        <!-- nore modal -->
        <Modal v-model="appDetail" class-name="vertical-center-modal" :styles="{top: '100px'}" width="400px" @on-visible-change="modalState">
          <p slot="header" style="text-align:center">
            <span>APP详情</span>
          </p>
          <div v-if="!enableEditDetail">
            <div class="detail">
              <span>userId：</span>
              {{editDetailInfo.userId}}
            </div>
            <div class="detail">
              <span>name：</span>
              {{editDetailInfo.name}}
            </div>
            <div class="detail">
              <span>sex：</span>
              {{editDetailInfo.sex}}
            </div>
            <div class="detail">
              <span>age： </span>
                {{editDetailInfo.age}}
            </div>
            <div class="detail">
              <span>time：</span>
              {{editDetailInfo.time}}
            </div>
            <div class="detail">
              <span>I P：</span>
              {{editDetailInfo.ip}}
            </div>
            <div class="detail">
              <span>description：</span>
              {{editDetailInfo.descp}}
            </div>
          </div>
          <div v-else>
            <Form ref="form" :model="editDetailInfo" :rules="ruleValidate" :label-width="80">
              <FormItem label="userId" prop="userId">
                <Input v-model="editDetailInfo.userId" disabled placeholder="userId" style="width:200px" />
              </FormItem>
             
              <FormItem label="name" prop="name">
                <Input v-model="editDetailInfo.name" style="width:200px" />
              </FormItem>
              <FormItem label="age" prop="age">
                <Input v-model="editDetailInfo.age" style="width:200px" />
              </FormItem>
              <FormItem label="sex" prop="sex">
                <RadioGroup v-model="editDetailInfo.sex">
                  <Radio label="male">male</Radio>
                  <Radio label="female">female</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="description" prop="descp">
                <Input v-model="editDetailInfo.descp" type="textarea" clearable placeholder="APP描述" style="width:200px;height:50px" />
              </FormItem>
            </Form>
            
          </div>
          <div slot="footer">
            <Button v-show="!enableEditDetail" type="info" size="large" @click="enableEdit">edit</Button>
            <Button v-show="enableEditDetail" type="success" size="large" @click="saveEdit" :loading="appDetailLoading">save</Button>
          </div>
        </Modal>
        <!-- delete modal -->
        <Modal v-model="appDel" title="DELETE CONFIRM" class-name="vertical-center-modal" :styles="{top: '150px'}" width="350px">
          <p slot="header" style="color:#f60;text-align:center">
            <Icon type="information-circled"></Icon>
            <span>DELETE CONFIRM</span>
          </p>
          <div style="text-align:center">
            <p>you are deleting the information of
              <span style="color:red;font-weight:700;font-size:14px;"> userID:[{{rowInfo.userId}}]</span></p>
            <p>are you sure</p>
          </div>
          <div slot="footer">
            <Button type="error" size="large" long :loading="modal_loading" @click="handleDel">DELETE</Button>
          </div>
        </Modal>
        </Col>
      </Row>
      <Page :total="totalNum" :page-size="pageSize" :current="currentIndex" @on-change="changepage" @on-page-size-change="changepagesize" show-total show-elevator show-sizer class-name="page" style="width: 100%;text-align: right;margin-top: 10px"></Page>
    </div>
  </div>

</template>

<script>
  import canEditTable from './components/canEditTable.vue';
  import groupChangeAppId from'./components/groupChangeAppId.js';
  import errorMessage from './components/errorMessage.js'

  export default {
    name: 'editable-table',
    components: {
      canEditTable
    },
    data() {
      return {
        userId:this.$store.state.userId||'',
        //        表格总数据的行数 (tableの行数)
        totalNum: 0,
        //        每页数量(pageSize)
        pageSize: 10,
        //        当前页码(今のぺーじnumber)
        currentIndex: 1,
       
        editDetailInfo: {
          id: '',
          appId: '',
          appKey: '',
          groupCode: '',
          gid:'',
          flag: '',
          args: {},
          descp: ''
        },
        appDetail: false,
        enableEditDetail: false,
        appDetailLoading: false,
        addApp: false,
        searchGroup:{'userId':'','name':''},
        searchAppId: "",
        //        表格所有原始数据，直接跟数据库关联(all data)
        initdata: [],
        //        表格所有需要展示的数据，主要是搜索那里跟initdata有所区别，其余情况跟initdata相等(show data)
        pagedata: [],
        tablecolumns: [
          {
            title: 'UserId',
            align: 'center',
            key: 'userId',
            // width:200,
          },
          {
            title: 'Name',
            align: 'center',
            key: 'name',
            // width:150,
          },
          {
            title: 'Sex',
            align: 'center',
            key: 'sex',
            // minWidth: 130
          },
          {
            title: 'Age',
            align: 'center',
            key: 'age',
            // minWidth: 130
          },
          {
            title: 'Action',
            align: 'center',
            key: 'handle',
            width: 200,
            render: (h, params) => {
              // if(this.userId=='root'){
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'info',
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      'click': () => {
                        this.handleView(params.row)
                      }
                    }
                  }, 'MORE'), 
                  h('Button', {
                    props: {
                      type:'error',
                    },
                    on: {
                      'click': () => {
                        this.showAppDel(params.row)
                      }
                    },
                    style:{
                        margin:'0 5px'
                      }
                  },'DELETE')
                ]);
              // }else{
              //   return h('div', [
              //     h('Button', {
              //       props: {
              //         type: 'info',
              //       },
              //       style: {
              //         marginRight: '5px'
              //       },
              //       on: {
              //         'click': () => {
              //           this.handleView(params.row)
              //         }
              //       }
              //     }, '详情'),
              //   ]);
              // }
            }
          }
        ],
        //        当前展示数据(show data )
        tabledata: [],
        ruleValidate: {
          appId: [{
            type: "string",
            required: true,
            pattern: /^[a-zA-Z0-9_]{3,16}$/i, //  /i-忽略大小写
            message: "包含英文、数字或下划线的3-16位字符",
            trigger: 'blur'
          }],
           appKey: [{
            type: "string",
            required: true,
            pattern: /^[a-zA-Z][a-zA-Z0-9_]{1,64}$/i, //  /i-忽略大小写
            message: "英文开头，包含数字或下划线的1-64位字符",
            trigger: 'blur'
          }],
          gid: [{
            required: true,
            message: '请输入场景ID',
            trigger: 'blur'
          }],
          flag: [{
            required: true,
            message: '请选择入/出口',
            trigger: 'blur'
          }],
          args: [{
            required: true,
            message: 'APP运行参数',
            // trigger: 'blur',
            type: "object",
          }],
          descp: [{  //小于100个字符
            required: false,
            message: '请输入描述',
            trigger: 'blur',
            type: "string",
          }],
          groupCode: [{ 
            required: true,
            message: '请输入描述',
            trigger: 'blur',
            type: "string",
          }],
        },
        groupList: [
        ],
        appIdList:[],
        appDel:false,
        rowInfo:{},
        modal_loading:false,
        // 改变分组时暂存分组label-点击搜索后赋值给当前searchGroup.name
        searchGroupName:'',
      }
    },
    methods: {
      // 当前分组改变时
      // searchGroupChange(val){
      //   this.searchGroupName=val.label;
      // },
      // // 生成密钥
      // uuid(len, radix) {
      //   var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
      //   var uuid = [], i;
      //   radix = radix || chars.length;
    
      //   if (len) {
      //     // Compact form
      //     for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
      //   } else {
      //     // rfc4122, version 4 form
      //     var r;
    
      //     // rfc4122 requires these characters
      //     uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      //     uuid[14] = '4';
    
      //     // Fill in random data.  At i==19 set the high bits of clock sequence as
      //     // per rfc4122, sec. 4.1.5
      //     for (i = 0; i < 36; i++) {
      //       if (!uuid[i]) {
      //         r = 0 | Math.random()*16;
      //         uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      //       }
      //     }
      //   }
 
      //     return uuid.join('');
      // },
      // 详情 detail
      handleView(val) {
        console.log(val);
        this.appDetail = true;
        this.editDetailInfo = obCopy(val);
      },
      // 显示删除确认对话框 delete modal
      showAppDel(val){
        // val 时当前单元格数据
        console.log(val);
        this.appDel = true;
        this.rowInfo = val;
      },
      // 删除行 delete confirmed
      handleDel() {
        // console.log(this.rowInfo);
        this.modal_loading = true; 
        //  删除成功，关闭modal重新初始化表格显示
        this.modal_loading = false;
        this.appDel = false;
        this.$Message.success('delete success');
        this.initTableData();
        this.appIdList=[];
        this.rowInfo = '';
        // groupChangeAppId(this.appIdList,this.searchGroup.code);
        // this.$axios.delete('/groups/'+this.searchGroup.code+'/apps/'+this.rowInfo.appId).then((res)=>{  
        //   // console.log(res);
        //   if(res.data.rtcode==200){
        //     // 删除成功，关闭modal重新初始化表格显示
        //     this.modal_loading = false;
        //     this.appDel = false;
        //     this.rowInfo = '';
        //     this.$Message.success('删除成功');
        //     this.initTableData();
        //     this.appIdList=[];
        //     groupChangeAppId(this.appIdList,this.searchGroup.code);
        //   }else{
        //   // 调用封装的错误提示
        //   errorMessage(5,res.data.result,this.rowInfo.appId);
        //   this.modal_loading = false;
        //   this.appDel = false;
        //   this.rowInfo = '';
        //   }
          
        // }).catch(err=>{
        //   this.modal_loading = false;
        //   this.appDel = false;
        //   this.rowInfo = '';
        //   // console.log(err);
        //   // this.$Message.error('删除APP出错啦~~~');
        // });
        // for (let i = 0; i < this.initdata.length; i++) {
        //   if (this.initdata[i].id === val.id) {
        //     this.initdata.splice(i, 1)
        //   }
        // }
        // for (let j = 0; j < this.pagedata.length; j++) {
        //   if (this.pagedata[j].id === val.id) {
        //     this.pagedata.splice(j, 1)
        //   }
        // }
        // this.totalNum = this.pagedata.length;
        // this.tabledata = this.pagedata.slice((this.currentIndex - 1) * this.pageSize, this.currentIndex * this.pageSize);
      },
      // 初始化表格数据 init table data
      initTableData(){
        this.initdata=[];
        for (let i = 0; i < 500; i++) {
          this.initdata.push({
            userId: "00" + i,
            name: i % 3 == 0 ? "john" : "lily",
            sex: i % 3 == 0 ? "male" : "female",
            age:i+20,
            time:this.$moment().format('YYYY-MM-DD HH:mm:ss'),
            ip:'xxx.xxx.xxx.xxx',
            descp:'this is description!this is description!this is description!this is description!this is description!'
          });
        }
        this.pagedata=this.initdata;
        this.totalNum=this.initdata.length;
        // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
          if (this.totalNum < this.pageSize) {
            this.tabledata = this.initdata;
          } else {
            this.tabledata = this.initdata.slice((this.currentIndex-1)*this.pageSize, this.currentIndex*this.pageSize);
          }
      //   this.$axios.get('groups/'+this.searchGroup.code+'/apps'
      //   ,{
      //     params:{
      //       appId:this.searchAppId,
      //       pageIndex:this.currentIndex,
      //       pageSize:this.pageSize
      //     }
      //   }
      // ).then(res => {
      //     console.log(res);
      //     if(res.data.rtcode == 200){
      //       this.tabledata=[];
      //       let resinfo = res.data.result;
      //       let tmpdata = resinfo.list;
      //       for(let i=0;i<tmpdata.length;i++){
      //         let jsonArgs;
      //         if(tmpdata[i].args==""){
      //           jsonArgs={
      //             search_bluetooth_overtime:'5',
      //             facerecog_interval:'2',
      //             oneperson_facerecog_interval:'5',
      //             app_start_node:'自动开启',
      //             app_start_time:'06:00',
      //             app_end_time:'23:59',
      //           }
      //         }else{
      //           jsonArgs=eval("("+tmpdata[i].args+")");
      //           console.log(jsonArgs);

      //         };
      //         this.tabledata.push({
      //           "appId":tmpdata[i].appId,
      //           "descp":tmpdata[i].descp,
      //           "flag":tmpdata[i].flag==0 ? '入口' : '出口',
      //           // id: '',
      //           "appKey": tmpdata[i].appKey,
      //           "gid": tmpdata[i].gid,
      //           "groupCode": tmpdata[i].groupCode,
      //           "args": jsonArgs,
      //           "argsText":jsonArgs.app_start_node==1?'自动开启':'不开启',
      //         });
      //         // console.log(this.tabledata);

      //       }
      //       this.pageSize = resinfo.pageSize;
      //       this.totalNum = resinfo.total;
      //       }else{
      //         // 调用封装的错误提示
      //         errorMessage(5,res.data.result,this.searchGroup.code);
      //       }
      //     }).catch(err=>{
      //       console.log(err);
      //       this.$Message.error('表格初始化出错啦~~~');
      //       });
      },
      // 初始化页面
      init() {
        this.initTableData();
        // 查询职场，获取职场信息填充选择职场

        // 如果当前用户未加入任何职场则查询结果为空
        let userId = this.$store.state.userId;
        // this.$axios.get('users/'+userId+'/groups').then((res)=> {
        //   // console.log(res);
        //   if(res.data.rtcode==200){ //返回200则请求成功
        //     let tmpdata = res.data.result.list;
        //     this.searchGroup.code=tmpdata[0].code;
        //     this.searchGroup.name=tmpdata[0].name;
        //     this.newApp.gid=tmpdata[0].code;
        //     for(let i=0;i<tmpdata.length;i++){
        //       this.groupList.push({
        //         value:tmpdata[i].code,
        //         label:tmpdata[i].name
        //       })
        //     };
        //     // 职场获取成功后-查询APP信息，填充列表
        //     this.initTableData();

        //   }else{
        //     this.$Message.error({
        //       content:res.data.result,
        //       duration:5,
        //       closable:true,
        //     });
        //   };
        // }).catch(err=>{
        //   // console.log(err);
        //   this.$Message.error('账号职场获取失败~~~');
        //   });

        
      },
      // 改变当前显示页码 
      changepage(index) {
        // index 为改变后的页码
        this.currentIndex = index;
        this.initTableData();
      },
      // 更改每页显示条数
      changepagesize(pagesize) {
        this.currentIndex=1;
        this.pageSize = pagesize;
        this.initTableData();
      },
       // 查询 search 
      search(){ 
        this.$Message.info(' click search button');
        // this.currentIndex=1;
        // this.initTableData(); 
        // if(this.searchGroupName!=''){
        //   this.searchGroup.name=this.searchGroupName;
        //   this.searchGroupName='';
        // }   
      },
      // 详情模态框不可修改 編集できない
      modalState(val) {
        if (!val) {
          this.enableEditDetail = false;
        }
      },
      // 详情模态框可修改　編集できます
      enableEdit() {
        this.enableEditDetail = true;
      },
      // 保存编辑　編集保存
      saveEdit() {
        // 判断是否编辑　変更するか判断
        if (!this.enableEditDetail) {
          this.appDetail = false;
          return false;
        }
        this.appDetailLoading = true;
        this.appDetailLoading = false;
        this.appDetail = false;
        this.$Message.success('save edit successed');
        this.initTableData();
        // this.$axios.patch('/groups/'+this.searchGroup.code+'/apps/'+this.editDetailInfo.appId,{
        //   // appKey:this.editDetailInfo.appKey,
        //   // gid:this.editDetailInfo.gid, 
        //   "flag":this.editDetailInfo.flag=="出口"?'1':'0',
        //   "args":JSON.stringify(this.editDetailInfo.args),
        //   "descp":this.editDetailInfo.descp,
        // }).then(res=>{
        //   // console.log(res);
        //   if(res.data.rtcode==200){ 
        //     this.appDetailLoading = false;
        //     this.appDetail = false;
        //     this.$Message.success('修改成功');
        //     this.initTableData();
        //   }else{
        //     this.appDetailLoading = false;
        //     // 调用封装的错误提示
        //     errorMessage(5,res.data.result,this.editDetailInfo.appId);
            
        //   }
        // }).catch(err=>{
        //   // console.log(err);
        //   // this.$Message.error('保存编辑失败~~~');
        //   }) 
      }
    },
    watch: {
      // 监听searchGroup变化更改对应职场下的appIdList
      searchGroup:{
        handler:function(){
          this.searchAppId='';
          this.appIdList=[];
          // 职场获取成功后-获取该职场下的APP编号，填充搜索列表
          groupChangeAppId(this.appIdList,this.searchGroup.code);
        },
        deep:true,
      }
      // totalNum: function () {
      //   return this.pagedata.length
      // },
    },
    computed: {
      //      totalNum() {
      //        return this.initdata.length
      //      },
      //      initdata () {
      //        return this.groupdata
      //      }
    },
    created() {
      this.init();
    },
    mounted() {
      //      console.log("groupdata: ", this.tabledata);
    }
  }

</script>

<style scoped>
  .detail {
    width: 100%;
    margin: 0 0 10px 15px;
    font-size: 15px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

</style>
