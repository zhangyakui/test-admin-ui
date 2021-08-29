<template>
  <div class="index">
    <el-container class="main">
      <!-- 左 侧边栏 -->
      <el-aside>
        <p class="aside-title">楠楠传媒后台 v1.0</p>
        <el-menu
        default-active="wellcome"
        background-color="#304156"
        text-color="#FFFFFF"
        router
        unique-opened
        >
          <el-submenu 
          :index="category.path"
          v-for="(category, index) in menuInfo.menus" :key="index"
          >
            <template slot="title">
              <i :class="category.meta.icon"></i>
              <span>{{category.meta.title}}</span>
            </template>
            <el-menu-item 
            v-for="(menu, idx) in category.children" :key="idx"
            :class="menu.meta.icon" 
            :index="menu.path"
            >
            {{menu.meta.title}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 右 内容 -->
      <el-container class="content">
        <!-- 导航栏 -->
        <el-header>Header</el-header>
        <!-- 快捷方式 -->
        <div class="quick">快捷区域</div>
        <!-- 页面 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
   
  </div>
</template>

<script>
export default {
  data(){
    return {
      userInfo: this.$store.getters.getUserInfo,
      deptInfo: this.$store.getters.getDeptInfo,
      roleInfo: this.$store.getters.getRoleInfo,
      menuInfo: this.$store.getters.getMenuInfo
    }
  }


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
    background-color: rgba(144, 147, 147, .1);
  }

  .el-aside {
    background-color: #304156;
    text-align: center;
    width: 220px !important;
  }

  .el-menu{
    border: 0px !important;
    text-align: left;
    color: #FFFFFF;
  }

  .aside-title{
    color: #FFFFFF;
    font-size: 20px;
    height: 50px;
    line-height: 50px;
  }

  .content{
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .el-header{
    background-color: #ffffff;
    text-align: center;
    height: 50px  !important;
    line-height: 50px !important;
    width: 100% !important;
    padding: 0 8px;
  }

  .quick{
    padding: 8px;
    background-color: rgba(255, 255, 255, .5);
    margin: 8px 8px 0px 8px;
  }

  .el-main {
    text-align: center;
    flex: 1;
    padding: 8px !important;
  }


</style>