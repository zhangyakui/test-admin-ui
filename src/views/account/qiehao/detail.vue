<template>
  <div class="qiehao">
    <!-- 顶部操作 增 删 -->
    <div class="qiehao-operation">
      <div class="qiehao-operation-left">
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
        label="等级"
        min-width="100px"
        show-overflow-tooltip
        >
          <template slot-scope="scope" v-if="scope.row.userInfo">
            <span >{{scope.row.userInfo.level}}</span>
          </template>
        </el-table-column>

        <el-table-column
        prop="userInfo"
        label="粉丝"
        min-width="60px"
        show-overflow-tooltip
        >
          <template slot-scope="scope" v-if="scope.row.userInfo">
            <span>{{scope.row.userInfo.followerCount}}</span>
          </template>
        </el-table-column>

        <el-table-column
        prop="userInfo"
        label="作品"
        min-width="60px"
        show-overflow-tooltip
        >
          <template slot-scope="scope" v-if="scope.row.userInfo">
            <span>{{scope.row.worksInfo.length}}</span>
          </template>
        </el-table-column>

        <el-table-column
        prop="userInfo"
        label="总浏览"
        min-width="80px"
        show-overflow-tooltip
        >
          <template slot-scope="scope" v-if="scope.row.userInfo">
            <span>{{scope.row.userInfo.playCount}}</span>
          </template>
        </el-table-column>

        <el-table-column
        prop="userInfo"
        label="总收入"
        min-width="80px"
        show-overflow-tooltip
        >
          <template slot-scope="scope" v-if="scope.row.userInfo">
            <span>{{scope.row.userInfo.totalIncome}}</span>
          </template>
        </el-table-column>

        <el-table-column
        prop="userInfo"
        label="实名姓名"
        min-width="80px"
        show-overflow-tooltip
        >
          <template slot-scope="scope" v-if="scope.row.userInfo">
            <span>{{scope.row.userInfo.idNameEncrypt}}</span>
          </template>
        </el-table-column>

        <el-table-column
        prop="userInfo"
        label="实名ID"
        min-width="120px"
        show-overflow-tooltip
        >
          <template slot-scope="scope" v-if="scope.row.userInfo">
            <span>{{scope.row.userInfo.idNumberEncrypt}}</span>
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
        min-width="100px"
        >
          <template slot-scope="scope">
            <el-button
            :disabled="!scope.row.worksInfo"
            icon="el-icon-document"
            type="text"
            size="small"
            @click="worksData(scope.row)"
            v-if="$tool.isPerm('account:qiehao:edit')"
            >作品数据
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
    <el-dialog 
    class="qiehao-dialog"
    width="960px"
    style="text-align: left;"
    :title="dialogTitle" 
    :visible.sync="dialogFormVisible"
    @close="resetForm"
    >
      <el-table
      :data="worksInfo"
      ref="multipleTable"
      style="width: 100%;"
      size="mini"
      height="500px"
      highlight-current-row
      >
        <el-table-column
        label="#"
        type="index"
        min-width="50px"
        >
        </el-table-column>

        <el-table-column
        label="封面"
        prop="coverUrl"
        min-width="120px"
        show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-image
            style="width: 120px; height: 80px"
            :src="scope.row.coverUrl"
            :preview-src-list="[scope.row.coverUrl]"
            fit="cover"
            >
            </el-image>
          </template>
        </el-table-column>

        <el-table-column
        label="标题"
        prop="title"
        min-width="200px"
        show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-link 
            :href="scope.row.url" 
            target="_blank"
            class="table-cell-title"
            >
            {{scope.row.title}}
            </el-link>
          </template>
        </el-table-column>

        <el-table-column
        label="浏览"
        prop="playCount"
        min-width="60px"
        sortable
        >
        </el-table-column>

        <el-table-column
        label="评论"
        prop="commentCount"
        min-width="60px"
        sortable
        >
        </el-table-column>

        <el-table-column
        label="状态"
        prop="status"
        min-width="60px"
        sortable
        >
        </el-table-column>

        <el-table-column
        label="原因"
        prop="revisableReason"
        min-width="120px"
        sortable
        show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
        label="上传日期"
        prop="updatedTime"
        min-width="120px"
        sortable
        >
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false; resetForm();" size="small">返 回</el-button>
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
      worksInfo: [],
      formData: {// body参数
        id: 0,
        nickName: '',
        account: null,
        userInfo: null,
        worksInfo: null,
        page: 1,
        size: 10,
        keyword: ''
      },
      total: 0
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
      this.category = null
      if (await this.getData()) this.$message.success('刷新成功')
    },
    // 下载表格
    async downloadExcel(){
      const rsp = await this.$api.downloadQiEHao()
      if (!rsp) return 
      let userList = []
      let worksList = []
      rsp.data.data.list.forEach(data => {
        let userInfo = data.userInfo
        let worksInfo = data.worksInfo
        
        // 用户数据
        let user = {
          category: data.category,
          nickName: data.nickName,
          account: data.account,
          level: '',
          followerCount: '',
          worksCount: '',
          playCount: '',
          totalIncome: '',
          idNameEncrypt: '',
          idNumberEncrypt: '',
          updateTime: data.updateTime,
        }

        if (userInfo){
          user.level = userInfo.level
          user.followerCount = userInfo.followerCount
          user.worksCount = worksInfo.length
          user.playCount = userInfo.playCount
          user.totalIncome = userInfo.totalIncome
          user.idNameEncrypt = userInfo.idNameEncrypt
          user.idNumberEncrypt = userInfo.idNumberEncrypt
        }
        userList.push(user)
         
        // 作品数据
        let works = {
          category: data.category,
          nickName: data.nickName,
          account: data.account,
          id: '',
          title: '',
          playCount: '',
          commentCount: '',
          status: '',
          revisableReason: '',
          url: '',
          coverUrl: '',
          updatedTime: ''
        }
        if (worksInfo){
          worksInfo.forEach(item => {
            let _works = JSON.parse(JSON.stringify(works))
            _works.id = 'id:' + item.id
            _works.title = item.title
            _works.playCount = item.playCount
            _works.commentCount = item.commentCount
            _works.status = item.status
            _works.revisableReason = item.revisableReason
            _works.url = item.url
            _works.coverUrl = item.coverUrl
            _works.updatedTime = item.updatedTime
            worksList.push(_works)
          })
        }else{
          worksList.push(works)
        }
      })
      let header = ['分类', '昵称', '账号', '等级', '粉丝', '作品', '总浏览', '总收入', '实名姓名', '', '更新日期']
      this.$csv.downloadCsv(userList, { header }, "企鹅号-用户信息 [1-2].csv")

      header = ['分类', '昵称', '账号', 'ID', '标题', '浏览', '评论', '状态', '原因', '视频链接', '封面链接', '上传日期']
      this.$csv.downloadCsv(worksList, { header }, "企鹅号-用户作品 [2-2].csv")
    },
    // 作品数据
    async worksData(row){
        this.resetForm()
        this.worksInfo = row.worksInfo
        this.dialogTitle='作品数据'
        this.dialogFormVisible = true
    },
    // 重置表单
    resetForm() {
      this.$data.nickName = this.$options.data().nickName
      this.$data.account = this.$options.data().account
      this.$data.userInfo = this.$options.data().userInfo
      this.$data.worksInfo = this.$options.data().worksInfo
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