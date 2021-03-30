<template>
  <div class="app">
    <el-card class="box-card">
      <div class="search-list">
        <el-button @click="openAdmin('add','')" size="small">添加管理员</el-button>
        <el-input size="small" v-model="name" placeholder="姓名" style="width: 160px"></el-input>
        <el-input size="small" v-model="account" placeholder="账号" style="width: 160px"></el-input>
        <el-button type="primary" @click="getData()" size="small">搜索</el-button>
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
        <el-table-column prop="u_account" label="账号"></el-table-column>
        <el-table-column prop="u_name" label="名称"></el-table-column>
        <el-table-column prop="description" label="状态">
          <template slot-scope="scope">
            {{scope.row.status == 1?'正常':'禁用'}}
          </template>
        </el-table-column>
        <el-table-column prop="last_login_ip" label="上次登录IP" width="170px"></el-table-column>
        <el-table-column prop="last_login_time" label="上次登录时间" width="170px"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="170px"></el-table-column>
        <el-table-column prop="" label="角色名称">
          <template slot-scope="scope">
            {{scope.row.role.role_name}}
          </template>
        </el-table-column>
        <el-table-column prop="description" label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="warning" @click="openAdmin('edit',scope.row)" size="mini">编辑</el-button>
            <el-button type="danger" @click="deleteUser(scope.row.id)" size="mini">删除</el-button>
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
    <el-dialog title="添加管理员" :visible.sync="addAdmin" width="400px">
      <div class="from-list">
        <div class="from-title">管理员名称：</div>
        <div class="from-input">
          <el-input size="small" placeholder="管理员名称" v-model="admin_name"></el-input>
        </div>
      </div>
      <div class="from-list">
        <div class="from-title">管理员角色：</div>
        <div class="from-input">
          <el-select v-model="admin_type" style="width: 100%;" placeholder="请选择" size="small">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.role_name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="from-list">
        <div class="from-title">登录密码：</div>
        <div class="from-input">
          <el-input size="small" placeholder="登录密码" type="password" v-model="admin_psw"></el-input>
        </div>
      </div>
      <div class="from-list">
        <div class="from-title">真实姓名：</div>
        <div class="from-input">
          <el-input size="small" placeholder="真实姓名" v-model="admin_account"></el-input>
        </div>
      </div>
      <div class="from-list">
        <div class="from-title">是否启用：</div>
        <div class="from-input">
          <template>
            <el-radio v-model="admin_status" label="1">启用</el-radio>
            <el-radio v-model="admin_status" label="2">不启用</el-radio>
          </template>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="addAdmin = false">取 消</el-button>
        <el-button size="small" type="primary" @click="add_edit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        name:'',
        account:'',
        loading: false,
        addAdmin: false,
        userInfoDialog:false,
        admin_status:'1',
        admin_name:'',
        admin_account:'',
        admin_psw:'',
        admin_type:'',
        fromStatus:'',
        id: '',
        options: [{}],
        tableHeight: 500,
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
        this.getType()
      }
    },
    created: function () {
      this.tableHeight = window.innerHeight - 275;
      this.getData(this.PageSize, this.currentPage)
      this.getType()
    },
    methods: {
      getType(){
        var _this = this;
        this.$http.post(this.publicurl + '/admin/roles/list', {
          'page': this.currentPage,
          'limit': this.PageSize,
          'name': this.name,
          'account': this.account,
        })
          .then(function (res) {
            _this.$VerificationLogin(res)

            _this.options = res.data.result.list;
            console.log(res.data.result.list)

          })
      },
      openAdmin(type,data){
        if(type == 'add'){
            this.admin_name='';
            this.admin_account='';
            this.admin_psw='';
            this.admin_type='';
          }else if(type == 'edit'){
          console.log(data)
            this.admin_status= data.status+'';
            this.admin_name= data.u_name;
            this.admin_account= data.u_account;
            this.admin_psw= '';
            this.admin_type= Number(data.role_id);
            this.id = data.id;
          }
        this.fromStatus = type
        this.addAdmin = true
      },
      getData() {
        var _this = this;
        this.$http.post(this.publicurl + '/admin/adminUser/list', {
          'page': this.currentPage,
          'limit': this.PageSize,
          'name': this.name,
          'account': this.account,
        })
          .then(function (res) {
            _this.$VerificationLogin(res)
            if(res.data.code == 1) {
              _this.tableData = res.data.result.list;
              _this.totalCount = res.data.result.total
            }
          })
      },
      add_edit(){
        var _this = this;
        this.userInfoDialog = true
        this.$http.post(this.publicurl + '/admin/adminUser/'+this.fromStatus, {
          'id': this.id,
          'name': this.admin_name,
          'account': this.admin_account,
          'password': this.admin_psw,
          'role_id': this.admin_type,
        })
          .then(function (res) {
            _this.$VerificationLogin(res)
            if(res.data.code == 1){
              _this.$message({
                message: res.data.msg,
                type: 'success'
              });
            }
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
      deleteUser(id) {
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
  .from-list{
    margin-top: 20px;
    display: flex;
    height: 32px;
    line-height: 32px;
  }
  .from-title{
    flex: 1;
  }
  .from-input{
    flex: 2;
  }
</style>