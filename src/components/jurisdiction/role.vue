<template>
  <div class="app">
    <el-card class="box-card">
      <div class="search-list">
        <el-button @click="openAdmin('add','')" size="small">添加角色</el-button>
        <el-input size="small" v-model="name" placeholder="角色名称" style="width: 160px"></el-input>
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
        <el-table-column prop="role_name" label="角色名称"></el-table-column>
        <el-table-column prop="role_auth" label="权限"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="170px"></el-table-column>
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
    <el-dialog title="添加角色" :visible.sync="addAdmin" width="400px">
      <div class="from-list">
        <div class="from-title">角色名称：</div>
        <div class="from-input">
          <el-input size="small" placeholder="角色名称" v-model="admin_name"></el-input>
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
        loading: false,
        addAdmin: false,
        admin_name:'',
        fromStatus:'',
        auth:'',
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
      }
    },
    created: function () {
      this.tableHeight = window.innerHeight - 275;
      this.getData(this.PageSize, this.currentPage)
    },
    methods: {
      getData(){
        var _this = this;
        this.$http.post(this.publicurl + '/admin/roles/list', {
          'page': this.currentPage,
          'limit': this.PageSize,
          'name': this.name,
        })
          .then(function (res) {
            _this.$VerificationLogin(res)
            _this.tableData = res.data.result.list;
            _this.totalCount = res.data.result.total

          })
      },
      openAdmin(type,data){
        if(type == 'add'){
            this.admin_name='';
          }else if(type == 'edit'){
          console.log(data)
            this.admin_name= data.role_name;
            this.id = data.id;
          }
        this.fromStatus = type
        this.addAdmin = true
      },
      add_edit(){
        var _this = this;
        this.$http.post(this.publicurl + '/admin/roles/'+this.fromStatus, {
          'id': this.id,
          'name': this.admin_name,
          'auth': this.auth,
        })
          .then(function (res) {
            _this.$VerificationLogin(res)
            if(res.data.code == 1){
              _this.$message({
                message: res.data.msg,
                type: 'success'
              });
              _this.getData()
            }
          })
      },
      deleteUser(id) {
        this.$confirm('此操作将无法恢复, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fromStatus = 'delete'
          this.add_edit(id)
        }).catch(() => {
        });
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
