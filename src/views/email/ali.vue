<template>
  <div class="ali page">
    <!-- 操作 -->
    <div class="ali-operation">
        <div>
            <el-image
            src="http://mail.hichina.com/static/0.1.10/images/forNetCN/logo.png"
            fit="fit">
            </el-image>
        </div>

        <div class="right">
            <el-button 
            class="margin-right button el-icon-plus" 
            type="primary" 
            size="mini" 
            @click="addData"
            v-if="$tool.isPerm('email:ali:add')"
            > 添加
            </el-button>

            <el-button 
            class="margin-right button el-icon-download"
            size="mini" 
            @click="downloadExcel"
            v-if="$tool.isPerm('email:ali:excel')"
            > 导出表格
            </el-button>
        </div>
    </div>

    <!-- 主体 -->
    <div class="ali-content">
        <!-- 账号列表 -->
        <div class="ali-content-account">
            <div style="text-align: left">
                <el-input 
                v-if="$tool.isPerm('email:ali:list')"
                placeholder="请输入关键词" 
                v-model="formData.keyword"
                class="input-with-select margin-right" 
                size="mini" 
                @clear="getData"
                @change="search"
                clearable
                >
                <el-button slot="append" icon="el-icon-search" class="button"></el-button>
                </el-input>
            </div>

            <div class="ali-content-account-list">
                <ul v-for="(item, index) in dataList" :key="index">
                    <li @click="select(item.id, item)" :class="selIdx == item.id ? 'select' : ''" >
                        <el-row>
                            <el-col :span="5">
                                <el-avatar :size="45" v-if="item.avatarUrl">
                                <img :src="item.avatarUrl"/>
                                </el-avatar>
                                <el-avatar :size="45" v-else icon="el-icon-user-solid"></el-avatar>
                            </el-col>
                            <el-col :span="19">
                                <span class="text">{{item.account}}</span>
                                <br>
                                <span class="text" style="color: #909399">{{item.password}}</span>
                            </el-col>
                        </el-row>

                        <el-row>
                            <el-col :span="14">
                                <el-tag size="mini" type="success" v-if="item.status == 0">使用</el-tag>
                                <el-tag size="mini" type="info" v-if="item.status == 1">停用</el-tag>
                                <el-tag size="mini" type="danger" v-if="item.status == 2">废除</el-tag>
                            </el-col>
                            <el-col :span="10">
                                <el-button
                                icon="el-icon-edit"
                                type="text"
                                size="small"
                                @click="editData(item)"
                                v-if="$tool.isPerm('email:ali:edit')"
                                >编辑
                                </el-button>

                                <el-button
                                icon="el-icon-delete"
                                type="text"
                                size="small"
                                @click="deleteData(item)"
                                v-if="$tool.isPerm('email:ali:delete')"
                                >删除
                                </el-button>

                                <!-- <el-popover
                                style="margin-left: 8px"
                                placement="top-start"
                                width="200"
                                trigger="hover"
                                :content="item.desc">
                                    <el-button
                                    icon="el-icon-warning-outline"
                                    type="text"
                                    size="small"
                                    slot="reference"
                                    >描述
                                    </el-button>
                                </el-popover> -->
    
                            </el-col>
                        </el-row>

                    </li>
                </ul>
            </div>

            <el-pagination
            @current-change="getData"
            :current-page.sync="formData.page"
            :page-size="formData.size"
            :pager-count="2"
            layout="total, prev, next, jumper"
            :total="total">
            </el-pagination>
        </div>

        <!-- 内容 -->
        <div class="ali-content-view">
            <div 
            v-show="selIdx != null"
            class="ali-content-view-nav"
            style="text-align: right"
            >
                <el-button 
                class="margin-right button el-icon-refresh"
                type="success" 
                size="mini" 
                @click="getEmail(true)"
                v-if="$tool.isPerm('email:ali:email')"
                > 重新拉取
                </el-button>
            </div>

            <el-empty v-if="emailList.length == 0" style="margin-top: 150px" description="当前暂无邮件"></el-empty>
            <div class="ali-content-view-list" v-else>
                <ul v-for="(item, index) in emailList" :key="index">
                    <li>
                        <div class="ali-content-view-list-item">
                            <!-- 发件人 发件地址 发件日期 -->
                            <el-row :span="2">
                                <el-col :span="6">
                                    <el-link type="primary" :underline="false">发件人：</el-link>
                                    <span>{{item.clientExtraInfo.encRcpLineContent}}</span> <br>
                                    <el-link type="primary" :underline="false">收件日期：</el-link>
                                    <span style="color: #909399; font-size: 12px">{{item.clientExtraInfo.encFullDisplayTime}}</span> <br>
                                </el-col>
                                <el-col :span="18">
                                    <el-link type="primary" :underline="false">主题：</el-link>
                                    <span>{{item.encSubject}}</span> <br>
                                    <el-link type="primary" :underline="false">内容：</el-link>
                                    <span style="color: #909399; font-size: 12px">{{item.encSummary}}</span>
                                </el-col>
                            </el-row>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <!-- 弹框 -->
    <div class="ali-from">
      <el-dialog 
      width="650px"
      style="text-align: left;"
      :title="dialogTitle" 
      :visible.sync="dialogFormVisible"
      @close="resetForm"
      >
        <el-form size="mini" :model="formData" :rules="rules" ref="formData" label-suffix="：" label-width="92px">
          <el-form-item label="账号" prop="account">
            <el-input size="mini" placeholder="请输入账号" v-model="formData.account" :disabled="dialogTitle == '编辑阿里邮箱'"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input size="mini" placeholder="请输入密码" v-model="formData.password"></el-input>
          </el-form-item>

          <el-form-item label="手机号" prop="phone">
            <el-input size="mini" placeholder="请输入手机号" v-model="formData.phone"></el-input>
          </el-form-item>

          <el-form-item label="Cookie" prop="cookies">
            <el-input size="mini" placeholder="请输入Cookie (已登录阿里邮箱页面 按F12 在console 里输入 document.cookie 即可)" v-model="formData.cookies"></el-input>
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
      selIdx: null,// 选择的索引
      statusOptions: [
          {value: 0, label: '使用'},
          {value: 1, label: '停用'},
          {value: 2, label: '废除'}
      ],// 状态选择
      formData: {// body参数
        id: 0,
        account: null,
        password: null,
        phone: '',
        cookies: '',
        status: null,
        desc: '',
        page: 1,
        size: 5,
        keyword: '',
      },
      emailList: [],// 邮件列表
      emailInfo: {
        name: '',// 发件人
        address: '',// 发件地址
        content: '',// 发件内容,
        date: '',// 发件日期
      },
      total: 0,
      rules: {
        account: [{ required: true, message: '请输入邮箱地址', trigger: ['blur', 'change'] }],
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
      const rsp = await this.$api.getAliEmailList(this.formData)
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
      this.category = null
      if (await this.getData()) this.$message.success('刷新成功')
    },
    // 下载表格
    async downloadExcel(){
      const rsp = await this.$api.downloadAliEmail()
      if (!rsp) return 
      let dataList = []
      rsp.data.data.list.forEach(data => {
        let obj = {
          id: data.id,
          account: data.account,
          password: data.password,
          phone: data.phone,
          cookies: data.cookies,
          status: ['使用', '停用', '废除'][data.status],
          desc: data.desc,
          createTime: data.createTime,
          updateTime: data.updateTime,
        }
        dataList.push(obj)
      })
      const header = ['ID', '账号', '密码', '手机号', 'Cookie', '运营状态', '描述', '创建日期', '更新日期']
      this.$csv.downloadCsv(dataList, { header }, "阿里邮箱数据.csv")
    },
    // 添加数据
    async addData(){
        this.resetForm()
        this.formData.status = 0
        this.formData.category = null
        this.dialogTitle='添加阿里邮箱'
        this.dialogFormVisible = true
    },
    // 编辑数据
    async editData(row){
        this.resetForm()
        this.formData.id = row.id
        this.formData.account = row.account
        this.formData.password = row.password
        this.formData.phone = row.phone
        this.formData.cookies = row.cookies
        this.formData.status = row.status
        this.formData.desc = row.desc
        this.dialogTitle='编辑阿里邮箱'
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
          const rsp = await this.$api.deleteAliEmail(row.id)
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
          if (this.dialogTitle == '添加阿里邮箱'){
            const rsp = await this.$api.addAliEmail(this.formData)
            if (!rsp) return
            if (rsp.data.code == 201){// 手机号已存在
              this.$message.error(rsp.data.msg)
              return
            }
             this.resetForm()
            if (await this.getData()) this.$message.success(rsp.data.msg)
            
          }else if(this.dialogTitle == '编辑阿里邮箱'){
            const rsp = await this.$api.editAliEmail(this.formData)
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
    // 选择账号
    async select(index, row){
        if (index == this.selIdx) return
        this.selIdx = index
        console.log('选择账号: ', row.account)
        this.formData.id = row.id
        this.emailList = []
        await this.getEmail()
    },
    // 接收邮件
    async getEmail(show){
        const rsp = await this.$api.getAliEmailData(this.formData.id)
        if (rsp.data.code == 404){
            this.$message.error(rsp.data.msg)
            return
        }
        if (show) this.$message.success('拉取完毕')
        this.emailList = rsp.data.data
    },
    // 重置表单
    resetForm() {
      if (this.$refs.formData) this.$refs.formData.resetFields()
      this.$data.formData.account = this.$options.data().formData.account
      this.$data.formData.password = this.$options.data().formData.password
      this.$data.formData.phone = this.$options.data().formData.phone
      this.$data.formData.cookies = this.$options.data().formData.cookies
      this.$data.formData.status = this.status
      this.$data.formData.desc = this.$options.data().formData.desc
    }
  }
}
</script>

<style scoped>
.ali{
    display: flex;
    flex-direction: column;
    /* overflow: hidden; */
}

.ali-operation{
    text-align: left;
    height: 35px;
    line-height: 35px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.ali-content{
    /* height: 100%; */
    flex: 1;
    margin-top: 8px;
    display: flex;
    flex-direction: row;
}

.ali-content-account{
    width: 300px;
    height: 100%;
    margin-right: 8px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    background-color: rgba(144, 147, 147, .1);
}

.ali-content-account-list{
    text-align: left;
}

ul{
    list-style-type: none;
}

ul>li{
    width: 100%;
    margin-top: 8px;
    padding: 10px;
    line-height: 25px;
    border-radius: 3px;
    background-color: #FFFFFF;
}

.ali-content-view{
    padding: 10px;
    flex: 1;
    background-color: rgba(144, 147, 147, .1);
    overflow: auto;
}

.ali-content-view-nav{

}

.ali-content-view-list{
    margin-top: 8px;
}

.ali-content-view-list-item{
    text-align: left;
}

.select{
    background-color: #EBEEF5;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
    /* box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1) */
}

.text{
    word-wrap:break-word;
}

span{
    font-size: 14px;
}
</style>