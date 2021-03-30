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
        <el-table-column prop="sort" label="种类" width="180"></el-table-column>
        <el-table-column prop="description" label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="warning" @click="openAdmin('edit',scope.row)" size="mini">编辑</el-button>
            <el-button type="danger" @click="deleteUser(scope.row.id)" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="height: 10px"></div>
      <!-- <div class="tabListPage">
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-sizes="pageSizes"
                       :page-size="PageSize" layout="total, sizes, prev, pager, next, jumper"
                       :total="totalCount">
        </el-pagination>
      </div> -->
    </el-card>
    <el-dialog title="添加管理员" :visible.sync="addAdmin" width="400px">
      <div class="from-list">
        <div class="from-title">标签名字：</div>
        <div class="from-input">
          <el-input size="small" placeholder="标签名字" v-model="tags_name"></el-input>
        </div>
      </div>

      <div class="from-list">
        <div class="from-title">创建时间:</div>
        <div class="from-input">
          <el-input size="small" placeholder="创建时间" v-model="tags_create_name"></el-input>
        </div>
      </div>
      
      <div class="from-list">
        <div class="from-title">更新时间：</div>
        <div class="from-input">
          <el-input size="small" placeholder="更新时间" v-model="tags_update_name"></el-input>
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
        tableHeight: 600,
        tableData: [],
        addAdmin: false,
        id:'',
        tags_name:'',
        tags_create_name:'',
        tags_update_name:'',
        // 默认每页显示的页数（可修改）
        PageSize: 20,
        //默认显示几页
        currentPage:1,
        fromStatus:'',
      }
    },
    watch: {
      $route() {
        this.getList()
      }
    },
    created: function () {
      this.getList()
    },
    methods: {
      getList() {
        var _this = this;
        this.$http.get(this.publicurl + '/admin/Tags/list', {
        })
          .then(function (res) {
            _this.tableData = res.data.result.list;
            console.log(res.data.result.list)

          })
      },
      openTages(type,data) {
        if(type == 'add') {
          this.tags_name = '';
          this.tags_create_name = '';
          this.tags_update_name ='';
        }else if(type == 'edit'){
          console.log(data)
          this.tags_name = data.tages_name;
          this.tags_create_name = data.create_name;
          this.tags_update_name = data.update_name;
          this.id = data.id;
        }
        this.fromStatus = type
        this.addAdmin = true
      }
      // handleSizeChange(val) {
      //   // 改变每页显示的条数
      //   this.PageSize = val
      //   // 点击每页显示的条数时，显示第一页
      //   this.getData()
      //   // 注意：在改变每页显示的条数时，要将页码显示到第一页
      //   this.currentPage = 1
      // },
      // // 显示第几页
      // handleCurrentChange(val) {
      //   // 改变默认的页数
      //   this.currentPage = val
      //   // 切换页码时，要获取每页显示的条数
      //   this.getData()
      // },
    }
  }
</script>
