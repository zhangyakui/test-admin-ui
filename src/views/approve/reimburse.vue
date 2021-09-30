<template>
  <div class="reimburse page">
    <!-- 选项卡 -->
    <el-tabs v-model="activeName">
      <el-tab-pane label="报销申请" name="apply"></el-tab-pane>
      <el-tab-pane label="报销审核" name="examine"></el-tab-pane>
      <el-tab-pane label="报销结算" name="settlement"></el-tab-pane>
      <el-tab-pane label="报销记录" name="record"></el-tab-pane>
    </el-tabs>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'apply'
    };
  },
  components: {

  },
  methods: {
   
  }
}
</script>

<style scoped>

</style> 
