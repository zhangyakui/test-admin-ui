<template>
  <div class="no-page page">
    <p>404</p>
    <el-button @click="$router.push('/')">返回首页</el-button>
  </div>
</template>

<script>
export default {
 
}
</script>

<style scoped>
.no-page{
  text-align: center;
}

p{
  font-size: 200px;
  text-align: center;
  margin-top: 150px;
}

.el-button{
  font-size: 14px;
  background-color: #2c3e50;
  color: #FFFFFF;
}

</style>