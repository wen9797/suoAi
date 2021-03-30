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