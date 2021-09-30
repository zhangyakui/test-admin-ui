<template>
  <div class="other page">
    <!-- 顶部操作 增 删 -->
    <div class="other-operation">
      <div class="other-operation-left">
        <el-input 
        v-if="$tool.isPerm('assets:other:list')"
        placeholder="请输入关键词" 
        v-model="formData.keyword"
        class="input-with-select margin-right" 
        size="mini" 
        style="width: 200px"
        @clear="getData"
        @change="search"
        clearable
        >
          <el-button slot="append" icon="el-icon-search" class="button">搜索</el-button>
        </el-input>

        <el-button 
        class="margin-right button el-icon-refresh-right" 
        type="success" 
        size="mini" 
        @click="refresh"
        v-if="$tool.isPerm('assets:other:list')"
        > 刷新
        </el-button>
      </div>

      <div class="other-operation-right">
        <el-button 
        class="margin-right button el-icon-plus" 
        type="primary" 
        size="mini" 
        @click="addData"
        v-if="$tool.isPerm('assets:other:add')"
        > 添加
        </el-button>

        <el-button 
        class="margin-right button el-icon-download"
        size="mini" 
        @click="downloadExcel"
        v-if="$tool.isPerm('assets:other:excel')"
        > 导出表格
        </el-button>
      </div>
    </div>

    <!-- 表格展示 -->
    <div class="other-table">
      <el-table
      :data="dataList"
      ref="multipleTable"
      style="width: 100%;"
      size="mini"
      highlight-current-row
      >
        <el-table-column
        label="#"
        type="index"
        min-width="50px">
        </el-table-column>

        <el-table-column
        prop="category"
        label="品类"
        min-width="100px"
        >
        </el-table-column>

        <el-table-column
        prop="brand"
        label="品牌"
        min-width="100px"
        show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
        prop="specs"
        label="规格"
        min-width="100px"
        show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
        prop="count"
        label="数量"
        min-width="70px"
        >
        </el-table-column>

        <el-table-column
        prop="desc"
        label="描述"
        min-width="150px"
        show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
        prop="updateTime"
        label="更新日期"
        min-width="150px"
        >
        </el-table-column>

        <el-table-column
        fixed="right"
        label="操作"
        min-width="120px"
        >
          <template slot-scope="scope">
            <el-button
            icon="el-icon-edit"
            type="text"
            size="small"
            @click="editData(scope.row)"
            v-if="$tool.isPerm('assets:other:edit')"
            >编辑
            </el-button>

            <el-button
            icon="el-icon-delete"
            type="text"
            size="small"
            @click="deleteData(scope.row)"
            v-if="$tool.isPerm('assets:other:delete')"
            >删除
            </el-button>
          </template>
        </el-table-column>
       </el-table>

      <el-pagination
      @current-change="getData"
      :current-page.sync="formData.page"
      :page-size="formData.size"
      :pager-count="11"
      layout="total, prev, pager, next"
      :total="total">
      </el-pagination>
    </div>

    <!-- 弹框 -->
    <div class="other-from">
      <el-dialog 
      width="650px"
      style="text-align: left;"
      :title="dialogTitle" 
      :visible.sync="dialogFormVisible"
      @close="resetForm"
      >
        <el-form size="mini" :model="formData" :rules="rules" ref="formData" label-suffix="：" label-width="92px">

            <el-form-item label="品类" prop="category">
                 <el-input size="mini" placeholder="请输入品类" v-model="formData.category" :disabled="dialogTitle == '编辑其他'"></el-input>
            </el-form-item>

            <el-form-item label="品牌" prop="brand">
                <el-input size="mini" placeholder="请输入品牌" v-model="formData.brand" :disabled="dialogTitle == '编辑其他'"></el-input>
            </el-form-item>

            <el-form-item label="规格" prop="specs">
                <el-input size="mini" placeholder="请输入规格大小" v-model="formData.specs" :disabled="dialogTitle == '编辑其他'"></el-input>
            </el-form-item>
               
            <el-form-item label="数量" prop="count">
                <el-input-number size="mini" controls-position="right" v-model="formData.count"></el-input-number>
            </el-form-item>  

            <el-form-item label="描述" prop="desc">
                <el-input
                type="textarea"
                maxlength="100"
                show-word-limit
                placeholder="请输入描述内容"
                v-model="formData.desc"
                >
                </el-input>
            </el-form-item>
        </el-form>
        
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false; resetForm();" size="small">取 消</el-button>
          <el-button type="primary"  size="small" @click="submitForm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      dataList: [],// 数据
      dialogFormVisible: false,// dialog对话框
      dialogTitle: '',// dialog对话框标题
      formData: {// body参数
        id: 0,
        category: '',
        brand: '',
        specs: '',
        count: 1,
        desc: '',
        page: 1,
        size: 10,
        keyword: ''
      },
      total: 0,
      rules: {
        category: [{ required: true, message: '请选择 或 创建品类', trigger: ['blur', 'change'] }],
        brand: [{ required: true, message: '请选择 或 创建品牌', trigger: ['blur', 'change'] }],
      },
    }
  },
  created(){
    this.getData()
  },
  methods:{
    // 获取数据
    async getData(){
      const rsp = await this.$api.getAccOtherList(this.formData)
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
      this.$data.formData = this.$options.data().formData
      this.status = null
      this.type = null
      if (await this.getData()) this.$message.success('刷新成功')
    },
    // 下载表格
    async downloadExcel(){
      const rsp = await this.$api.downloadAccOther()
      if (!rsp) return 
      let dataList = []
      rsp.data.data.list.forEach(data => {
        let obj = {
          id: data.id,
          category: data.category,
          brand: data.brand,
          specs: data.specs,
          count:data.count,
          desc: data.desc,
          createTime: data.createTime,
          updateTime: data.updateTime,
        }
        dataList.push(obj)
      })
      const header = ['ID', '品类', '品牌', '规格', '数量', '描述', '创建日期', '更新日期']
      this.$csv.downloadCsv(dataList, { header }, "资产-其他数据.csv")
    },
    // 添加数据
    async addData(){
        this.resetForm()
        this.formData.status = 0
        this.formData.type = null
        this.dialogTitle='添加其他'
        this.dialogFormVisible = true
    },
    // 编辑数据
    async editData(row){
        this.resetForm()
        this.formData.id = row.id
        this.formData.category = row.category
        this.formData.brand = row.brand
        this.formData.specs = row.specs
        this.formData.count = row.count
        this.formData.desc = row.desc
        this.dialogTitle='编辑其他'
        this.dialogFormVisible = true
    },
    // 删除数据
    async deleteData(row){
        let result = await this.$confirm('此操作将永久删除当前数据, 是否继续?', '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        if (result){
          const rsp = await this.$api.deleteAccOther(row.id)
          if (!rsp) return
          if (rsp.data.code == 404){
              this.$message.error(rsp.data.msg)
              return
          }

          if (this.getData()) this.$message.success(rsp.data.msg)
        }
    },
    // 提交表单
    submitForm(){
      this.$refs.formData.validate(async (valid) => {
        if (valid){
            if (this.dialogTitle == '添加其他'){
                const rsp = await this.$api.addAccOther(this.formData)
                if (!rsp) return
                if (rsp.data.code == 201){// 其他已存在
                this.$message.error(rsp.data.msg)
                return
                }
                this.resetForm()
                if (await this.getData()) this.$message.success(rsp.data.msg)
                
            }else if(this.dialogTitle == '编辑其他'){
                const rsp = await this.$api.editAccOther(this.formData)
                if (rsp.data.code == 404){// 节点不存在
                this.$message.error(rsp.data.msg)
                return
                }else if (rsp.data.code == 201){// 用户已存在
                this.$message.warning(rsp.data.msg)
                return
                }
                this.resetForm()
                if (await this.getData()) this.$message.success(rsp.data.msg)
            }

            this.dialogFormVisible = false
        }
      })
    },
    // 重置表单
    resetForm() {
      if (this.$refs.formData) this.$refs.formData.resetFields()
        this.$data.formData.category = this.category
        this.$data.formData.brand = this.$options.data().formData.brand
        this.$data.formData.specs = this.$options.data().formData.specs
        this.$data.formData.count = this.$options.data().formData.count
        this.$data.formData.desc = this.$options.data().formData.desc
        this.$data.formData.keyword = this.$options.data().formData.keyword
    }
  }
}
</script>

<style scoped>
.other-operation{
  text-align: left;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.other-table{
  margin-top: 8px;
} 


</style>