<template>
  <div>
    <el-card>
      <div class="search-list">
        <el-button @click="openAdmin('add','')" size="small">添加分类</el-button>
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
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableHeight: 600,
        tableData: [],
        id:'',
        tagsName:'',
        // 默认每页显示的页数（可修改）
        PageSize: 20,
        //默认显示几页
        currentPage:1,
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
