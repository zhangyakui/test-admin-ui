<template>
  <div class="role page">
    <!-- 顶部操作 增 删 -->
    <div class="role-operation">
      <el-button 
      class="margin-right button el-icon-plus" 
      type="primary" 
      size="mini" 
      @click="addData"
      v-if="$tool.isPerm('system:role:add')"
      > 添加
      </el-button>

      <el-button 
      class="margin-right button el-icon-refresh-right" 
      type="success" 
      size="mini" 
      @click="refresh"
      v-if="$tool.isPerm('system:role:list')"
      > 刷新
      </el-button>
    </div>

    <!-- 表格展示 -->
    <div class="role-table">
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
        prop="name"
        label="名称"
        min-width="100px"
        >
        </el-table-column>
        
        <el-table-column
        prop="type"
        label="类型"
        >
          <template slot-scope="scope">
            <el-tag size="mini" type="warning" v-if="scope.row.type == 0">部门</el-tag>
            <el-tag size="mini" type="" v-else-if="scope.row.type == 1">职位</el-tag>
          </template>
        </el-table-column>


        <el-table-column
        prop="desc"
        label="描述"
        min-width="100px"
        >
        </el-table-column>
       
        <el-table-column
        prop="createTime"
        label="创建日期"
        width="150"
        >
        </el-table-column>

        <el-table-column
        fixed="right"
        label="操作"
        width="120"
        >
          <template slot-scope="scope">
            <el-button
            type="text"
            size="small"
            @click="editData(scope.row)"
            v-if="$tool.isPerm('system:role:edit')"
            >编辑
            </el-button>

            <el-button
            type="text"
            size="small"
            @click="deleteData(scope.row)"
            v-if="$tool.isPerm('system:role:delete')"
            >删除
            </el-button>
          </template>
        </el-table-column>
       </el-table>
    </div>

    <!-- 弹框 -->
    <div class="role-from">
      <el-dialog 
      :title="dialogTitle" 
      :visible.sync="dialogFormVisible"
      @close="resetForm"
      >
        <el-form size="mini" :model="formData" :rules="rules" ref="formData" label-suffix="：" label-width="92px">
          <el-form-item label="角色类型" prop="type">
              <el-radio-group v-model="formData.type" :disabled="dialogTitle == '编辑角色'">
                <el-radio :label="0">部门</el-radio>
                <el-radio :label="1">职位</el-radio>
              </el-radio-group>
          </el-form-item>

          <el-form-item label="上级节点" prop="optionValue" v-if="formData.type == 1">
            <el-cascader
            v-model="formData.optionValue"
            :options="roleOptions"
            >
            </el-cascader>
          </el-form-item>

          <el-form-item label="角色名称" prop="name">
            <el-input size="mini" placeholder="请输入角色名称" v-model="formData.name"></el-input>
          </el-form-item>

          <el-form-item label="权限选择" prop="name" v-if="formData.type == 1">
            <!-- <el-input size="mini" placeholder="输入关键字进行过滤" v-model="filterText"
            >
            </el-input> -->

            <el-tree
            class="filter-tree"
            show-checkbox
            :data="data"
            :filter-node-method="filterNode"
            ref="tree">
            </el-tree>
          </el-form-item>



          type: {{formData.type}}
          name: {{formData.name}}
          optionValue: {{formData.optionValue}}

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
        rid: 0,
        pid: 0,
        type: 0,
        name: null,
        desc: null,
        mlist: null,
        optionValue: []
      },
      filterText: '',
      rules: {
        name: [{ required: true, message: '请输入角色名称', trigger: ['blur', 'change'] }],
        optionValue: [{ required: true, message: '请选择部门', trigger: ['blur', 'change'] }]
      },


      data: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],


    }
  },
  async created(){
    if (await this.getRoleData()) this.$message.success('刷新成功!')
  },
  computed: {
    // 动态生成 角色节点
    roleOptions() {
      let options = []
      this.dataList.forEach(dept => {
        options.push({
          value: dept.rid,
          label: dept.name,
        })
      })
      return options
    }
  },
  methods:{
    // 获取数据
    async getRoleData(){
      const rsp = await this.$api.getRoleList('role')
      if (!rsp) return false
      this.dataList = rsp.data.data
      return true
    },
    // 刷新数据
    async refresh(){
      if (await this.getRoleData()) this.$message.success('刷新成功!')
    },
    // 添加数据
    addData(){
      this.dialogFormVisible = true
      this.dialogTitle='添加角色'
    },
    // 编辑数据
    editData(row){
      this.dialogFormVisible = true
      this.dialogTitle='编辑角色'
      console.log(row)
      this.formData.rid = row.rid
      this.formData.pid = row.pid
      this.formData.type = row.type
      this.formData.name = row.name
      this.formData.desc = row.desc
      this.formData.optionValue = row.pid
    },
    // 删除数据
    async deleteData(row){
      console.log('删除数据: ', row.mid)
      let result = await this.$confirm('此操作将永久删除当前数据, 是否继续?', '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      });
      if (result){
        const {data} = await this.$api.deleteRole(row.rid)
        if (data.code == 404){
          this.$message.error(data.msg)
          return
        }

        this.getData()
        this.$message.success(data.msg)
      }
    },
    // 提交表单
    submitForm(){
      this.$refs['formData'].validate(async (valid) => {
        if (valid){
          if (this.formData.cache){
            this.formData.cache = 1
          }else{
            this.formData.cache = 0
          }
          if (this.formData.optionValue.length != 0){
            this.formData.pid = this.formData.optionValue[this.formData.optionValue.length - 1]
          }
          if (this.dialogTitle == '添加角色'){
            const {data} = await this.$api.addrole(this.formData)
            if (data.code == 404){// 节点不存在
              this.$message.error(data.msg)
              return
            }else if (data.code == 201){// 角色已存在
              this.$message.warning(data.msg)
              return
            }

            this.getData()
            this.$message.success(data.msg)
          }else if(this.dialogTitle == '编辑角色'){
            console.log('编辑角色')
            const {data} = await this.$api.editrole(this.formData)
            if (data.code == 404){// 节点不存在
              this.$message.error(data.msg)
              return
            }else if (data.code == 201){// 角色已存在
              this.$message.warning(data.msg)
              return
            }
            this.getData()
            this.$message.success(data.msg)
          }

          this.dialogFormVisible = false
        }
      })
    },
    // 重置表单
    resetForm() {
      this.$refs['formData'].resetFields();
      Object.assign(this.$data.formData, this.$options.data().formData)
    }
  }
}
</script>

<style scoped>
.role-operation{
  text-align: left;
}

.role-table{
  margin-top: 8px;
} 

.el-tree{
  /* margin-top: 8px; */
  height: 250px;
  overflow-y: scroll;
  background-color: rgba(144, 147, 147, .1);
}

</style>