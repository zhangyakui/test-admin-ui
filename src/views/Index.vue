<template>
  <div class="index">
    <el-container class="main">
      <el-aside>
        <button @click="$router.push('/user/account')">user page</button>
      </el-aside>
      <el-container class="content">
        <el-header>Header</el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
   
    




  </div>
</template>

<script>
export default {

}
</script>

<style>
  .index{
    height: 100%;
  }

  .main{
    display: flex;
    flex-direction: row;
    height: 100%;
  }

  .el-aside {
    background-color: #515a6e;
    text-align: center;
    width: 200px !important;
    padding: 5px;
  }

  .content{
    flex: 1;
  }

  .el-header{
    background-color: #ffffff;
    text-align: center;
    height: 50px  !important;
    line-height: 50px !important;
    width: 100% !important;
    padding: 0 8px;
  }

  .el-main {
    background-color: #e9eaec;
    text-align: center;
    height: calc(100% - 50px);
    padding: 8px;
  }


</style>