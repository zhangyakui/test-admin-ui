<template>
  <div class="user page">
    <!-- 顶部操作 增 删 -->
    <div class="user-operation">
      <div class="user-operation-left">
        <!-- <el-select 联动问题, 暂不使用过滤功能
        v-if="$tool.isPerm('system:user:list')"
        v-model="formData.enable" 
        placeholder="状态选择" 
        size="mini" 
        class="margin-right" 
        style="width: 100px" 
        clearable>
          <el-option
          v-for="item in [{value: 1, label: '启用'}, {value: 0, label: '停用'}]"
          :key="item.value"
          :label="item.label"
          :value="item.value">
          </el-option>
        </el-select> -->

        <el-input 
        v-if="$tool.isPerm('system:user:list')"
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
        v-if="$tool.isPerm('system:user:list')"
        > 刷新
        </el-button>
      </div>

      <div class="user-operation-right">
        <el-button 
        class="margin-right button el-icon-plus" 
        type="primary" 
        size="mini" 
        @click="addData"
        v-if="$tool.isPerm('system:user:add') && $tool.isPerm('system:role:list')"
        > 添加
        </el-button>

        <el-button 
        class="margin-right button el-icon-download"
        size="mini" 
        @click="downloadExcel"
        v-if="$tool.isPerm('system:user:excel')"
        > 导出表格
        </el-button>
      </div>
    </div>

    <!-- 表格展示 -->
    <div class="user-table">
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
        prop="deptName"
        label="部门"
        min-width="80px"
        show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
        prop="jobName"
        label="职位"
        min-width="80px"
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
        prop="username"
        label="姓名"
        min-width="100px"
        show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
        prop="gender"
        label="性别"
        min-width="50px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.gender == 1">男</span>
            <span v-else-if="scope.row.gender == 2">女</span>
          </template>
        </el-table-column>

        <el-table-column
        prop="phone"
        label="手机号"
        min-width="100px"
        show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
        prop="desc"
        label="描述"
        min-width="100px"
        show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
        prop="enable"
        label="状态"
        min-width="60px"
        >
        <template slot-scope="scope">
          <el-switch
          v-model="scope.row.enable"
          :active-value=1
          :inactive-value=0
          @change="changeStatus(scope.row)"
          >
          </el-switch>
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
        min-width="100px"
        >
          <template slot-scope="scope">
            <el-button
            type="text"
            size="small"
            @click="editData(scope.row)"
            v-if="$tool.isPerm('system:user:edit')"
            >编辑
            </el-button>

            <el-button
            type="text"
            size="small"
            @click="deleteData(scope.row)"
            v-if="$tool.isPerm('system:user:delete')"
            >删除
            </el-button>
          </template>
        </el-table-column>
       </el-table>

      <el-pagination
      @current-change="getData()"
      :current-page.sync="formData.page"
      :page-size="formData.size"
      layout="total, prev, pager, next"
      :total="total">
      </el-pagination>
    </div>

    <!-- 弹框 -->
    <div class="user-from">
      <el-dialog 
      :title="dialogTitle" 
      :visible.sync="dialogFormVisible"
      >
        <el-form size="mini" :model="formData" :rules="rules" ref="formData" label-suffix="：" label-width="92px">
          <el-form-item label="注册账号" prop="account">
            <el-input size="mini" placeholder="请输入账号(最好是email)" v-model="formData.account" :disabled="dialogTitle == '编辑用户'"></el-input>
          </el-form-item>

          <el-form-item label="注册密码" prop="password" v-if="dialogTitle == '添加用户'">
            <el-input size="mini" placeholder="请输入密码(默认为: admin1234)" v-model="formData.password"></el-input>
          </el-form-item>
         
          <el-form-item label="真实姓名" prop="username">
            <el-input size="mini" placeholder="请输入用户真实姓名" v-model="formData.username" :disabled="dialogTitle == '编辑用户'"></el-input>
          </el-form-item>

          <el-form-item label="手机号 " prop="phone">
            <el-input size="mini" placeholder="请输入手机号, 可不填写" v-model="formData.phone"></el-input>
          </el-form-item>

          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="formData.gender" :disabled="dialogTitle == '编辑用户'">
              <el-radio :label=1>男</el-radio>
              <el-radio :label=2>女</el-radio>
            </el-radio-group>
          </el-form-item>          

          <el-form-item label="启用状态" prop="enable">
            <el-switch
            v-model="formData.enable"
            :active-value=1
            :inactive-value=0
            >
            </el-switch>
          </el-form-item>  

          <el-form-item label="角色分配" prop="optionValue" v-if="formData.type != 0">
            <el-cascader
            v-model="formData.optionValue"
            :options="roleOptions"
            >
            </el-cascader>
          </el-form-item>

          <el-form-item label="描述内容" prop="desc">
            <el-input
            type="textarea"
            maxlength="100"
            show-word-limit
            placeholder="请输入描述内容"
            v-model="formData.desc"
            >
            </el-input>
          </el-form-item>

          <!-- uid: {{formData.uid}}
          username: {{formData.username}}
          account: {{formData.account}}
          password: {{formData.password}}
          gender: {{formData.gender}}
          phone: {{formData.phone}}
          enable: {{formData.enable}}
          desc: {{formData.desc}}
          page: {{formData.page}}
          size: {{formData.size}}
          keyword: {{formData.keyword}}
          rid: {{formData.rid}}
          roleOptions: {{roleOptions}}
          optionValue:{{formData.optionValue}} -->

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
      roleOptions: [],// 角色选择
      formData: {// body参数
        uid: null,
        username: null,
        account: null,
        password: 'pwd123456',
        gender: 1,
        phone: '',
        enable: null,
        desc: '',
        rid: null,
        page: 1,
        size: 10,
        keyword: '',
        optionValue: [],
        jobId: null,
        jobName: null,
        deptId: null,
        deptName: null
      },
      total: 0,
      rules: {
        username: [{ required: true, message: '请输入用户真实姓名', trigger: ['blur', 'change'] }],
        account: [{ required: true, message: '请输入账号(最好是Email)', trigger: ['blur', 'change'] }],
        password: [{ required: true, message: '请输入密码(默认为: admin1234)', trigger: ['blur', 'change'] }],
        optionValue: [{ required: true, message: '请选择职位', trigger: ['blur', 'change'] }]
      },
    }
  },
  created(){
    this.getData()
  },
  methods:{
    // 获取数据
    async getData(){
      const rsp = await this.$api.getUserList(this.formData)
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
    // 下载表格
    async downloadExcel(){
      console.log('下载表格')
      const rsp = await this.$api.downloadUser()
      if (!rsp) return console.log('err')
      let dataList = []
      rsp.data.data.list.forEach(data => {
        let obj = {
          deptName: data.deptName,
          jobName: data.jobName,
          account: data.account,
          username: data.username,
          gender: data.gender == 1 ? '男' : '女',
          phone: data.phone,
          desc: data.desc,
          enable: data.enable === 0 ? '停用' : '启用',
          createTime: data.createTime,
        }
        dataList.push(obj)
      })
      const header = ['部门', '职位', '账号', '真实姓名', '性别', '手机号', '描述', '是否启用', '创建日期']
      this.$csv.downloadCsv(dataList, { header }, "用户管理数据.csv")
    },
    // 获取部门角色信息
    async getRoleList() {
      this.$data.roleOptions = this.$options.data().roleOptions
      const rsp = await this.$api.getRoleList('role')
      if (!rsp) return false
      rsp.data.data.forEach(dept => {
        let deptObj = {
          value: dept.rid,
          label: dept.name,
          children: []
        }
        dept.children.forEach(job => {
          deptObj.children.push({
            value: job.rid,
            label: job.name
          })
        })
        this.roleOptions.push(deptObj)
      })
      return true
    },
    // 添加数据
    async addData(){
      this.resetForm()
      if (!await this.getRoleList()) return
      this.formData.enable = 1
      this.dialogTitle='添加用户'
      this.dialogFormVisible = true
    },
    // 编辑数据
    async editData(row){
      this.resetForm()
      if (!await this.getRoleList()) return
      this.formData.uid = row.uid
      this.formData.account = row.account
      this.formData.username = row.username
      this.formData.phone = row.phone
      this.formData.enable = row.enable
      this.formData.optionValue = [row.deptId, row.jobId]
      this.formData.desc = row.desc
      this.dialogTitle='编辑用户'
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
        const rsp = await this.$api.deleteUser(row.uid)
        if (!rsp) return
        if (rsp.data.code == 404){
          this.$message.error(rsp.data.msg)
          return
        }else if (rsp.data.code == 201){
          this.$message.warning(rsp.data.msg)
          return
        }

        if (this.getData()) this.$message.success(rsp.data.msg)
      }
    },
    // 修改状态
    async changeStatus(row){
      this.formData.uid = row.uid
      this.formData.enable = row.enable
      const rsp = await this.$api.editUser(this.formData)
      if (rsp.data.code == 404){// 节点不存在
        this.$message.error(rsp.data.msg)
        return
      }else if (rsp.data.code == 201){// 用户已存在
        this.$message.warning(rsp.data.msg)
        return
      }
      this.resetForm()
      if (await this.getData()) this.$message.success('状态已修改')

    },
    // 提交表单
    submitForm(){
      this.$refs.formData.validate(async (valid) => {
        if (valid){
          if (this.formData.optionValue.length != 0){
            this.formData.rid = this.formData.optionValue[this.formData.optionValue.length - 1]
          }
          if (this.dialogTitle == '添加用户'){
            const rsp = await this.$api.addUser(this.formData)
            if (!rsp) return
            if (rsp.data.code == 201){// 用户已存在
              this.$message.error(rsp.data.msg)
              return
            }
             this.resetForm()
            if (await this.getData()) this.$message.success(rsp.data.msg)
            
          }else if(this.dialogTitle == '编辑用户'){
            const rsp = await this.$api.editUser(this.formData)
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
      this.$data.formData = this.$options.data().formData
    }
  }
}
</script>

<style scoped>
.user-operation{
  text-align: left;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.user-table{
  margin-top: 8px;
} 

.el-tree{
  height: 250px;
  overflow-y: scroll;
  background-color: rgba(144, 147, 147, .1);
  /* padding: 8px; */
}

</style>