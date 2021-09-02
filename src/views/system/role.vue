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
      >
        <el-form size="mini" :model="formData" :rules="rules" ref="formData" label-suffix="：" label-width="92px">
          <el-form-item label="角色类型" prop="type">
              <el-radio-group v-model="formData.type" :disabled="dialogTitle == '编辑角色'">
                <el-radio :label="0">部门</el-radio>
                <el-radio :label="1">职位</el-radio>
              </el-radio-group>
          </el-form-item>

          <el-form-item label="所属部门" prop="optionValue" v-if="formData.type == 1">
            <el-cascader
            v-model="formData.optionValue"
            :options="roleOptions"
            >
            </el-cascader>
          </el-form-item>

          <el-form-item label="角色名称" prop="name">
            <el-input size="mini" placeholder="请输入 部门/角色 名称" v-model="formData.name"></el-input>
          </el-form-item>

          <el-form-item label="分配权限" prop="mlist" v-if="formData.type == 1">
            <el-tree
            show-checkbox
            :data="treeList"
            node-key='id'
            ref="tree"
            @check="clickTree"
            :default-expanded-keys="checkedList"
            :default-checked-keys="checkedList"
            >
            </el-tree>
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

          <!-- type: {{formData.type}}
          pid: {{formData.pid}}
          name: {{formData.name}}
          mlist: {{formData.mlist}}
          desc: {{formData.desc}}
          optionValue: {{formData.optionValue}}
          checkedList: {{checkedList}}
          fatherList: {{fatherList}} -->

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
      treeList: [],
      checkedList: [],
      fatherList: [],
      formData: {// body参数
        rid: 0,
        pid: 0,
        type: 0,
        name: null,
        mlist: [],
        desc: null,
        optionValue: []
      },
      rules: {
        name: [{ required: true, message: '请输入角色名称', trigger: ['blur', 'change'] }],
        optionValue: [{ required: true, message: '请选择部门', trigger: ['blur', 'change'] }]
      },
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
    // 获取权限节点数据
    async getPermNode(){
      const rsp = await this.$api.getMenuList()
      if (!rsp) return false
      let treeData = []
      let fatherList = []
      rsp.data.data.forEach(list => {
        let listObj = {
          id: list.mid,
          label: list.title,
          perms: [list.mid],
          children: []
        }
        fatherList.push(list.mid)
        list.children.forEach(menu => {
          let menuObj = {
            id: menu.mid,
            label: menu.title,
            perms: [menu.pid, menu.mid],
            children: []
          }
          fatherList.push(menu.mid)

          menu.children.forEach(button => {
            menuObj.children.push({
              id: button.mid,
              label: button.title,
              perms: [list.mid, button.pid, button.mid]
            })
          })
          listObj.children.push(menuObj)
        })
        treeData.push(listObj)
      })
      this.treeList = treeData
      this.fatherList = fatherList
      return true
    },
    // 获取当前权限数据
    async getPermData(){
      if (this.formData.type == 1){
        const rsp = await this.$api.getRoleList('perm', this.formData.rid)
        if (!rsp) return false
        this.formData.mlist = rsp.data.data
        this.checkedList = rsp.data.data

        let _checkedList = []
        this.checkedList.forEach(num => {// 过滤 父级id  防止全选
          if (this.fatherList.indexOf(num) == -1){
            _checkedList.push(num)
          }
        })

        this.checkedList = _checkedList
      }
      return true
    },
    // 选择tree
    clickTree(){
      let perms = []
      this.$refs.tree.getCheckedNodes().forEach(perm => {
        perms.push.apply(perms,perm.perms);
      })
      this.formData.mlist = Array.from(new Set(perms))

    },
    // 刷新数据
    async refresh(){
      if (await this.getRoleData()) this.$message.success('刷新成功!')
    },
    // 添加数据
    addData(){
      this.resetForm()
      this.getPermNode()
      this.dialogTitle='添加角色'
      this.dialogFormVisible = true
    },
    // 编辑数据
    editData(row){
      this.resetForm()
      this.getPermNode()
      this.formData.rid = row.rid
      this.formData.pid = row.pid
      this.formData.type = row.type
      this.formData.name = row.name
      this.formData.desc = row.desc
      this.formData.optionValue = [row.pid]
      this.getPermData()

      this.dialogTitle='编辑角色'
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
        const rsp = await this.$api.deleteRole(row.rid)
        if (!rsp) return
        if (rsp.data.code == 404){
          this.$message.error(rsp.data.msg)
          return
        }else if (rsp.data.code == 201){
          this.$message.warning(rsp.data.msg)
          return
        }

        this.getRoleData()
        this.$message.success(rsp.data.msg)
      }
    },
    // 提交表单
    submitForm(){
      this.$refs.formData.validate(async (valid) => {
        if (valid){
            if (this.formData.type == 1){
              this.formData.pid = this.formData.optionValue[0]
              if (this.formData.mlist.length == 0){
                this.$message.warning('您未分配权限!')
                return
              }
              this.formData.mlist = JSON.stringify(this.formData.mlist)
            }
          if (this.dialogTitle == '添加角色'){
            const rsp = await this.$api.addRole(this.formData)
            if (!rsp) return
            if (rsp.data.code == 201){// 角色已存在
              this.$message.error(rsp.data.msg)
              return
            }
            if (await this.getRoleData()) this.$message.success(rsp.data.msg)
            
          }else if(this.dialogTitle == '编辑角色'){
            const rsp = await this.$api.editRole(this.formData)
            if (rsp.data.code == 404){// 节点不存在
              this.$message.error(rsp.data.msg)
              return
            }else if (rsp.data.code == 201){// 角色已存在
              this.$message.warning(rsp.data.msg)
              return
            }
            if (await this.getRoleData()) this.$message.success(rsp.data.msg)
          }

          this.dialogFormVisible = false
        }
      })
    },
    // 重置表单
    resetForm() {
      if (this.$refs.formData) this.$refs.formData.resetFields()
      this.$data.formData = this.$options.data().formData
      this.$data.checkedList = this.$options.data().checkedList
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
  height: 250px;
  overflow-y: scroll;
  background-color: rgba(144, 147, 147, .1);
  /* padding: 8px; */
}

</style>