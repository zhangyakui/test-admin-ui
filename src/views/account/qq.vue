<template>
  <div class="qq page">
    <!-- 顶部操作 增 删 -->
    <div class="qq-operation">
      <div class="qq-operation-left">
        <el-select
        v-if="$tool.isPerm('account:qq:list')"
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
        v-if="$tool.isPerm('account:qq:list')"
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
        v-if="$tool.isPerm('account:qq:list')"
        > 刷新
        </el-button>
      </div>

      <div class="qq-operation-right">
        <el-button 
        class="margin-right button el-icon-plus" 
        type="primary" 
        size="mini" 
        @click="addData"
        v-if="$tool.isPerm('account:qq:add')"
        > 添加
        </el-button>

        <el-button 
        class="margin-right button el-icon-download"
        size="mini" 
        @click="downloadExcel"
        v-if="$tool.isPerm('account:qq:excel')"
        > 导出表格
        </el-button>
      </div>
    </div>

    <!-- 表格展示 -->
    <div class="qq-table">
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
        prop="avatarUrl"
        label="头像"
        min-width="70px"
        show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-avatar :size="40" v-if="scope.row.avatarUrl">
              <img :src="scope.row.avatarUrl"/>
            </el-avatar>
            <el-avatar :size="40" v-else icon="el-icon-user-solid"></el-avatar>
          </template>
        </el-table-column>

        <el-table-column
        prop="nickName"
        label="昵称"
        min-width="120px"
        show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
        prop="account"
        label="账号"
        min-width="120px"
        show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
        prop="password"
        label="密码"
        min-width="100px"
        show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
        prop="phone"
        label="手机号"
        min-width="100px"
        >
        </el-table-column>

        <el-table-column
        prop="level"
        label="等级"
        min-width="60px"
        >
        </el-table-column>

        <el-table-column
        prop="abnormal"
        label="账号状态"
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
        label="运营状态"
        min-width="70px"
        >
            <template slot-scope="scope">
                <el-tag size="mini" type="success" v-if="scope.row.status == 0">使用</el-tag>
                <el-tag size="mini" type="info" v-if="scope.row.status == 1">停用</el-tag>
                <el-tag size="mini" type="danger" v-if="scope.row.status == 2">废除</el-tag>
            </template>
        </el-table-column>

        <el-table-column
        prop="createTime"
        label="创建日期"
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
            v-if="$tool.isPerm('account:qq:edit')"
            >编辑
            </el-button>

            <el-button
            icon="el-icon-delete"
            type="text"
            size="small"
            @click="deleteData(scope.row)"
            v-if="$tool.isPerm('account:qq:delete')"
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
    <div class="qq-from">
      <el-dialog 
      width="650px"
      style="text-align: left;"
      :title="dialogTitle" 
      :visible.sync="dialogFormVisible"
      @close="resetForm"
      >
        <el-form size="mini" :model="formData" :rules="rules" ref="formData" label-suffix="：" label-width="92px">
          <el-form-item label="头像" prop="avatarUrl" v-if="dialogTitle == '编辑QQ号'">
            <el-avatar :size="100" v-if="formData.avatarUrl">
              <img :src="formData.avatarUrl"/>
            </el-avatar>
            <el-avatar :size="100" v-else icon="el-icon-user-solid"></el-avatar>
          </el-form-item>

          <el-form-item label="昵称" prop="nickName" v-if="dialogTitle == '编辑QQ号'">
            <el-input size="mini" placeholder="无昵称" v-model="formData.nickName" :disabled="dialogTitle == '编辑QQ号'"></el-input>
          </el-form-item>

          <el-form-item label="账号" prop="account">
            <el-input size="mini" placeholder="请输入账号" v-model="formData.account" :disabled="dialogTitle == '编辑QQ号'"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input size="mini" placeholder="请输入密码" v-model="formData.password"></el-input>
          </el-form-item>

          <el-form-item label="手机号" prop="phone">
            <el-input size="mini" placeholder="请输入手机号" v-model="formData.phone"></el-input>
          </el-form-item>

          <el-form-item label="账号状态" prop="abnormal">
            <el-input size="mini" placeholder="请输入异常信息(正常可不填写)" v-model="formData.abnormal"></el-input>
          </el-form-item>

          <el-form-item label="等级" prop="level">
            <el-input-number size="mini" controls-position="right" v-model="formData.level"></el-input-number>
          </el-form-item>

          <el-form-item label="运营状态" prop="status">
              <el-radio-group v-model="formData.status">
              <el-radio :label=0>使用</el-radio>
              <el-radio :label=1>停用</el-radio>
              <el-radio :label=2>废除</el-radio>
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
      status: null,// 过滤状态
      statusOptions: [
          {value: 0, label: '使用'},
          {value: 1, label: '停用'},
          {value: 2, label: '废除'}
      ],// 状态选择
      formData: {// body参数
        id: 0,
        avatarUrl: null,
        nickName: null,
        account: null,
        password: null,
        phone: '',
        level: 0,
        abnormal: '',
        status: null,
        desc: '',
        page: 1,
        size: 10,
        keyword: ''
      },
      total: 0,
      rules: {
        account: [{ required: true, message: '请输入号码', trigger: ['blur', 'change'] }],
        password: [{ required: true, message: '请输入密码', trigger: ['blur', 'change'] }]
      },
    }
  },
  created(){
    this.getData()

  },
  methods:{
    // 获取数据
    async getData(){
      const rsp = await this.$api.getQQList(this.formData)
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
    // 过滤数据
    filterData(){
      this.formData.status = this.status
      this.$data.formData.keyword = this.$options.data().formData.keyword
      this.formData.page = 1
      this.getData()
    },
    // 刷新数据
    async refresh(){
      this.$data.formData = this.$options.data().formData
      this.status = null
      if (await this.getData()) this.$message.success('刷新成功')
    },
    // 下载表格
    async downloadExcel(){
      const rsp = await this.$api.downloadQQ()
      if (!rsp) return 
      let dataList = []
      rsp.data.data.list.forEach(data => {
        let obj = {
          id: data.id,
          nickName: data.nickName,
          account: data.account,
          password: data.password,
          phone: data.phone,
          level: data.level,
          abnormal: data.abnormal,
          status: ['使用', '停用', '废除'][data.status],
          desc: data.desc,
          avatarUrl: data.avatarUrl,
          createTime: data.createTime,
          updateTime: data.updateTime,
        }
        dataList.push(obj)
      })
      const header = ['ID', '昵称', '账号', '密码', '手机号', '等级', '账号状态', '运营状态', '描述', '头像地址', '创建日期', '更新日期']
      this.$csv.downloadCsv(dataList, { header }, "QQ号数据.csv")
    },
    // 添加数据
    async addData(){
        this.resetForm()
        this.formData.status = 0
        this.dialogTitle='添加QQ号'
        this.dialogFormVisible = true
    },
    // 编辑数据
    async editData(row){
        this.resetForm()
        this.formData.id = row.id
        this.formData.avatarUrl = row.avatarUrl
        this.formData.nickName = row.nickName
        this.formData.account = row.account
        this.formData.password = row.password
        this.formData.phone = row.phone
        this.formData.level = row.level
        this.formData.abnormal = row.abnormal
        this.formData.status = row.status
        this.formData.desc = row.desc
        this.dialogTitle='编辑QQ号'
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
            const rsp = await this.$api.deleteQQ(row.id)
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
          if (this.dialogTitle == '添加QQ号'){
            const rsp = await this.$api.addQQ(this.formData)
            if (!rsp) return
            if (rsp.data.code == 201){// 手机号已存在
              this.$message.error(rsp.data.msg)
              return
            }
             this.resetForm()
            if (await this.getData()) this.$message.success(rsp.data.msg)
            
          }else if(this.dialogTitle == '编辑QQ号'){
            const rsp = await this.$api.editQQ(this.formData)
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
      this.$data.formData.avatarUrl = this.$options.data().formData.avatarUrl
      this.$data.formData.nickName = this.$options.data().formData.nickName
      this.$data.formData.account = this.$options.data().formData.account
      this.$data.formData.password = this.$options.data().formData.password
      this.$data.formData.phone = this.$options.data().formData.phone
      this.$data.formData.level = this.$options.data().formData.level
      this.$data.formData.abnormal = this.$options.data().formData.abnormal
      this.$data.formData.status = this.status
      this.$data.formData.desc = this.$options.data().formData.desc
    }
  }
}
</script>

<style scoped>
.qq-operation{
  text-align: left;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.qq-table{
  margin-top: 8px;
} 


</style>