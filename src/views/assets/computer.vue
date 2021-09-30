<template>
  <div class="computer page">
    <!-- 顶部操作 增 删 -->
    <div class="computer-operation">
      <div class="computer-operation-left">
        <el-select
        v-if="$tool.isPerm('assets:computer:list')"
        v-model="category" 
        placeholder="品类" 
        @change="filterData"
        size="mini" 
        class="margin-right" 
        style="width: 100px" 
        clearable
        >
          <el-option
          v-for="item in categoryOptions"
          :key="item.value"
          :label="item.label"
          :value="item.label">
          </el-option>
        </el-select>

        <el-select
        v-if="$tool.isPerm('assets:computer:list')"
        v-model="status" 
        placeholder="状态" 
        @change="filterData"
        size="mini" 
        class="margin-right" 
        style="width: 100px" 
        clearable
        >
          <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
          </el-option>
        </el-select>

        <el-input 
        v-if="$tool.isPerm('assets:computer:list')"
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
        v-if="$tool.isPerm('assets:computer:list')"
        > 刷新
        </el-button>
      </div>

      <div class="computer-operation-right">
        <el-button 
        class="margin-right button el-icon-plus" 
        type="primary" 
        size="mini" 
        @click="addData"
        v-if="$tool.isPerm('assets:computer:add')"
        > 添加
        </el-button>

        <el-button 
        class="margin-right button el-icon-download"
        size="mini" 
        @click="downloadExcel"
        v-if="$tool.isPerm('assets:computer:excel')"
        > 导出表格
        </el-button>
      </div>
    </div>

    <!-- 表格展示 -->
    <div class="computer-table">
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
        prop="model"
        label="型号"
        min-width="100px"
        show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
        prop="computerId"
        label="编号"
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
        prop="desc"
        label="描述"
        min-width="150px"
        show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
        prop="status"
        label="状态"
        min-width="70px"
        >
            <template slot-scope="scope">
                <el-tag size="mini" type="success" v-if="scope.row.status == 0">使用</el-tag>
                <el-tag size="mini" type="info" v-if="scope.row.status == 1">停用</el-tag>
                <el-tag size="mini" type="danger" v-if="scope.row.status == 2">故障</el-tag>
            </template>
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
            v-if="$tool.isPerm('assets:computer:edit')"
            >编辑
            </el-button>

            <el-button
            icon="el-icon-delete"
            type="text"
            size="small"
            @click="deleteData(scope.row)"
            v-if="$tool.isPerm('assets:computer:delete')"
            >删除
            </el-button>
          </template>
        </el-table-column>
       </el-table>

      <el-pagination
      @current-change="getData"
      :current-page.sync="formData.page"
      :pager-count="11"
      :page-size="formData.size"
      layout="total, prev, pager, next"
      :total="total">
      </el-pagination>
    </div>

    <!-- 弹框 -->
    <div class="computer-from">
      <el-dialog 
      width="650px"
      style="text-align: left;"
      :title="dialogTitle" 
      :visible.sync="dialogFormVisible"
      @close="resetForm"
      >
        <el-form size="mini" :model="formData" :rules="rules" ref="formData" label-suffix="：" label-width="92px">

            <el-form-item label="品类" prop="category">
                <el-select v-model="formData.category" placeholder="请选择品类" allow-create filterable clearable :disabled="dialogTitle == '编辑电脑'">
                    <el-option
                    v-for="item in categoryOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                    >
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="品牌" prop="brand">
                <el-select v-model="formData.brand" placeholder="请选择 或 创建品牌" allow-create filterable clearable :disabled="dialogTitle == '编辑电脑'">
                    <el-option
                    v-for="item in brandOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                    >
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="型号" prop="model">
                <el-select v-model="formData.model" placeholder="请选择 或 创建型号" allow-create filterable clearable :disabled="dialogTitle == '编辑电脑'">
                    <el-option
                    v-for="item in modelOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                    >
                    </el-option>
                </el-select>
            </el-form-item>

          
            <el-form-item label="编号" prop="computerId">
                <el-input size="mini" placeholder="请输入编号" v-model="formData.computerId"></el-input>
            </el-form-item>

            <el-form-item label="规格" prop="specs">
                <el-input size="mini" placeholder="请输入规格大小" v-model="formData.specs"></el-input>
            </el-form-item>
               
            <el-form-item label="状态" prop="status">
                <el-radio-group v-model="formData.status">
                <el-radio :label=0>使用</el-radio>
                <el-radio :label=1>停用</el-radio>
                <el-radio :label=2>故障</el-radio>
                </el-radio-group>
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
      category: null,// 品类
      status: null,// 过滤状态
      statusOptions: [
          {value: 0, label: '使用'},
          {value: 1, label: '停用'},
          {value: 2, label: '故障'},
      ],// 状态选择
      categoryOptions: [],// 品类选择
      brandOptions: [],// 品牌列表
      modelOptions: [],// 型号列表
      formData: {// body参数
        id: 0,
        category: null,
        computerId: '',
        brand: '',
        model: '',
        specs: '',
        status: null,
        desc: '',
        page: 1,
        size: 10,
        keyword: ''
      },
      total: 0,
      rules: {
        category: [{ required: true, message: '请选择 或 创建品类', trigger: ['blur', 'change'] }],
        brand: [{ required: true, message: '请选择 或 创建品牌', trigger: ['blur', 'change'] }],
        model: [{ required: true, message: '请选择 或 创建模型', trigger: ['blur', 'change'] }],
      },
    }
  },
  created(){
    this.getData()
  },
  methods:{
    // 获取数据
    async getData(){
      const rsp = await this.$api.getAccComputerList(this.formData)
      if (!rsp) return false
      this.dataList = rsp.data.data.list
      this.total = rsp.data.data.total
      this.categoryOptions = []
      this.brandOptions = []
      this.modelOptions = []
      rsp.data.data.categories.forEach((data, index) => {// 过滤品类
        this.categoryOptions.push({
          value: index,
          label: data.category
        })
      })
      rsp.data.data.brands.forEach((data, index) => {// 过滤品牌
        this.brandOptions.push({
          value: index,
          label: data.brand
        })
      })
      rsp.data.data.models.forEach((data, index) => {// 过滤型号
        this.modelOptions.push({
          value: index,
          label: data.model
        })
      })
      return true
    },
    // 查询数据
    search(){
      this.formData.page = 1
      if (this.getData()) this.$message.success('查询成功')
    },
    // 过滤数据
    filterData(){
      this.formData.status = this.status
      this.formData.category = this.category
      this.$data.formData.keyword = this.$options.data().formData.keyword
      this.formData.page = 1
      this.getData()
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
      const rsp = await this.$api.downloadAccComputer()
      if (!rsp) return 
      let dataList = []
      rsp.data.data.list.forEach(data => {
        let obj = {
          id: data.id,
          category: data.category,
          brand: data.brand,
          model: data.model,
          computerId: data.computerId,
          specs: data.specs,
          status: ['使用', '停用', '故障'][data.status],
          desc: data.desc,
          createTime: data.createTime,
          updateTime: data.updateTime,
        }
        dataList.push(obj)
      })
      const header = ['ID', '品类', '品牌', '型号', '编号', '规格', '状态', '描述', '创建日期', '更新日期']
      this.$csv.downloadCsv(dataList, { header }, "资产-电脑数据.csv")
    },
    // 添加数据
    async addData(){
        this.resetForm()
        this.formData.status = 0
        this.formData.type = null
        this.dialogTitle='添加电脑'
        this.dialogFormVisible = true
    },
    // 编辑数据
    async editData(row){
        this.resetForm()
        this.formData.id = row.id
        this.formData.category = row.category
        this.formData.brand = row.brand
        this.formData.model = row.model
        this.formData.computerId = row.computerId
        this.formData.specs = row.specs
        this.formData.status = row.status
        this.formData.desc = row.desc
        this.dialogTitle='编辑电脑'
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
          const rsp = await this.$api.deleteAccComputer(row.id)
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
            if (this.dialogTitle == '添加电脑'){
                const rsp = await this.$api.addAccComputer(this.formData)
                if (!rsp) return
                if (rsp.data.code == 201){// 电脑已存在
                this.$message.error(rsp.data.msg)
                return
                }
                this.resetForm()
                if (await this.getData()) this.$message.success(rsp.data.msg)
                
            }else if(this.dialogTitle == '编辑电脑'){
                const rsp = await this.$api.editAccComputer(this.formData)
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
        this.$data.formData.computerId = this.$options.data().formData.computerId
        this.$data.formData.brand = this.$options.data().formData.brand
        this.$data.formData.model = this.$options.data().formData.model
        this.$data.formData.specs = this.$options.data().formData.specs
        this.$data.formData.status = this.status
        this.$data.formData.desc = this.$options.data().formData.desc
        this.$data.formData.keyword = this.$options.data().formData.keyword
    }
  }
}
</script>

<style scoped>
.computer-operation{
  text-align: left;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.computer-table{
  margin-top: 8px;
} 


</style>