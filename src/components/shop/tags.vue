<template>
  <div>
    <el-card>
      <div class="search-list">
        <el-button @click="openTages('add','')" size="small">添加分类</el-button>
      </div>
    </el-card>

    <el-card>
      <el-table
        :data="tableData"
        :height="tableHeight"
        :cell-style="{'text-align': 'center','padding-top':'5px','padding-bottom':'5px'}"
        :header-cell-style="{'text-align':'center'}"
        border
        style="width: 100%">
        <el-table-column prop="id" label="ID" width="180"></el-table-column>
        <el-table-column prop="tags_name" label="标签名字" width="180"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="180"></el-table-column>
        <el-table-column prop="update_time" label="更新时间" width="180"></el-table-column>
        <el-table-column prop="sort" label="排序" width="180"></el-table-column>
        <el-table-column prop="description" label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="warning" @click="openTages('edit',scope.row)" size="mini">编辑</el-button>
            <el-button type="danger" @click="deleteUser(scope.row.id)" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="height: 10px"></div>
      <div class="tabListPage">
        <el-pagination 
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-sizes="pageSizes"
                       :page-size="PageSize" layout="total, sizes, prev, pager, next, jumper"
                       :total="totalCount">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog title="添加标签" :visible.sync="addTages" width="400px">
      <div class="from-list">
        <div class="from-title">标签名字:</div>
        <div class="from-input">
          <el-input size="small" placeholder="" v-model="tags_names"></el-input>
        </div>
      </div>
      <div class="from-list">
        <div class="from-title">排序:</div>
        <div class="from-input">
          <el-input size="small" placeholder="" v-model="sort"></el-input>
        </div>
      </div>
 
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="addTages = false">取 消</el-button>
        <el-button size="small" type="primary" @click="add_edit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableHeight: 600,
        tableData: [],
        addTages: false,
        userInfoDialog:false,
        
        tags_names:'',
        sort:'',
        id:'',
        
        // 默认每页显示的页数（可修改）
        PageSize: 10,
        //默认显示几页
        currentPage:1,
        totalCount:1,
        // 个数选择器（可修改）
        pageSizes: [10, 50, 150, 300],
        fromStatus:'',
      }
    },
    watch: {
      $route() {
        this.getList(this.PageSize, this.currentPage)
      }
    },
    created: function () {
      this.getList(this.PageSize, this.currentPage)
    },
    methods: {
       openTages(type,data) {
        if(type == 'add') {
          this.tags_names = '';
          this.sort = '';
        }else if(type == 'edit'){
          console.log(data)
          this.tags_names = data.tags_name;
          
          this.sort = data.sort;
          this.id = data.id;
        }
        this.fromStatus = type
        this.addTages = true
      },
      getList() {
        var _this = this;
        this.$http.get(this.publicurl + '/admin/Tags/list', {
        })
          .then(function (res) {
            if(res.data.code == 1) {
              _this.tableData = res.data.result.list;
              _this.totalCount = res.data.result.total
              console.log(res)
              console.log(res.data.result.list)
            }

          })
      },
     
      add_edit() {
        var _this = this
        this.userInfoDialog = true
        this.$http.post(this.publicurl + '/admin/Tags/'+this.fromStatus, {
          
          name: this.tags_names,
          sort:this.sort,
          id:this.id
          
        })
        .then(function (res) {
          _this.$VerificationLogin(res)
           if(res.data.code == 1){
             
             _this.addTages = false
             _this.getList(_this.PageSize, _this.currentPage)
               _this.$message({
                message: res.data.msg,
                 type: 'success'
              });
               console.log(ds)
           }
        })
      },

      handleSizeChange(val) {
        // 改变每页显示的条数
        this.PageSize = val
        // 点击每页显示的条数时，显示第一页
        this.getList()
        // 注意：在改变每页显示的条数时，要将页码显示到第一页
        this.currentPage = 1
      },
      // 显示第几页
      handleCurrentChange(val) {
        // 改变默认的页数
        this.currentPage = val
        // 切换页码时，要获取每页显示的条数
        this.getList()
      },
    }
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
