 <template>
  <div>
    <div class="addBtn">
      <button>添加分类</button>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="ID" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="分类名称" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.type_name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="图片" width="180">
        <template slot-scope="scope">
          <img style="margin-left: 10px" :src="scope.row.img" />
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          
           <el-button
            size="mini"
            type="primary"
            @click="handleAdd(scope.$index, scope.row)"
            >添加</el-button
          >
          <el-button
            size="mini"
            type="info"
            @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="1"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      >
      </el-pagination>
    </div>

    <el-form label-width="100px" class="demo-dynamic">
      <el-form-item
        prop="email"
        label="分类"
      >
        <el-input></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">提交</el-button>
        <el-button @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
export default {
  data() {
    return {
      tableData: [],
      totalCount: 0,
      currentPage: 1,
      limit: 2,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      var _this = this;

      this.$http
        .get(this.publicurl + "/admin/Type/list", {
          page: _this.currentPage,
          limit: _this.limit,
        })
        .then(function (res) {
          _this.totalCount = res.data.result.total;
          console.log(res);
          _this.tableData = res.data.result.list;
          console.log(res.data.result.list);
          // console.log(_this.totalCount)
        });
    },
    getAdd() {
      this.$$http.post(this.publicurl + "/admin/Type/add", {
        
      }).then(function (res) {
        console.log(res)
      })
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    handleAdd(index, row) {

      console.log(index, row);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
  },
};
</script>
<style scoped>
  .addBtn {
    display: flex;
    justify-content: flex-end;
    position: relative;
  }
  .addBtn button {
    height: 2.2rem;
    border: none;
    width: 6.4rem;
    outline: none;
    background-color: rgb(91, 110, 145);
  }
  .demo-dynamic{
    height: 300px;
    width: 500px;
    background-color: #fff;
    position:absolute;
    top: 30px;
    
  }
</style>