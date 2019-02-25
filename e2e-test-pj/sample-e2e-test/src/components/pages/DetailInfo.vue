<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>detail information</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <Row>
        <Col>
        <Table border stripe :columns="tablecolumns" :data="tabledata" style="margin-top: 35px" ref="table"></Table>
        </Col>
      </Row>
      <Page :total="totalNum" :page-size="pageSize" :current="currentIndex" @on-change="changepage" show-total show-elevator style="width: 100%;text-align: right;margin-top: 10px"></Page>
    </div>
  </div>

</template>

<script>
export default {
  data() {
    return {
      userId: this.$store.state.userId || "",
      //        表格总数据的行数
      totalNum: 0,
      //        每页数量
      pageSize: 10,
      //        当前页码
      currentIndex: 1,
      pagedata: [],
      //当前展示数据
      tabledata: [],
      tablecolumns:[
          {
            title: "ID",
            align: "center",
            key: "id",
            editable: false,
            width: 150
          },
          {
            title: "Title",
            align: "center",
            key: "title",
            editable: true,
            width: 200
          },
          {
            title: "StartTime",
            align: "center",
            key: "stime",
            editable: true,
            width: 200
          },
          {
            title: "EndTime",
            align: "center",
            key: "etime",
            editable: true,
            width: 200
          },
          {
            title: "description",
            align: "center",
            key: "descp",
            editable: true
          }
        ],
    };
  },
  methods: {
    init() {
      // console.log(this.$route.params.id);
      let tempid=this.$route.params.id;
      this.tabledata=[{
        id: tempid,
        title: "title" +tempid,
        stime:this.$moment().format("YYYY-MM-DD HH:mm:ss"),
        etime:this.$moment().add(7,"days").format("YYYY-MM-DD HH:mm:ss"),
        descp: "this is description " + tempid,
      }]
      

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
    }
    // 改变每页显示条数
    // changepagesize(pagesize) {
    //   this.currentIndex=1;
    //   this.pageSize = pagesize;
    //   this.init();
    // },
  },
  //    watch: {
  //      totalNum: function () {
  //        return this.pagedata.length
  //      },
  //    },
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
};
</script>

<style scoped>
</style>
