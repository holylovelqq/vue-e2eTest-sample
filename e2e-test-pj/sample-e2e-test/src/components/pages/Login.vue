<template>
  <div class="login-wrap">
    <div class="ms-title">Information System</div>
    <Tabs value="login">
        <TabPane label="Login" name="login">
          <!-- 标签一的内容 -->
          <div class="ms-login">
            <Form ref="formInline" :model="formInline" :rules="ruleInline">
              <FormItem prop="user">
                <Input type="text" v-model="formInline.user" placeholder="userId">
                  <Icon type="ios-person-outline" slot="prepend"></Icon>
                </Input>
              </FormItem>
              <FormItem prop="password">
                <Input type="password" v-model="formInline.password" placeholder="password" @on-enter="handleSubmit('formInline')">
                  <Icon type="ios-lock-outline" slot="prepend"></Icon>
                </Input>
              </FormItem>
              <FormItem>
                <Button type="primary" @click="handleSubmit('formInline')" style="width: 100%">login</Button>
              </FormItem>
            </Form>
          </div>
        </TabPane>
        <TabPane label="Sign In" name="signin">
          <!-- 标签二的内容 -->
          <div class="ms-login">
            <Form ref="formInline" :model="formInline" :rules="ruleInline">
              <FormItem prop="user">
                <Input type="text" v-model="formInline.user" placeholder="userId">
                  <Icon type="ios-person-outline" slot="prepend"></Icon>
                </Input>
              </FormItem>
              <FormItem prop="password">
                <Input type="password" v-model="formInline.password" placeholder="password" @on-enter="handleRegiste('formInline')">
                  <Icon type="ios-lock-outline" slot="prepend"></Icon>
                </Input>
              </FormItem>
                <Button type="primary" @click="handleRegiste('formInline')" style="width: 100%">Sign In</Button>
              </FormItem>
 
            </Form>
          </div>
        </TabPane>
    </Tabs>
  </div>
</template>

<script>
  import errorMessage from './components/errorMessage.js'
  export default {
    data() {
      return {
        formInline: {
          user: '',
          password: ''
        },
        ruleInline: {
          user: [{
            required: true,
            message: 'please enter userName',
            trigger: 'blur'
          }],
          password: [{
              required: true,
              message: 'please enter password',
              trigger: 'blur'
            },
            {
              type: 'string',
              min: 6,
              message: 'password length >5',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            console.log('1');
            let userid=this.formInline.user;
            let pwd=this.formInline.password;
            if(userid=='admin'&&pwd==123456||userid=='user'&&pwd==123456){
              this.$store.commit('storeUserId',userid);
              this.$router.push('/infos');
              this.$Message.success('login successed');
            }else{
              this.$Message.error('login failed');
            }

            // this.$axios.post("token", {
            //   "userId": userid,
            //   "passwd": this.formInline.password,
            // }).then(res => {
            //   console.log(res);
            //   // let username = response.data.result.name;
            //   // console.log("username: ", username);
            //   // this.$store.commit("login", {userId: this.formInline.user, name: username});
            //   if(res.data.rtcode==200){
            //     this.$store.commit('storeUserId',userid);
            //     this.$store.commit('storeToken', res.data.result);
            //     let redirect = decodeURIComponent(this.$route.query.redirect || '/overview');
            //     this.$router.push({
            //       path: redirect
            //     })
            //     // this.$router.push('/overview');
            //     this.$Message.success('登录成功');
            //   }else{
            //     // 调用封装的错误提示
            //     errorMessage(5,res.data.result,userid);
            //   }
            // }, err => {
            //   this.$Message.error('登录失败');
            //   return false;
            // })
          } else {
            // this.$Message.error('登录失败');
            return false;
          }
        })
        this.formInline.user='';
        this.formInline.password='';
      },
      handleRegiste(name){
        this.$refs[name].validate((valid) => {
          if (valid) {
            console.log('1');
            let userid=this.formInline.user;
            let pwd=this.formInline.password;
            if(userid==''&&pwd==''){
              this.$Message.error('sign in failed');
            }else{
              this.$store.commit('storeUserId',userid);
              this.$router.push('/infos');
              this.$Message.success('sign in successed');
            }
          }else{
            this.$Message.error('sign in failed');
          }
        })
        this.formInline.user='';
        this.formInline.password='';
      }

    }
  }

</script>
<style scoped>
  .login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .ms-title {
    position: absolute;
    top: 50%;
    left:0;
    width: 100%;
    margin-top: -230px;
    text-align: center;
    font-size: 30px;
    color: #fff;
  }

  .ms-login {
    /* margin-top: -50px; */
    width: 330px;
    height: 240px;
    padding: 40px;
    border-radius: 5px;
    background: #fff;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .login-wrap .ivu-tabs{
    background-color:#f9f9f9;
    border-radius: 5px;
    width: 330px;
  }

  .login-btn {
    text-align: center;
  }

  .login-btn button {
    width: 100%;
    height: 36px;
  }
  /* 以下为iview.css内修改内容，此处不能覆盖 */
  /* .login-wrap .ivu-tabs .ivu-tabs-bar{
    margin-bottom:0;
  }
  .login-wrap .ivu-tabs-nav{
    width: 100%
  }
  .login-wrap .ivu-tabs .ivu-tabs-nav .ivu-tabs-tab{
    width: 50%;
    text-align: center;
    margin-right: 0;
  } */
</style>
