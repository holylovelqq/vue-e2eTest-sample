<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>informations show</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <Row>
        <Col>
        <Row>
          <Input v-model="searchGroupCode" clearable icon="search" @on-change="handleSearch" placeholder="search ID" style="width: 200px" />
          <Button v-if="userId=='admin'" type="primary" @click="addgroup = true" style="    margin-right: 40px;float: right;">add information
            <Icon type='plus' size="12" color="white" />
          </Button>
          <Modal v-model="addgroup" title="add" @on-ok="ok('form')" @on-cancel="cancel" width="350px" :styles="{top: '200px'}" class-name="vertical-center-modal">

            <Form ref="form" :model="newGroup" :rules="ruleValidate" :label-width="80">
              <FormItem label="ID" prop="groupcode">
                <Input v-model="newGroup.groupcode" clearable placeholder="ID" />
              </FormItem>
              <FormItem label="Title" prop="groupname">
                <Input v-model="newGroup.groupname" clearable placeholder="title" />
              </FormItem>
              <FormItem label="description" prop="groupdesc">
                <Input v-model="newGroup.groupdesc" clearable placeholder="description" />
              </FormItem>
            </Form>
          </Modal>
        </Row>

        <can-edit-table refs="table1" v-model="tabledata" :columns-list="tablecolumns" @on-delete="handleDel" @on-change="handelUpdate"
          style="margin-top: 35px"></can-edit-table>

        </Col>

      </Row>
      <Page :total="totalNum" :page-size="pageSize" :current="currentIndex" @on-change="changepage" show-total show-elevator style="width: 100%;text-align: right;margin-top: 10px"></Page>
    </div>
  </div>

</template>

