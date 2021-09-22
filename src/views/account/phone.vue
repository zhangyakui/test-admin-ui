<template>
  <div class="phone page">
    <!-- 顶部操作 增 删 -->
    <div class="phone-operation">
      <div class="phone-operation-left">
        <el-select
        v-if="$tool.isPerm('account:phone:list')"
        v-model="agent" 
        placeholder="代理商" 
        @change="filterData"
        size="mini" 
        class="margin-right" 
        style="width: 100px" 
        clearable
        >
          <el-option
          v-for="item in agentOptions"
          :key="item.label"
          :label="item.label"
          :value="item.label">
          </el-option>
        </el-select>

        <el-select
        v-if="$tool.isPerm('account:phone:list')"
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
        v-if="$tool.isPerm('account:phone:list')"
        placeholder="请输入关键词" 
        v-model="formData.keyword"
        class="input-with-select margin-right" 
        size="mini" 
        style="width: 200px"
        @clear="getData"
        clearable
        @change="search"
        >
          <el-button slot="append" icon="el-icon-search" class="button">搜索</el-button>
        </el-input>

        <el-button 
        class="margin-right button el-icon-refresh-right" 
        type="success" 
        size="mini" 
        @click="refresh"
        v-if="$tool.isPerm('account:phone:list')"
        > 刷新
        </el-button>
      </div>

      <div class="phone-operation-right">
        <el-button 
        class="margin-right button el-icon-plus" 
        type="primary" 
        size="mini" 
        @click="addData"
        v-if="$tool.isPerm('account:phone:add')"
        > 添加
        </el-button>

        <el-button 
        class="margin-right button el-icon-download"
        size="mini" 
        @click="downloadExcel"
        v-if="$tool.isPerm('account:phone:excel')"
        > 导出表格
        </el-button>
      </div>
    </div>

    <!-- 表格展示 -->
    <div class="phone-table">
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

        <el-table-column type="expand">
            <template slot-scope="scope">
                <el-form label-position="left" inline class="demo-table-expand">
                    <el-form-item label="PUK"
                    >
                        <span>{{scope.row.puk}}</span>
                    </el-form-item>

                    <el-form-item label="归属地"
                    >
                        <span>{{scope.row.local}}</span>
                    </el-form-item>

                    <el-form-item label="实名信息"
                    >
                        <span>{{scope.row.realInfo}}</span>
                    </el-form-item>
                </el-form>
            </template>
        </el-table-column>

        <el-table-column
        prop="cardName"
        label="编号"
        min-width="100px"
        show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
        prop="number"
        label="号码"
        min-width="100px"
        show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
        prop="agent"
        label="代理商"
        min-width="100px"
        show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
        prop="operator"
        label="运营商"
        min-width="100px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.operator == 0">中国移动</span>
            <span v-else-if="scope.row.operator == 1">中国联通</span>
            <span v-else-if="scope.row.operator == 2">中国电信</span>
            <span v-else-if="scope.row.operator == 3">其他</span>
          </template>
        </el-table-column>

        <el-table-column
        prop="iccid"
        label="ICCID"
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
                <el-tag size="mini" type="success" v-if="scope.row.status == 0">正常</el-tag>
                <el-tag size="mini" type="warning" v-if="scope.row.status == 1">欠费</el-tag>
                <el-tag size="mini" type="info" v-if="scope.row.status == 2">停机</el-tag>
                <el-tag size="mini" type="danger" v-if="scope.row.status == 3">异常</el-tag>
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
            v-if="$tool.isPerm('account:phone:edit')"
            >编辑
            </el-button>

            <el-button
            icon="el-icon-delete"
            type="text"
            size="small"
            @click="deleteData(scope.row)"
            v-if="$tool.isPerm('account:phone:delete')"
            >删除
            </el-button>
          </template>
        </el-table-column>
       </el-table>

      <el-pagination
      @current-change="getData"
      :current-page.sync="formData.page"
      :page-size="formData.size"
      layout="total, prev, pager, next"
      :total="total">
      </el-pagination>
    </div>

    <!-- 弹框 -->
    <div class="phone-from">
      <el-dialog 
      width="650px"
      style="text-align: left;"
      :title="dialogTitle" 
      :visible.sync="dialogFormVisible"
      @close="resetForm"
      >
        <el-form size="mini" :model="formData" :rules="rules" ref="formData" label-suffix="：" label-width="92px">
            <el-form-item label="代理商" prop="agent">
                <el-select v-model="formData.agent" placeholder="请选择 或 创建代理商" allow-create filterable clearable :disabled="dialogTitle == '编辑手机号'">
                    <el-option
                    v-for="item in agentOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
        
            <el-form-item label="运营商" prop="operator">
                <el-select v-model="formData.operator" placeholder="请选择运营商" :disabled="dialogTitle == '编辑手机号'">
                    <el-option
                    v-for="item in operatorOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
        
            <el-row>
                <el-col :span="12">
                    <el-form-item label="号码" prop="number">
                        <el-input size="mini" placeholder="请输入手机号码" v-model="formData.number" :disabled="dialogTitle == '编辑手机号'"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="编号" prop="cardName">
                        <el-input size="mini" placeholder="请输入卡编号" v-model="formData.cardName"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item label="ICCID" prop="iccid">
                        <el-input size="mini" placeholder="请输入iccid" v-model="formData.iccid"></el-input>
                    </el-form-item>  
                </el-col>
                <el-col :span="12">
                    <el-form-item label="PUK" prop="puk">
                        <el-input size="mini" placeholder="请输入puk" v-model="formData.puk"></el-input>
                    </el-form-item> 
                </el-col>
            </el-row>
  
            <el-row>
                <el-col :span="12">
                    <el-form-item label="归属地" prop="local">
                        <el-input size="mini" placeholder="请输入归属地" v-model="formData.local"></el-input>
                    </el-form-item> 
                </el-col>
                <el-col :span="12">
                    <el-form-item label="实名信息" prop="realInfo">
                        <el-input size="mini" placeholder="请输入实名信息" v-model="formData.realInfo"></el-input>
                    </el-form-item> 
                </el-col>
            </el-row>
 
            <el-form-item label="状态" prop="status">
                <el-radio-group v-model="formData.status">
                <el-radio :label=0>正常</el-radio>
                <el-radio :label=1>欠费</el-radio>
                <el-radio :label=2>停机</el-radio>
                <el-radio :label=3>异常</el-radio>
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
      agentOptions: [],// 代理商选择
      status: null,// 过滤状态
      agent: null,// 代理商
      operatorOptions: [
          {value: 0, label: '中国移动'},
          {value: 1, label: '中国联通'},
          {value: 2, label: '中国电信'},
          {value: 3, label: '其他'},
      ],// 运营商选择
      statusOptions: [
          {value: 0, label: '正常'},
          {value: 1, label: '欠费'},
          {value: 2, label: '停机'},
          {value: 3, label: '异常'},
      ],// 状态选择
      formData: {// body参数
        id: 0,
        cardName: null,
        number: null,
        status: null,
        agent: null,
        operator: null,
        iccid: '',
        puk: '',
        local: '',
        realInfo: '',
        desc: '',
        page: 1,
        size: 10,
        keyword: ''
      },
      total: 0,
      rules: {
        cardName: [{ required: true, message: '请输入卡编号', trigger: ['blur', 'change'] }],
        number: [{ required: true, message: '请输入号码', trigger: ['blur', 'change'] }],
        agent: [{ required: true, message: '请选择或创建代理商', trigger: ['blur', 'change'] }],
        operator: [{ required: true, message: '请选择运营商', trigger: ['blur', 'change'] }]
      },
    }
  },
  created(){
    this.getData()
  },
  methods:{
    // 获取数据
    async getData(){
      const rsp = await this.$api.getPhoneList(this.formData)
      if (!rsp) return false
      this.dataList = rsp.data.data.list
      this.agentOptions = []
      rsp.data.data.categories.forEach((cate, index) => {
          this.agentOptions.push({
              value: index, label: cate.agent
          })
      })
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
      this.formData.agent = this.agent
      this.formData.status = this.status
      this.$data.formData.keyword = this.$options.data().formData.keyword
      this.formData.page = 1
      this.getData()
    },
    // 刷新数据
    async refresh(){
      this.$data.formData = this.$options.data().formData
      this.agent = null
      this.status = null
      if (await this.getData()) this.$message.success('刷新成功')
    },
    // 下载表格
    async downloadExcel(){
      const rsp = await this.$api.downloadPhone()
      if (!rsp) return 
      let dataList = []
      rsp.data.data.list.forEach(data => {
        let obj = {
          id: data.id,
          cardName: data.cardName,
          number: data.number,
          agent: data.agent,
          operator: this.operatorOptions[data.operator].label,
          iccid: data.iccid,
          puk: data.puk,
          local: data.local,
          realInfo: data.realInfo,
          desc: data.desc,
          status: this.statusOptions[data.status].label,
          createTime: data.createTime,
          updateTime: data.updateTime,
        }
        dataList.push(obj)
      })
      const header = ['ID', '编号', '号码', '代理商', '运营商', 'ICCID', 'PUK', '归属地', '实名信息', '描述', '状态', '创建日期', '更新日期']
      this.$csv.downloadCsv(dataList, { header }, "手机号数据.csv")
    },
    // 添加数据
    async addData(){
        this.resetForm()
        this.formData.agent = null
        this.formData.status = 0
        this.dialogTitle='添加手机号'
        this.dialogFormVisible = true
    },
    // 编辑数据
    async editData(row){
        this.resetForm()
        this.formData.id = row.id
        this.formData.status = row.status
        this.formData.agent = row.agent
        this.formData.operator = row.operator
        this.formData.cardName = row.cardName
        this.formData.number = row.number
        this.formData.iccid = row.iccid
        this.formData.puk = row.puk
        this.formData.local = row.local
        this.formData.realInfo = row.realInfo
        this.formData.desc = row.desc
        this.dialogTitle='编辑手机号'
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
            const rsp = await this.$api.deletePhone(row.id)
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
          if (this.dialogTitle == '添加手机号'){
            const rsp = await this.$api.addPhone(this.formData)
            if (!rsp) return
            if (rsp.data.code == 201){// 手机号已存在
              this.$message.error(rsp.data.msg)
              return
            }
             this.resetForm()
            if (await this.getData()) this.$message.success(rsp.data.msg)
            
          }else if(this.dialogTitle == '编辑手机号'){
            const rsp = await this.$api.editPhone(this.formData)
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
      this.$data.formData.cardName = this.$options.data().formData.cardName
      this.$data.formData.number = this.$options.data().formData.number
      this.$data.formData.status = this.status
      this.$data.formData.agent = this.agent
      this.$data.formData.operator = this.$options.data().formData.operator
      this.$data.formData.iccid = this.$options.data().formData.iccid
      this.$data.formData.puk = this.$options.data().formData.puk
      this.$data.formData.local = this.$options.data().formData.local
      this.$data.formData.realInfo = this.$options.data().formData.realInfo
      this.$data.formData.desc = this.$options.data().formData.desc
    }
  }
}
</script>

<style scoped>
.phone-operation{
  text-align: left;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.phone-table{
  margin-top: 8px;
} 


</style>