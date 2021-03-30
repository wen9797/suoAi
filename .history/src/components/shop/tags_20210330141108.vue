<template>
  <el-table
    :data="tableData"
    style="width: 100%">

    <el-table-column label="ID" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>

    <el-table-column label="标签" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.tags_name }}</span>
        </template>
      </el-table-column>

    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    data() {
      return {
        tableData: []
      }
    },
    created() {
        this.getTagsList()
    },
    methods: {
        
      getTagsList() {
        var _this = this
        this.$http
      .get(this.publicurl + "/admin/Tags/list", {
          
      })
      .then(function (res) {
          _this.tableData = res.data.result.list
        console.log(res)
      })
      },
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        console.log(index, row);
      }
    }
  }
</script>