<script>
  import bus from '../common/bus'
  import canEditTable from './components/canEditTable.vue';
  import errorMessage from './components/errorMessage.js'
  
  export default {
    name: 'editable-table',
    components: {
      canEditTable
    },
    data() {
      return {
        userId:this.$store.state.userId||'',
        //        initdata.length tableの行数
        totalNum: 0,
        //        pageSize
        pageSize: 10,
        //        今のぺーじnumber
        currentIndex: 1,
        // add infos
        newGroup: {
          groupname: '',
          groupcode: '',
          groupdesc: ''
        },
        addgroup: false,
        searchGroupCode: "",
        //        表格所有原始数据，直接跟数据库关联（all data）
        initdata: [],
        //        表格所有需要展示的数据，主要是搜索那里跟initdata有所区别，其余情况跟initdata相等(show data)
        pagedata: [],
        //当前展示数据(show data)
        tabledata: [],
        // 添加职场模态框输入规则(rule of add)
        ruleValidate: {
          groupcode: [{
            required: true,
            message: 'pleaser enter ID',
            trigger: 'blur',
            pattern:/[0-9]/,
            // pattern:/^[0-9a-zA-Z_]{3,16}$/,
          }, ],
          groupname: [{
            required: true,
            message: 'please enter a title',
            trigger: 'blur',
            min:1,
            max:30,
          }],
          groupdesc: [{
            required: false,
            message: 'please enter description',
            trigger: 'blur'
          }]
        },
        count:5,
      }
    },
    methods: {
      // 点击id跳转到详情页面( click to detailPage )
      handleView(val){
        this.$router.push({ name: 'detailinfo', params: { id: val.id }});
      },
      // 添加职场( add )
      ok(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            // 优先判断职场编码和名称是否与现有的重复
            for(let i=0;i<this.tabledata.length;i++){
              if(this.newGroup.groupcode==this.tabledata[i].code||this.newGroup.groupname==this.tabledata[i].name){
                this.$Message.error('职场编码或名称不能重复');
                return;
              }
            }
            this.$Message.info('add successed');
            this.newGroup={groupname: '',groupcode: '',groupdesc: '' };
            //发送post请求，成功后
            // this.$axios.post('users/'+this.userId+'/groups',{
            //   "code":this.newGroup.groupcode,
            //   "name":this.newGroup.groupname,
            //   "descp":this.newGroup.groupdesc
            // }).then(res=>{
            //   // console.log(res);
            //   if(res.data.rtcode==200){
            //     this.init();
            //     this.$Message.info('添加职场成功');
            //     this.newGroup={groupname: '',groupcode: '',groupdesc: '' };
            //   }else{
            //     this.newGroup={groupname: '',groupcode: '',groupdesc: '' };
            //     errorMessage(5,res.data.result,this.newGroup.groupcode);
            //   }
            // }).catch(err=>{
            //   // console.log(err);
            //   this.$Message.error('添加职场出错啦~~~');
            //   this.newGroup={groupname: '',groupcode: '',groupdesc: '' };
            // });
          } else {
            this.$Message.error('add failed');
            return false;
          }
        })
      },
      cancel() {
        this.newGroup={groupname: '',groupcode: '',groupdesc: '' };
      },
      // 编辑
      handelUpdate(vm, val) {
        this.$Message.success('edit successed');
        this.init();
        // console.log(val);
        // this.$axios.patch('groups/'+val.code,{
        //   "name":val.name,
        //   "descp":val.descp
        // }).then(res=>{
        //   // console.log(res);
        //   if(res.data.result==1){
        //     // 编辑成功
        //     this.$Message.success('编辑成功');
        //     this.init();
        //   }else{
        //     errorMessage(5,res.data.result,val.code);
        //   }
        // }).catch(
        //   err=>{
        //     // console.log(err);
        //     this.$Message.error('编辑职场出错啦~~~');
        //   })

        //       //  val是一个对象，就行元素
        // for (let i = 0; i < this.initdata.length; i++) {
        //   if (this.initdata[i].code === val.code) {
        //     this.initdata[i] = val;
        //   }
        // }
        // for (let j = 0; j < this.initdata.length; j++) {
        //   if (this.pagedata[j].code === val.code) {
        //     this.pagedata[j] = val;
        //   }
        // }
      },
      // 删除(delete)
      handleDel(vm,val) {
        this.$Message.success('删除成功');
        this.init();
        // console.log(val);
        // //后台删除
        // this.$axios.delete('/users/'+this.userId+'/groups/'+val[0].code).then((res)=>{
        //   // console.log(res);
        //   if(res.data.result==1){
        //     // 删除成功，重新 初始化表格显示
        //     this.$Message.success('删除成功');
        //     this.init();
        //   }else{
        //     // 调用封装的方法
        //     errorMessage(5,res.data.result,val[0].code);
        //     // this.$Message.error({
        //     //   content:res.data.result,
        //     //   duration:0,
        //     //   closable:true,
        //     //   top:200,
        //     // })
        //     // this.$Message.error({
        //     //   content:res.data.result,
        //     //   duration:0,
        //     //   closable:true,
        //     //   // top:undefined,
        //     // })
        //   }
        // }).catch(err=>{console.log(err);this.$Message.error('删除职场出错啦~~~');});
      },
      init() {
        this.initdata=[];
        for(var i=1;i<=50;i++){
          this.initdata.push(
            {
              "id":"0"+i,
              "title":"title0"+i,
              "descp":"this is description 0"+i,
            }
          )
        };
        this.pagedata=this.initdata;
        this.totalNum=this.initdata.length;
        if (this.totalNum < this.pageSize) {
          this.tabledata = this.initdata;
        } else {
          this.tabledata = this.initdata.slice((this.currentIndex-1)*this.pageSize, this.currentIndex*this.pageSize);
        };

        this.$axios.get('http://172.16.75.170/api/incidents/').then((res)=>{
          console.log(res);
        })
        this.$axios.get('http://172.16.75.170/api/incidents/1/').then((res)=>{
          console.log(res);
        }).catch(err=>console.log(err));
      //   this.$axios.get('users/'+this.userId+'/groups').then((res)=> {
      //     console.log(res);
      //     if(res.data.rtcode==200){
      //       let tmpdata = res.data.result.list;
      //       this.initdata = tmpdata;
      //       this.pagedata = tmpdata;
      //       this.pageSize = res.data.result.pageSize;
      //       this.totalNum = res.data.result.total;
      //   // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
      //     if (this.totalNum < this.pageSize) {
      //       this.tabledata = tmpdata;
      //     } else {
      //       this.tabledata = this.initdata.slice(0, this.pageSize);
      //     }

      //     }else{
      //       this.$Message.error(res.data.result);
      //     };
      //   }).catch(err=>{
      //     // console.log(err);
      //     this.$Message.error('页面初始化出错啦~~~');
      //     });
      },
      // 改变页码
      changepage(index) {
        this.currentIndex = index;
        this.init();
      },
      // 改变每页显示条数
      // changepagesize(pagesize) {
      //   this.currentIndex=1;
      //   this.pageSize = pagesize;
      //   this.init();
      // },
      // 搜索框搜索逻辑
      handleSearch() {
        this.currentIndex = 1;
        if (this.searchGroupCode === "") {
          this.pagedata = [].concat(this.initdata);
          this.totalNum = this.pagedata.length;
          this.tabledata = this.pagedata.slice((this.currentIndex - 1) * this.pageSize, this.currentIndex * this.pageSize);
          return;
        }
        this.pagedata = this.search(this.initdata, {
          id: this.searchGroupCode //此处的key为搜索value在元数据中的key值
        });
        if (this.pagedata.length < this.pageSize) {
          this.tabledata = this.pagedata;
        } else {
          this.tabledata = this.pagedata.slice((this.currentIndex - 1) * this.pageSize, this.currentIndex * this.pageSize);
        }
        this.totalNum = this.pagedata.length;
      },
      search(data, argumentObj) {
        let res = data;
        let dataClone = data;
        for (let argu in argumentObj) {
          if (argumentObj[argu].length > 0) {
            res = dataClone.filter(d => {
              return d[argu].indexOf(argumentObj[argu]) > -1;
            });
            dataClone = res;
          }
        }
        return res;
      },
    },
    //    watch: {
    //      totalNum: function () {
    //        return this.pagedata.length
    //      },
    //    },
    computed: {
      tablecolumns(){
        if(this.$store.state.userId=='admin'){
          return [
          {
            title: 'ID',
            align: 'center',
            key: 'id',
            editable: false,
            width: 150,
             render: (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      // type: 'info',
                    },
                    // style: {
                    //   marginRight: '5px'
                    // },
                    on: {
                      'click': () => {
                        this.handleView(params.row)
                      }
                    }
                  },params.row.id), 
                ])
                }
          },
          {
            title: 'Title',
            align: 'center',
            key: 'title',
            editable: true,
            width: 200,
          },
          {
            title: 'Description',
            align: 'center',
            key: 'descp',
            editable: true,

          },
          {
            title: 'Action',
            align: 'center',
            key: 'handle',
            handle: ['edit', 'delete'],
            width: 200,
          }
        ];
        }else{
          return [
          {
            title: 'ID',
            align: 'center',
            key: 'id',
            editable: false,
            width: 150,
             render: (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      // type: 'info',
                    },
                    // style: {
                    //   marginRight: '5px'
                    // },
                    on: {
                      'click': () => {
                        this.handleView(params.row)
                      }
                    }
                  },params.row.id), 
                ])
                }
          },
          {
            title: 'Title',
            align: 'center',
            key: 'title',
            editable: true,
            width: 200,
          },
          {
            title: 'description',
            align: 'center',
            key: 'descp',
            editable: true,

          },
        ];
        }
      }
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


</style>
