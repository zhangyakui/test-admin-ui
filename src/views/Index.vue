<template>
  <div class="index">
    <el-container class="main">
      <!-- 左 侧边栏 -->
      <el-aside>
        <el-menu
        class="el-menu-vertical-demo"
        :default-active="$route.path"
        background-color="#304156"
        text-color="#FFFFFF"
        router
        unique-opened
        :collapse="isClose"
        >
          <p class="aside-title">
            <span v-if="!isClose">楠楠传媒后台 v1.0</span>
            <span v-else>楠楠</span>
          </p>

          <el-submenu 
          :index="category.path == null ? '' : category.path"
          v-for="(category, index) in menuInfo.menus" :key="index"
          >
            <template slot="title">
              <!-- <i :class="category.meta.icon"></i> -->
              <i class="el-icon-eleme"></i>
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
        <el-header>
          <!-- 左侧 -->
          <div class="header-left">
            <!-- 收缩 -->
            <div class="header-left-icon">
              <i :class="[isClose == false ? 'el-icon-s-fold' : 'el-icon-s-unfold']" @click="isClose = !isClose"></i>
            </div>

            <!-- 面包屑 -->
            <div class="header-left-breadcrumb">
              <el-breadcrumb separator="/" style="display: inline-block;">
                <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
                <el-breadcrumb-item v-for="(title, index) in $store.getters.getRouterInfo[$route.path]" :key="index">
                  {{title}}
                </el-breadcrumb-item>
              </el-breadcrumb>
            </div>
          </div>
         
          <!-- 右侧 -->
          <div class="header-right">
            <!-- 用户 -->
            <el-dropdown trigger="click" @command="command">
              <span class="el-dropdown-link">
                {{userInfo.username}}
                <el-tag v-if="userInfo.isAdmin" type="warning" size="mini">超管</el-tag>
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>

              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-switch-button" command="exit">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>

        <!-- 快捷方式 -->
        <div class="quick">
          <el-tag size="small" @click="$store.commit('clearQuickList'); $router.push('/')">首页</el-tag>
          <el-tag 
          v-for="(item, index) in $store.getters.getQuickList" 
          :key="index" 
          type="info" 
          size="small"
          closable
          @close="closeQuick(item)"
          @click="$router.push(item.path)"
          >
            <span :class="{quickColor: ($route.path == item.path)}">{{item.title[1]}}</span>
          </el-tag>
          
        </div>

        <!-- 页面 -->
        <el-main>
          <!-- 缓存页面 -->
          <transition name="el-zoom-in-top">
            <keep-alive v-if="$route.meta.cache">
              <router-view></router-view>
            </keep-alive>
            <!-- 不缓存 -->
            <router-view v-else></router-view>
          </transition>

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
      menuInfo: this.$store.getters.getMenuInfo,
      isClose: false,// 侧边栏是否关闭
      quickColor: '',// 快捷按钮 类
    }
  },
  methods: {
    // 用户操作
    command(cmd){
      if (cmd == 'exit'){// 退出登录
        window.localStorage.clear()// 清空
        this.$router.push('/login')
        window.location.reload()// 刷新数据
      }
    },
    // 清空快捷路由
    closeQuick(item){
      this.$store.commit('deleteQuickList', item)
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
    overflow-x: hidden !important;
    width: auto !important;
  }

  .el-menu{
    border: 0px !important;
    width: 200px;
    text-align: left;
    color: #FFFFFF;
  }

  .el-menu-item{
    background-color: #1f2d3d !important;
  }

  .aside-title{
    color: #FFFFFF;
    font-size: 18px;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }

  .content{
   
  }

  .el-header{
    background-color: #ffffff;
    text-align: center;
    height: 50px  !important;
    line-height: 50px !important;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0px 8px !important;
  }

  .header-left{
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: left;
  }

  .header-right{
    width: 200px;
    text-align: right;
  }

  .header-left-icon{
    width: auto;
    font-size: 26px;
    margin-right: 8px;
  }

  .header-left-breadcrumb{
    width: 500px;
    margin-top: 1px;
    text-align: left;
  }

  .header-right{
    width: 200px;
    text-align: right;
  }

  .quick{
    padding: 8px;
    background-color: rgba(255, 255, 255, .5);
    margin: 8px 8px 0px 8px;
    white-space:nowrap;
    overflow-x: auto;
    overflow-y: hidden;
}

  .quickColor{
    color: #000000;
  }

  .el-tag{
    cursor: pointer;
    margin-right: 8px;
  }

  .el-main {
    text-align: center;
    height: 1px;
    padding: 8px !important;
    overflow: hidden !important;
  }


</style>