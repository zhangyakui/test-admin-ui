<template>
  <div class="qiehao">
    <!-- 顶部操作 增 删 -->
    <div class="qiehao-operation">
      <div class="qiehao-operation-left">
        <el-select
        v-if="$tool.isPerm('account:qiehao:list')"
        v-model="platform" 
        placeholder="平台镜像" 
        @change="filterData"
        size="mini" 
        class="margin-right" 
        style="width: 100px" 
        clearable
        >
          <el-option
          v-for="item in platformOptions"
          :key="item.value"
          :label="item.label"
          :value="item.label">
          </el-option>
        </el-select>

        <el-input 
        v-if="$tool.isPerm('account:qiehao:list')"
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
        v-if="$tool.isPerm('account:qiehao:list')"
        > 刷新
        </el-button>
      </div>

      <div class="qiehao-operation-right">
        <el-button 
        class="margin-right button el-icon-download"
        size="mini" 
        @click="downloadExcel"
        v-if="$tool.isPerm('account:qiehao:excel')"
        > 导出表格
        </el-button>
      </div>
    </div>

    <!-- 表格展示 -->
    <div class="qiehao-table">
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
            <el-avatar :size="40" v-if="scope.row.userInfo">
              <img :src="scope.row.userInfo.avatarUrl"/>
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
        prop="userInfo"
        label="UID"
        min-width="120px"
        show-overflow-tooltip
        >
          <template slot-scope="scope" v-if="scope.row.userInfo">
            <span>{{scope.row.userInfo.uid}}</span>
          </template>
        </el-table-column>

        <el-table-column
        prop="platform"
        label="镜像平台"
        min-width="70px"
        show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
        prop="homeInfo"
        label="镜像头像"
        min-width="70px"
        show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-avatar :size="40" v-if="scope.row.homeInfo">
              <img :src="scope.row.homeInfo.avatarUrl"/>
            </el-avatar>
            <el-avatar :size="40" v-else icon="el-icon-user-solid"></el-avatar>
          </template>
        </el-table-column>

        <el-table-column
        prop="homeInfo"
        label="镜像昵称"
        min-width="120px"
        show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-if="scope.row.homeInfo">{{scope.row.homeInfo.nickName}}</span>
          </template>
        </el-table-column>

        <el-table-column
        prop="homeInfo"
        label="镜像UID"
        min-width="100px"
        show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-if="scope.row.homeInfo">{{scope.row.homeInfo.uid}}</span>
          </template>
        </el-table-column>

        <el-table-column
        prop="homeLink"
        label="镜像主页"
        min-width="200px"
        show-overflow-tooltip
        >
         <template slot-scope="scope">
            <el-link 
            v-if="scope.row.homeLink"
            :href="scope.row.homeLink" 
            target="_blank"
            class="table-cell-title"
            >
            {{scope.row.homeLink}}
            </el-link>
            <span v-else>{{scope.row.homeLink}}</span>
          </template>
        </el-table-column>

        <el-table-column
        prop="startTime"
        label="起始日期"
        min-width="80px"
        show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
        prop="endTime"
        label="截止日期"
        min-width="80px"
        show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
        fixed="right"
        label="操作"
        min-width="100px"
        >
          <template slot-scope="scope">
            <el-button
            icon="el-icon-setting"
            type="text"
            size="small"
            @click="editData(scope.row)"
            v-if="$tool.isPerm('account:qiehao:edit')"
            >配置
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
    <el-dialog 
    width="650px"
    style="text-align: left;"
    :title="dialogTitle" 
    :visible.sync="dialogFormVisible"
    @close="resetForm"
    >
      <el-form size="mini" :model="formData" :rules="rules" ref="formData" label-suffix="：" label-width="92px">
        <el-form-item label="平台镜像" prop="platform">
          <el-select v-model="formData.platform" placeholder="请选择 或 创建平台镜像名称" allow-create filterable clearable>
            <el-option
            v-for="item in platformOptions"
            :key="item.value"
            :label="item.label"
            :value="item.label"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="镜像主页" prop="homeLink">
          <el-input size="mini" placeholder="请输入镜像主页链接" v-model="formData.homeLink"></el-input>
        </el-form-item>

        <el-form-item label="起始日期" prop="startTime">
          <el-input size="mini" placeholder="请输入监控起始日期" v-model="formData.startTime"></el-input>
        </el-form-item>

        <el-form-item label="截止日期" prop="endTime">
          <el-input size="mini" placeholder="请输入监控截止日期" v-model="formData.endTime"></el-input>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false; resetForm();" size="small">取 消</el-button>
        <el-button type="primary"  size="small" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return {
      dataList: [],// 数据
      dialogFormVisible: false,// dialog对话框
      dialogTitle: '',// dialog对话框标题
      platform: null,// 镜像平台
      platformOptions: [],// 分类选择
      formData: {// body参数
        id: 0,
        userInfo: null,
        homeInfo: null,
        platform: null,
        homeLink: '',
        startTime: '',
        endTime: '',
        page: 1,
        size: 10,
        keyword: ''
      },
      total: 0,
       rules: {
        platform: [{ required: true, message: '请选择 或 创建平台镜像名称', trigger: ['blur', 'change'] }],
        homeLink: [{ required: true, message: '请输入镜像主页', trigger: ['blur', 'change'] }]
      }
    }
  },
  created(){
    this.getData()
  },
  methods:{
    // 获取数据
    async getData(){
      const rsp = await this.$api.getQiEHaoList(this.formData)
      if (!rsp) return false
      this.dataList = rsp.data.data.list
      this.total = rsp.data.data.total
      this.platformOptions = []
       rsp.data.data.platforms.forEach((data, index) => {// 过滤分类
        this.platformOptions.push({
          value: index,
          label: data.platform
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
      this.formData.platform = this.platform
      this.$data.formData.keyword = this.$options.data().formData.keyword
      this.formData.page = 1
      this.getData()
    },
    // 刷新数据
    async refresh(){
      this.$data.formData = this.$options.data().formData
      this.platform = null
      if (await this.getData()) this.$message.success('刷新成功')
    },
    // 下载表格
    async downloadExcel(){
      const rsp = await this.$api.downloadQiEHao()
      if (!rsp) return 
      let userList = []
      rsp.data.data.list.forEach(data => {
        let userInfo = data.userInfo
        let worksInfo = data.worksInfo
        let homeInfo = data.homeInfo

        let user = {
          category: data.category,
          nickName: data.nickName,
          account: data.account,
          level: '',
          followerCount: '',
          worksCount: '',
          playCount: '',
          updateTime: '',
          platform: data.platform,
          pNickName: '',
          puid: '',
          pFollowerCount: '',
          pWorksCount: '',
          startTime: data.startTime,
          endTime: data.endTime,
          purl: data.homeLink,
        }

        if (userInfo){
          user.level = userInfo.level
          user.followerCount = userInfo.followerCount
          user.playCount = userInfo.playCount
          user.url = userInfo.url
          user.updateTime = data.updateTime
        }

        if (worksInfo){
          user.worksCount = worksInfo.length
        }

        if (homeInfo){
          user.platform = data.platform
          user.pNickName = homeInfo.nickName
          user.puid = 'uid:' + homeInfo.uid
          user.pFollowerCount = homeInfo.followerCount
          user.pWorksCount = homeInfo.worksCount
          user.purl = data.homeLink
        }

        
        userList.push(user)
      })
      let header = ['分类', '昵称', '账号', '等级', '粉丝', '作品', '总浏览', '更新日期', '平台镜像', '镜像昵称', '镜像UID', '镜像粉丝', '镜像作品', '起始日期', '截止日期', '镜像主页链接']
      this.$csv.downloadCsv(userList, { header }, "企鹅号-镜像映射信息.csv")
    },
    // 镜像数据
    async editData(row){
        this.resetForm()
        this.formData.id = row.id
        this.formData.platform = row.platform
        this.formData.homeLink = row.homeLink
        this.formData.startTime = row.startTime
        this.formData.endTime = row.endTime
        this.dialogTitle='镜像配置'
        this.dialogFormVisible = true
    },
    // 提交表单
    submitForm(){
      this.$refs.formData.validate(async (valid) => {
        if (valid){
          const rsp = await this.$api.editQiEHao('image', this.formData)
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
      })
    },
    // 重置表单
    resetForm() {
      this.$data.userInfo = this.$options.data().userInfo
      this.$data.homeInfo = this.$options.data().homeInfo
      this.$data.platform = this.platform
      this.$data.homeLink = this.$options.data().homeLink
      this.$data.startTime = this.$options.data().startTime
      this.$data.endTime = this.$options.data().endTime
    }
  }
}
</script>

<style>

</style>

<style scoped>
.qiehao-operation{
  text-align: left;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.qiehao-table{
  margin-top: 8px;
} 

</style>