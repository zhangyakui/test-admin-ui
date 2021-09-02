<template>
  <div class="menu page">
    <!-- 顶部操作 增 删 -->
    <div class="menu-operation">
      <el-button 
      class="margin-right button el-icon-plus" 
      type="primary" 
      size="mini" 
      @click="addData"
      v-if="$tool.isPerm('system:menu:add')"
      > 添加
      </el-button>

      <el-button 
      class="margin-right button el-icon-refresh-right" 
      type="success" 
      size="mini" 
      @click="refresh"
      v-if="$tool.isPerm('system:menu:list')"
      > 刷新
      </el-button>
    </div>

    <!-- 表格展示 -->
    <div class="menu-table">
      <el-table
      :data="dataList"
      ref="multipleTable"
      style="width: 100%;"
      size="mini"
      row-key="mid"
      :tree-props="{children: 'children'}"
      highlight-current-row
      >
        <el-table-column
        prop="title"
        label="名称"
        min-width="100px"
        >
        </el-table-column>
        
        <el-table-column
        prop="type"
        label="类型"
        >
          <template slot-scope="scope">
            <el-tag size="mini" type="warning" v-if="scope.row.type == 0">目录</el-tag>
            <el-tag size="mini" type="" v-else-if="scope.row.type == 1">菜单</el-tag>
            <el-tag size="mini" type="success" v-else>按钮</el-tag>
          </template>
        </el-table-column>

        <el-table-column
        prop="path"
        label="路由"
        show-overflow-tooltip
        >
        </el-table-column>
        
        <el-table-column
        prop="permission"
        label="权限标识"
        show-overflow-tooltip
        >
        </el-table-column>
        
        <el-table-column
        prop="cache"
        label="缓存"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.cache">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>

        <el-table-column
        prop="sortId"
        label="排序"
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
            v-if="$tool.isPerm('system:menu:edit')"
            >编辑
            </el-button>

            <el-button
            type="text"
            size="small"
            @click="deleteData(scope.row)"
            v-if="$tool.isPerm('system:menu:delete')"
            >删除
            </el-button>
          </template>
        </el-table-column>
       </el-table>
    </div>

    <!-- 弹框 -->
    <div class="menu-from">
      <el-dialog 
      :title="dialogTitle" 
      :visible.sync="dialogFormVisible"
      >
        <el-form size="mini" :model="formData" :rules="rules" ref="formData" label-suffix="：" label-width="92px">
          <el-form-item label="菜单类型" prop="type">
              <el-radio-group v-model="formData.type" :disabled="dialogTitle == '编辑菜单'">
                <el-radio :label="0">目录</el-radio>
                <el-radio :label="1">菜单</el-radio>
                <el-radio :label="2">按钮</el-radio>
              </el-radio-group>
          </el-form-item>

          <el-form-item label="上级节点" prop="optionValue" v-if="formData.type != 0">
            <el-cascader
            v-model="formData.optionValue"
            :options="menuOptions"
            >
            </el-cascader>
          </el-form-item>

          <el-form-item label="菜单名称" prop="title">
            <el-input size="mini" placeholder="请输入菜单名称(4字最佳)" v-model="formData.title"></el-input>
          </el-form-item>

          <el-form-item label="路由地址" prop="path" v-if="formData.type == 1">
            <el-input size="mini" placeholder="请输入路由地址(如: /system/user)" v-model="formData.path"></el-input>
          </el-form-item>

          <el-form-item label="权限标识" prop="permission" v-if="formData.type != 0">
            <el-input size="mini" placeholder="请输入权限标识(如: system:user:list)" v-model="formData.permission"></el-input>
          </el-form-item>

          <el-form-item label="缓存页面" prop="cache" v-if="formData.type == 1">
            <el-switch
            v-model="formData.cache"
            active-color="#13ce66"
            inactive-color="#ff4949">
            </el-switch>
          </el-form-item>

          <el-form-item label="菜单排序" prop="sortId">
            <el-input-number size="mini" controls-position="right" v-model="formData.sortId"></el-input-number>
          </el-form-item>

