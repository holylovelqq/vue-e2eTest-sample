<template>
    <div class="header">
        <div class="collapse-btn">
            <img @click="collapseChage" src="../../assets/img.jpg" alt="">
        </div>
        <div class="logo">information system</div>
        <div class="user-info">
            <!--trigger="click" 则需要点击才会下拉菜单，默认是hover-->
            <el-dropdown  @command="handleCommand">
                <span class="el-dropdown-link">
                    <img class="user-logo" src="../../assets/img.jpg">
                    {{name}}
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="loginout">logout</el-dropdown-item>
                    <el-dropdown-item command="changepwd">changepwd</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <Modal v-model="pwdchange" title="changePWD" @on-ok="ok('form')" @on-cancel="cancel" class-name="vertical-center-modal" :styles="{top: '150px'}" width="350px">
            <Form ref="form" :model="password" :rules="ruleInline" :label-width="80">
              <FormItem label="oldPWD" prop="oldpwd">
                <Input v-model="password.oldpwd" placeholder="oldPWD" clearable style="width: 200px" />
              </FormItem>
              <FormItem label="newPWD" prop="newpwd">
                <Input v-model="password.newpwd" placeholder="newPWD" clearable style="width: 200px" />
              </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                name: this.$store.state.userId,
                pwdchange:false,
                password:{
                    oldpwd:'',
                    newpwd:'',
                },
                ruleInline: {
                    oldpwd: [{
                        required: true,
                        message:'please enter old pawssword'
                    }],
                    newpwd: [{
                        required: true,
                        pattern: /[A-Za-z0-9_]{6,16}/g,
                        message: 'the length of new password >5&<17',
                        trigger: 'blur'
                    }],
                },
            }
        },
        computed:{
            username(){
                let username = sessionStorage.getItem('username');
                return username ? username : this.name;
            }
        },
        methods:{
            handleCommand(command) {
                if(command == 'loginout'){

                    this.$store.commit('logoutDeal');
                    this.$router.push('/login');

                }
                if(command=='changepwd'){
                    this.pwdchange=true;
                }

            },
            // changeButton 押して
            ok(name){
                this.$refs[name].validate((valid) => {
                        // console.log(valid);
                    if (valid) {
                        //post请求 
                        let userId=this.$store.state.userId;
                        this.$Message.success('change successed');
                        this.password.oldpwd='';
                        this.password.newpwd='';
                        // this.$axios.patch('users/'+userId+'/password',{
                        //     userId:userId,
                        //     oldPasswd:this.password.oldpwd,
                        //     newPasswd:this.password.newpwd,
                        // }).then(res=>{
                        //     console.log(res);
                        //     if(res.data.rtcode==200){
                        //         this.$Message.success('change successed');
                        //         this.password.oldpwd='';
                        //         this.password.newpwd='';
                        //     }else{
                        //         this.$Message.error(res.data.result);
                        //         this.password.oldpwd='';
                        //         this.password.newpwd='';
                        //     }

                        // }).catch(error=>{
                        //     this.$Message.error('change failed');
                        //     this.password.oldpwd='';
                        //     this.password.newpwd='';
                        //     });
                        
                    }else{
                        this.$Message.error('can not recognize the password');
                        return false;
                    }
                })
            },
            cancel(){
                this.pwdchange=false;
            },
            collapseChage(){
                this.collapse = !this.collapse;
                bus.$emit('collapse', this.collapse);
            }
        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        line-height: 70px;
        color: #fff;
    }
    .collapse-btn{
        float: left;
        padding: 0 21px;
        cursor: pointer;
    }
    .collapse-btn img{
        vertical-align: middle;
        height: 70px;
    }
    .collapse-btn:hover{
        background: rgb(40,52,70);
    }
    .header .logo{
        float: left;
        width:250px;
        /* text-align: center; */
    }
    .user-info {
        float: right;
        padding-right: 50px;
        font-size: 16px;
        color: #fff;
    }
    .user-info .el-dropdown-link{
        position: relative;
        display: inline-block;
        padding-left: 50px;
        color: #fff;
        cursor: pointer;
        vertical-align: middle;
        height: 70px;
    }
    .user-info .user-logo{
        position: absolute;
        left:0;
        top:15px;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
</style>
