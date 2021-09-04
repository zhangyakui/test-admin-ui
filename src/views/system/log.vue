<template>
  <div class="log page">
    <!-- 顶部操作 增 删 -->
    <div class="log-operation">
        <div class="user-operation-left">
            <el-input 
            v-if="$tool.isPerm('system:log:list')"
            placeholder="请输入关键词" 
            v-model="formData.keyword"
            class="input-with-select margin-right" 
            size="mini" 
            style="width: 200px"
            clearable
            >
                <el-button slot="append" icon="el-icon-search" class="button" @click="search">搜索</el-button>
            </el-input>

            <el-button 
            class="margin-right button el-icon-refresh-right" 
            type="success" 
            size="mini" 
            @click="refresh"
            v-if="$tool.isPerm('system:log:list')"
            > 刷新
            </el-button>
        </div>
        <div class="user-operation-right">
            <el-button 
            class="margin-right button el-icon-refresh-right" 
            type="danger" 
            size="mini" 
            @click="clearAll"
            v-if="$tool.isPerm('system:log:delete')"
            > 清空
            </el-button>

            <el-button 
            class="margin-right button el-icon-download"
            size="mini" 
            @click="downloadExcel"
            v-if="$tool.isPerm('system:log:excel')"
            > 导出表格
            </el-button>
        </div>
    </div>

    <!-- 表格展示 -->
    <div class="log-table">
      <el-table
      :data="dataList"
      ref="multipleTable"
      style="width: 100%;"
      size="mini"
      row-key="rid"
      :tree-props="{children: 'children'}"
      highlight-current-row
      >
        <el-table-column
        type="index"
        min-width="50px">
        </el-table-column>

        <el-table-column
        prop="account"
        label="账号"
        min-width="120px"
        show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
        prop="username"
        label="姓名"
        min-width="100px"
        show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
        prop="actionTitle"
        label="操作功能"
        min-width="100px"
        show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
        prop="url"
        label="请求链接"
        min-width="100px"
        show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
        prop="method"
        label="请求方法"
        min-width="80px"
        show-overflow-tooltip
        >
        <template slot-scope="scope">
            <el-tag type="success" size="mini" v-if="scope.row.method == 'GET'">GET</el-tag>
            <el-tag size="mini" v-else-if="scope.row.method == 'POST'">POST</el-tag>
        </template>
        </el-table-column>

        <el-table-column
        prop="params"
        label="请求参数"
        min-width="100px"
        show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
        prop="createTime"
        label="创建日期"
        min-width="150px"
        >
        </el-table-column>
       </el-table>

      <el-pagination
      @current-change="getData()"
      :current-page.sync="formData.page"
      :page-size="10"
      layout="total, prev, pager, next"
      :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      dataList: [],// 数据
      formData: {// body参数
        page: 1,
        size: 15,
        keyword: ''
      },
      total: 0,
    }
  },
  created(){
    this.getData()
  },
  methods:{
    // 获取数据
    async getData(){
      const rsp = await this.$api.getLogList(this.formData)
      if (!rsp) return false
      this.dataList = rsp.data.data.list
      this.total = rsp.data.data.total
      return true
    },
    // 查询数据
    search(){
      this.formData.page = 1
      if (this.getData()) this.$message.success('查询成功')
    },
    // 刷新数据
    async refresh(){
        this.resetForm()
        if (await this.getData()) this.$message.success('刷新成功')
    },
    // 清空日志
    async clearAll(){
        let result = await this.$confirm('此操作将永久清空所有数据, 是否继续?', '删除提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        });
        if (result){
            const rsp = await this.$api.clearLog()
            if (!rsp) return
            this.resetForm()
            if (await this.getData()) this.$message.success('刷新成功')
        }
    },
    // 下载表格
    async downloadExcel(){
      console.log('下载表格')
      const rsp = await this.$api.downloadLog()
      if (!rsp) return console.log('err')
      let dataList = []
      rsp.data.data.list.forEach(data => {
        let obj = {
          account: data.account,
          username: data.username,
          actionTitle: data.actionTitle,
          url: data.url,
          method: data.method,
          params: data.params,
          createTime: data.createTime,
        }
        dataList.push(obj)
      })
      const header = ['账号', '姓名', '操作功能', '请求链接', '请求方法', '请求参数', '创建日期']
      this.$csv.downloadCsv(dataList, { header }, "操作日志数据.csv")
    },
    
    // 重置表单
    resetForm() {
      this.$data.formData = this.$options.data().formData
    }
  }
}
</script>

<style scoped>
.log-operation{
  text-align: left;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.log-table{
  margin-top: 8px;
} 


</style>