<template>
  <div class="qiehao page">
    <!-- 选项卡 -->
    <el-tabs v-model="activeName">
      <el-tab-pane label="基础账号" name="base"></el-tab-pane>
      <el-tab-pane label="用户信息" name="detail"></el-tab-pane>
      <el-tab-pane label="镜像映射" name="mapping"></el-tab-pane>
    </el-tabs>
    <Base v-if="activeName == 'base'"></Base>
    <Detail v-if="activeName == 'detail'"></Detail>
    <Mapping v-if="activeName == 'mapping'"></Mapping>
  </div>
</template>

<script>
import Base from './qiehao/base.vue'
import Detail from './qiehao/detail.vue'
import Mapping from './qiehao/mapping.vue'
export default {
  data() {
    return {
      activeName: 'base'
    };
  },
  components: {
    Base,
    Detail,
    Mapping
  },
  methods: {
   
  }
}
</script>

<style scoped>

</style>