<!--       
          菜单类型:{{formData.type}}
          标题: {{formData.title}}
          路由: {{formData.path}}
          权限标识: {{formData.permission}}
          缓存: {{formData.cache}}
          排序: {{formData.sortId}}
          父级: {{formData.pid}} -->
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
        mid: 0,
        pid: 0,
        type: 0,
        title: null,
        path: null,
        cache: true,
        permission: null,
        sortId: 0,
        optionValue: [],
      },
      rules: {
        title: [{ required: true, message: '请输入菜单名称', trigger: ['blur', 'change'] }],
        path: [{ required: true, message: '请输入路由地址', trigger: ['blur', 'change'] }],
        permission: [{ required: true, message: '请输入权限标识', trigger: ['blur', 'change'] }],
        optionValue: [{ required: true, message: '请选择上级节点', trigger: ['blur', 'change'] }]
      },
    }
  },
  async created(){
    if (await this.getData()) this.$message.success('刷新成功!')
  },
  computed: {
    // 动态生成 菜单节点
    menuOptions() {
      let options = []
      this.dataList.forEach(category => {
        let _menuObj = {
          value: category.mid,
          label: category.title,
        }
        if (this.formData.type == 2){
          _menuObj.children = []
          category.children.forEach(menu => {
            _menuObj.children.push({
            value: menu.mid,
            label: menu.title
          })
        })
        }
        options.push(_menuObj)
      })   
      return options
    }
  },
  methods:{
    // 获取数据
    async getData(){
      const rsp = await this.$api.getMenuList()
      if (!rsp) return false
      this.dataList = rsp.data.data
      return true
    },
    // 刷新数据
    async refresh(){
      if (await this.getData()) this.$message.success('刷新成功!')
    },
    // 添加数据
    addData(){
      this.resetForm()
      this.dialogTitle='添加菜单'
      this.dialogFormVisible = true
    },
    // 编辑数据
    editData(row){
      this.resetForm()
      this.dialogTitle='编辑菜单'
      this.dialogFormVisible = true
      this.formData.mid = row.mid
      this.formData.pid = row.pid
      this.formData.type = row.type
      this.formData.title = row.title
      this.formData.path = row.path
      this.formData.cache = row.cache
      this.formData.permission = row.permission
      this.formData.sortId = row.sortId
      if (row.type == 2){// 节点赋值
        this.formData.optionValue = [row.fid, row.pid]
      }else{  
        this.formData.optionValue = [row.pid]
      }
    },
    // 删除数据
    async deleteData(row){
      let result = await this.$confirm('此操作将永久删除当前数据, 是否继续?', '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      });
      if (result){
        const rsp = await this.$api.deleteMenu(row.mid)
        if (!rsp) return
        if (rsp.data.code == 404){
          this.$message.error(rsp.data.msg)
          return
        }

        this.getData()
        this.$message.success(rsp.data.msg)
      }
    },
    // 提交表单
    submitForm(){
      this.$refs.formData.validate(async (valid) => {
        if (valid){
          if (this.formData.cache){
            this.formData.cache = 1
          }else{
            this.formData.cache = 0
          }
          if (this.formData.optionValue.length != 0){
            this.formData.pid = this.formData.optionValue[this.formData.optionValue.length - 1]
          }
          if (this.dialogTitle == '添加菜单'){
            const rsp = await this.$api.addMenu(this.formData)
            if (!rsp) return
            if (rsp.data.code == 404){// 节点不存在
              this.$message.error(rsp.data.msg)
              return
            }else if (rsp.data.code == 201){// 菜单已存在
              this.$message.warning(rsp.data.msg)
              return
            }

            this.getData()
            this.$message.success(rsp.data.msg)
          }else if(this.dialogTitle == '编辑菜单'){
            const rsp = await this.$api.editMenu(this.formData)
            if (!rsp) return
            if (rsp.data.code == 404){// 节点不存在
              this.$message.error(rsp.data.msg)
              return
            }else if (rsp.data.code == 201){// 菜单已存在
              this.$message.warning(rsp.data.msg)
              return
            }
            this.getData()
            this.$message.success(rsp.data.msg)
          }

          this.dialogFormVisible = false
        }
      })
    },
    // 重置表单
    resetForm() {
      if (this.$refs.formData) this.$refs.formData.resetFields();
      this.$data.formData = this.$options.data().formData
    }
  }
}
</script>

<style scoped>
.menu-operation{
  text-align: left;
}

.menu-table{
  margin-top: 8px;
} 

</style>