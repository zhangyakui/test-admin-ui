<template>
  <div class="baijiahao page">
    <!-- 选项卡 -->
    <el-tabs v-model="activeName">
      <el-tab-pane label="基础账号" name="base"></el-tab-pane>
      <el-tab-pane label="用户信息" name="detail"></el-tab-pane>
      <el-tab-pane label="镜像映射" name="mapping"></el-tab-pane>
    </el-tabs>

    <keep-alive>
      <Base v-if="activeName == 'base'"></Base>
      <Detail v-if="activeName == 'detail'"></Detail>
      <Mapping v-if="activeName == 'mapping'"></Mapping>
    </keep-alive>
  </div>
</template>

<script>
import Base from './baijiahao/base.vue'
import Detail from './baijiahao/detail.vue'
import Mapping from './baijiahao/mapping.vue'
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
