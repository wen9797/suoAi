<template>
  <div class="app">
    <el-card class="box-card">
      <div class="search-list">
        <el-input v-model="user" style="width: 160px" size="small" placeholder="用户名"></el-input>
        <el-input v-model="user" style="width: 160px" size="small" placeholder="手机号"></el-input>
        <el-input v-model="user" style="width: 160px" size="small" placeholder="注册时间"></el-input>
        <el-button type="primary" @click="search()" size="small">搜索</el-button>
      </div>
      <div style="clear: both"></div>
    </el-card>
    <div style="height: 15px"></div>
    <el-card class="box-card">
      <el-table
        :data="tableData"
        :height="tableHeight"
        style="width: 100%" stripe
        :cell-style="{'text-align': 'center','padding-top':'5px','padding-bottom':'5px'}"
        :header-cell-style="{'text-align':'center'}"
        border>
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="mobile" label="手机号"></el-table-column>
        <el-table-column prop="create_time" label="注册时间"></el-table-column>
        <!--<el-table-column prop="update_time" label="注册时间">
          <template slot-scope="scope">
            {{set_time(scope.row.update_time)}}
          </template>
        </el-table-column>-->
        <el-table-column prop="description" label="状态">
          <template slot-scope="scope">
            {{scope.row.status == 1?'正常':'禁用'}}
          </template>
        </el-table-column>
        <!--<el-table-column prop="client" label="客户端">
          <template slot-scope="scope">
            <span v-if="scope.row.client == 1">安卓</span>
            <span v-if="scope.row.client == 2">ios</span>
            <span v-if="scope.row.client == 3">H5</span>
            <span v-if="scope.row.client == 4">微信小程序</span>
          </template>
        </el-table-column>-->
        <el-table-column prop="description" label="操作">info
          <template slot-scope="scope">
            <el-button type="primary" @click="selectUser(scope.row.id)" size="mini">查看</el-button>
            <el-tooltip class="item" effect="dark" content="编辑用户" placement="top">
              <el-button type="warning" @click="stockDelete(scope.row.id)" size="mini"><i class="el-icon-edit"></i>
              </el-button>
            </el-tooltip>
            <el-button type="success" @click="stockDelete(scope.row.id)" size="mini">账户</el-button>
            <el-button type="danger" @click="stockDelete(scope.row.id)" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="height: 10px"></div>
      <div class="tabListPage">
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-sizes="pageSizes"
                       :page-size="PageSize" layout="total, sizes, prev, pager, next, jumper"
                       :total="totalCount">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog title="用户详情" :visible.sync="userInfoDialog" width="80%">
      <div class="user-header">
        <img src="../../image/bg.jpg"/>
      </div>
      <div class="info-title">用户信息</div>
      <div class="">
        <div class="content-list">
          <div class="user-list">
            <div class="user-title">用户名：</div>
            <div class="user-content">{{userInfo.userInfo.name}}</div>
          </div>
          <div class="user-list">
            <div class="user-title">用户ID：</div>
            <div class="user-content">{{userInfo.userInfo.id}}</div>
          </div>
        </div>
        <div class="content-list">
          <div class="user-list">
            <div class="user-title">用户昵称：</div>
            <div class="user-content">{{userInfo.userInfo.nickname}}</div>
          </div>
          <div class="user-list">
            <div class="user-title">性别：</div>
            <div class="user-content" v-if="userInfo.userInfo.sex == 0">未知</div>
            <div class="user-content" v-if="userInfo.userInfo.sex == 1">男</div>
            <div class="user-content" v-if="userInfo.userInfo.sex == 2">女</div>
          </div>
        </div>
        <div class="content-list">
          <div class="user-list">
            <div class="user-title">是否实名：</div>
            <div class="user-content">用户55664444</div>
          </div>
          <div class="user-list">
            <div class="user-title">客户端：</div>
            <div class="user-content">用户55664444</div>
          </div>
        </div>
        <div class="content-list">
          <div class="user-list">
            <div class="user-title">注册时间：</div>
            <div class="user-content">用户55664444</div>
          </div>
          <div class="user-list">
            <div class="user-title">邀请码：</div>
            <div class="user-content">用户55664444</div>
          </div>
        </div>
      </div>
      <div class="user-card">
        <el-tabs>
          <el-tab-pane label="用户账户">用户管理2</el-tab-pane>
          <el-tab-pane label="用户资产">用户管理2</el-tab-pane>
          <el-tab-pane label="用户管理3">用户管理3</el-tab-pane>
          <el-tab-pane label="用户管理4">用户管理4</el-tab-pane>
        </el-tabs>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="userInfoDialog = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        loading: false,
        userInfoDialog:false,
        user: '',
        id: '',
        tableHeight: 500,
        userInfo:{
          assets:{},
          identity:{},
          userInfo:{}
        },
        // 总数据
        tableData: [],
        // 默认显示第几页
        currentPage: 1,
        // 总条数，根据接口获取数据长度(注意：这里不能为空)
        totalCount: 1,
        // 个数选择器（可修改）
        pageSizes: [20, 50, 150, 300],
        // 默认每页显示的条数（可修改）
        PageSize: 20,
      }
    },
    watch: {
      $route() {
        this.tableHeight = window.innerHeight - 275;
        this.getData(this.PageSize, this.currentPage)
      }
    },
    created: function () {
      this.tableHeight = window.innerHeight - 275;
      this.getData(this.PageSize, this.currentPage)
    },
    methods: {
      getData() {
        var _this = this;
        this.$http.post(this.publicurl + '/admin/user/list', {
          'page': this.currentPage,
          'limit': this.PageSize,
        })
          .then(function (res) {
            _this.$VerificationLogin(res)

            _this.tableData = res.data.result.list;
            _this.totalCount = res.data.result.total

          })
      },
      selectUser(id) {
        var _this = this;
        this.userInfoDialog = true
        this.$http.post(this.publicurl + '/admin/user/userInfo', {
          'id': id,
        })
          .then(function (res) {
            _this.$VerificationLogin(res)
            this.userInfo = res.data.result
          })
      },
      stockDelete(id) {
        this.$confirm('此操作将无法恢复, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteStock(id)
        }).catch(() => {
        });
      },
      deleteStock(id) {
        if (id != 0) {
          this.id = id
        }
        var _this = this
        this.$http.post('' + 'stock/admin/holidayDelete', {
          'k': localStorage['stock_token'],
          'id': this.id
        })
          .then(function (res) {
            if (res.data.code != 200) {
              _this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            } else {
              _this.$message({
                message: res.data.msg,
                type: 'success'
              });
              _this.getData()
            }
          })
      },
      // 每页显示的条数
      handleSizeChange(val) {
        // 改变每页显示的条数
        this.PageSize = val
        // 点击每页显示的条数时，显示第一页
        this.getData()
        // 注意：在改变每页显示的条数时，要将页码显示到第一页
        this.currentPage = 1
      },
      // 显示第几页
      handleCurrentChange(val) {
        // 改变默认的页数
        this.currentPage = val
        // 切换页码时，要获取每页显示的条数
        this.getData()
      },
    },
  }
</script>

<style scoped>
  .info-title{
    font-size: 20px;
    height: 50px;
    line-height: 50px;
  }
  .user-header img{
    width: 100px;
    height: 100px;
  }
  .breadcrumb{
    margin-top: 8px;
    width: 200px;
    float: left;
  }
  .user-card{
    margin-top: 20px;
  }
  .content-list{
    display: flex;
  }
  .user-list{
    height: 30px;
    line-height: 30px;
    display: flex;
    flex: 1;
  }
  .user-title{
    flex: 1;
  }
  .user-content{
    flex: 4;
  }
</style>
