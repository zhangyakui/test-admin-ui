<template>
  <div class="wellcome page">
      <div class="tips">
        <span>欢迎进入 楠楠传媒后台管理系统！</span>
        <span v-if="!$store.getters.getUserInfo.isAdmin">
          您当前处于 
          部门：
          <el-link type="warning">[{{deptInfo.title}}]</el-link>
          职位：
          <el-link type="success">[{{roleInfo.title}}]</el-link>
        </span>
      </div>

  </div>
</template>

<script>
export default {
  data(){
    return {
      deptInfo: this.$store.getters.getDeptInfo,
      roleInfo: this.$store.getters.getRoleInfo,
    }
  },

}
</script>

<style scped>

.wellcome{
  height: 100%;
  
}

.tips{
  background-color: #ecf8ff;
  height: 60px;
  line-height: 60px;
  font-size: 14px;
  border-radius: 5px;
  border-left: 5px solid #50bfff;
  padding: 0px 8px;
  text-align: left;
}

</style>