<template>
  <div>
    <!-- <img src="../../../static/img/tkdp_logo.png" alt=""> -->
    <h1 class="top">ERROR，this page do not founded or permission denied</h1>
    <h1 class="bottom">no more detail information</h1>
    <router-link :to="{path:'/infos'}">back to home page</router-link>
  </div>
</template>
<script>


</script>
<style scoped>
  div {
    height: 100%;
    width: 100%;
    padding-top: 80px;
    background-color: rgba(220, 242, 243);
  }
  img{
    display: block;
    margin: 0 auto;
  }

  h1 {
    text-align: center;
    margin-bottom: 30px;
    color: red;
  }
  .top{
      margin-top: 80px;
  }
  a {
    font-size: 20px;
    display: block;
    text-align: center;
    font-weight: 700;
  }

</style>
