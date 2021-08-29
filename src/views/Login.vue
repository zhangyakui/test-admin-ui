<template>
  <div class="login">
      <div class="login-box">
        <p class="login-box-title">楠楠传媒 - 后台管理系统</p>
        <div class="login-box-form">
           <el-form 
           ref="loginForm" 
           :model="loginForm" 
           :rules="rules" 
           label-position="right" 
           label-width="64px" 
           label-suffix="："
           hide-required-asterisk
           >
            <el-form-item label="账号" prop="account">
              <el-input placeholder="请输入账号" size="small" clearable v-model="loginForm.account"></el-input>
            </el-form-item>

            <el-form-item label="密码" prop="password">
              <el-input placeholder="请输入密码" size="small" clearable v-model="loginForm.password"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" size="small" @click="login">登录</el-button>
            </el-form-item>
           </el-form>
        </div>
        
      </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      loginForm: {
        account: 'nannan',
        password: 'qqq123123'
      },
      rules: {
        account: [{required: true, message: '请输入账号', trigger: ['blur', 'change']}],
        password: [{required: true, message: '请输入密码', trigger: ['blur', 'change']}],
      }
    }
  },
  methods: {
    // 登录
    login(){
      this.$refs['loginForm'].validate(async (valid) => {
        if (valid) {
          const {data: loginRsp} = await this.$api.login(this.loginForm.account, this.loginForm.password)
          if (loginRsp.code == 404){// 登录失败
            this.$message.error(loginRsp.msg)
            return
          }

          // 登录成功
          this.$message.success(loginRsp.msg)
          window.localStorage.setItem('token', JSON.stringify(loginRsp.data.token))// 保存token
          this.$store.commit('setUserInfo', loginRsp.data.user)// 保存用户信息
          this.$store.commit('setDeptInfo', loginRsp.data.dept)// 保存部门信息
          this.$store.commit('setRoleInfo', loginRsp.data.role)// 保存角色信息


          // 获取菜单数据
          const {data: menuRsp} = await this.$api.getMenuList()
          let routerObj = {}
          menuRsp.data.menus.forEach(list => {
            let listTitle = list.meta.title
            list.children.forEach(menu => {
              let path = menu.path
              let menuTitle = menu.meta.title
              routerObj[path] = [listTitle, menuTitle]
            })
          })

          this.$store.commit('setRouterInfo', routerObj)

          this.$store.commit('setMenuInfo', menuRsp.data)

          this.$router.push('/wellcome')
        }
      });
    }
  }

}
</script>

<style scoped>
.login{
  height: 100%;
  position: relative;
  background: url('../assets/img/login-bgi.jpg');
  background-size: 100% 100%;
}

.login-box{
  position: absolute;
  width: 400px;
  height: 300px;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  background-color: #fff;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  padding: 10px 40px;
}

.login-box-title{
  /* border: 1px solid red; */
  text-align: center;
  font-size: 24px;
  font-weight: 1000;
  margin-top: 20px;
}

.login-box-form{
  margin-top: 30px;
  text-align: center;
}

.el-button{
  width: 100%;
}


</style>