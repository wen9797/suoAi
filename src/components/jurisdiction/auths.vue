<template>
  <div class="app">
    <el-card class="box-card">
      <div class="search-list">
        <el-button @click="addAuthsOpen('add')" size="small">添加顶级节点</el-button>
      </div>
      <div style="clear: both"></div>
    </el-card>
    <div style="height: 15px"></div>
    <el-card class="box-card">
      <div>
        <el-tree :data="authsData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </div>
    </el-card>
    <el-dialog title="添加节点" :visible.sync="addAuths" width="400px">
      <div class="from-list">
        <div class="from-title">节点名称：</div>
        <div class="from-input">
          <el-input size="small" placeholder="节点名称" v-model="add_name"></el-input>
        </div>
      </div>
      <div class="from-list">
        <div class="from-title">节点路径：</div>
        <div class="from-input">
          <el-input size="small" placeholder="节点路径" v-model="add_rules"></el-input>
        </div>
      </div>
      <div class="from-list">
        <div class="from-title">图标：</div>
        <div class="from-input">
          <el-input size="small" placeholder="图标" v-model="add_icon"></el-input>
        </div>
      </div>
      <div class="from-list">
        <div class="from-title">节点类型：</div>
        <div class="from-input">
          <template>
            <el-radio v-model="add_type" label="0">菜单</el-radio>
            <el-radio v-model="add_type" label="1">按钮</el-radio>
          </template>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="addAuths = false">取 消</el-button>
        <el-button size="small" type="primary" @click="auths_add()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="操作节点" :visible.sync="operationList" width="400px">
      <div class="from-list">
        <div class="from-title"><el-button @click="addAuthsOpen('addJunior')" type="primary">添加节点</el-button></div>
        <div class="from-title"><el-button @click="addAuthsOpen('edit')" type="warning">编辑节点</el-button></div>
        <div class="from-title"><el-button @click="deleteAuths()" type="danger">删除节点</el-button></div>
      </div>
      <div slot="footer" class="dialog-footer">
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        addAuths: false,
        operationList:false,
        add_name:'',
        add_rules:'',
        add_type:'0',
        add_icon:'',
        id: '',
        p_id:'',
        fromStatus:'',
        clickAuths:{},//选中参数
        authsData: [],
        defaultProps: {
          children: 'children',
          label: 'auth_name'
        },
        Auths:[{}]
      }
    },
    watch: {
      $route() {
        this.getData()
      }
    },
    created: function () {
      this.getData()
    },
    methods: {
      handleNodeClick(data) {
        this.clickAuths = data
        this.operationList = true
      },
      addAuthsOpen(p_id){
        if(p_id == 'add'){
          this.add_name=''
          this.add_rules=''
          this.add_type='0'
          this.add_icon=''
          this.p_id = 0
          this.fromStatus = p_id
        }else if(p_id == 'edit'){
          this.id = this.clickAuths.id
          this.add_name=this.clickAuths.auth_name
          this.add_rules=this.clickAuths.auth_rules
          this.add_type=this.clickAuths.auth_type +''
          this.add_icon=this.clickAuths.auth_icon
          this.p_id = this.clickAuths.p_auth_id
          this.fromStatus = p_id
        }else if(p_id == 'addJunior'){
          this.add_name=''
          this.add_rules=''
          this.add_type='0'
          this.add_icon=''
          this.fromStatus = 'add'
          this.p_id = this.clickAuths.id
        }
        this.addAuths = true
        this.operationList = false
      },
      getData() {
        var _this = this;
        this.$http.post(this.publicurl + '/admin/auths/getAll', {

        })
          .then(function (res) {
            _this.$VerificationLogin(res)
            if(res.data.code == 1) {
              _this.authsData = _this.getMenu(res.data.result)
            }
          })
      },
      auths_add(){
        var _this = this;
        if(!this.add_name || !this.add_rules || !this.add_type){
          _this.$message({
            message: '数据不能为空',
            type: 'warning'
          });
          return
        }
        this.$http.post(this.publicurl + '/admin/auths/'+this.fromStatus, {
          'id': this.id,
          'name': this.add_name,
          'rules': this.add_rules,
          'type': this.add_type,
          'p_id': this.p_id,
          'icon': this.add_icon,
        })
          .then(function (res) {
            _this.$VerificationLogin(res)
            if(res.data.code == 1){
              _this.$message({
                message: res.data.msg,
                type: 'success'
              });
              _this.addAuths = false;
              _this.operationList = false;
              _this.getData()
            }
          })
      },
      deleteAuths() {
        this.$confirm('此操作将无法恢复, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteSub()
        }).catch(() => {
        });
      },
      deleteSub(){
        return
        var _this = this;
        this.$http.post(this.publicurl + '/admin/auths/delete', {
          'p_id': this.p_id,
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
      // test(data){
      //   var first = []
      //   for (var i = 0; i<data.length;i++){
      //     if(data[i].p_auth_id == 0){
      //       first.unshift(data[i])
      //     }
      //   }
      //   for(var i = 0; i<first.length;i++){
      //     first[i].children = []
      //     let firstId = first[i].id
      //     for(var s = 0; s<data.length;s++){
      //       if(data[s].p_auth_id == firstId){
      //         first[i].children.unshift(data[s])
      //       }
      //     }
      //   }
      //   for(var i = 0; i<first.length;i++){
      //     for(var s = 0;s < first[i].children.length; s++){
      //       first[i].children[s].children = []
      //       let secondId = first[i].children[s].id
      //       for(var n = 0; n<data.length;n++){
      //         if(data[n].p_auth_id == secondId){
      //           first[i].children[s].children.unshift(data[n])
      //         }
      //       }
      //     }
      //   }
      //   this.authsData = first
      // },
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
