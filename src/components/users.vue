<template>
  <el-card class="box">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索+添加 -->
    <el-row class="searchBox">
      <el-col>
        <el-input
          @clear="getAllUsers()"
          clearable
          placeholder="请输入内容"
          v-model="query"
          class="searchInput"
        >
          <el-button @click="seaarchUsers()" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <!-- 添加 -->
        <el-button @click="showAdd()" type="success">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="list" style="width: 100%">
      <el-table-column prop="id" label="#" width="80"></el-table-column>
      <el-table-column prop="username" label="姓名" width="130"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="140"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="140"></el-table-column>

      <el-table-column label="创建日期" width="140">
        <template slot-scope="scope">{{scope.row.create_time | fmtdate}}</template>
      </el-table-column>

      <el-table-column label="状态" width="140">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="success" icon="el-icon-check" circle size="mini" plain></el-button>
          <el-button
            @click="showEdit(scope.row)"
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            plain
          ></el-button>
          <el-button
            @click="showDel(scope.row)"
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            plain
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 对话框-- 添加表格 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAd">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formdata.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAd = false">取 消</el-button>
        <el-button type="primary" @click="addUsers()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 对话框-- 编辑表格 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input v-model="formdata.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUsers()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 2,
      total: -1,
      list: [],
      dialogFormVisibleAd: false,
      dialogFormVisibleEdit: false,
      formdata: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      }
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    //编辑
    async editUsers() {
      const res = await this.$http.put(`users/${this.formdata.id}`,this.formdata);
      console.log(res);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        //关闭对话框
        this.dialogFormVisibleEdit = false
        //更新列表
        this.getTableData()
      }
    },
    //显示编辑
    showEdit(user) {
      this.formdata = user;
      this.dialogFormVisibleEdit = true;
    },
    showDel(user) {
      console.log(user);
      this.$confirm("此操作将永久?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.delete(`users/${user.id}`);
          const {
            meta: { msg, status }
          } = res.data;
          if (status === 200) {
            this.$message.success(msg);
            this.pagenum = 1
            this.getTableData();
          }
        })
        .catch(() => {
          this.$message.info("取消");
        });
    },
    //添加用户
    async addUsers() {
      const res = await this.$http.post("users", this.formdata);
      console.log(res);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 201) {
        //关闭对话框
        this.dialogFormVisibleAd = false;
        //更新列表
        this.getTableData();
      }
    },
    // 显示对话框
    showAdd() {
      //清空添加的信息
      this.formdata = {};
      this.dialogFormVisibleAd = true;
    },
    //搜获-清空获取所有用户
    getAllUsers() {
      this.getTableData();
    },
    seaarchUsers() {
      this.pagenum = 1;
      this.getTableData();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagenum = 1;
      this.pagesize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getTableData();
    },
    async getTableData() {
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;

      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      //console.log(res);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.total = data.total;
        this.list = data.users;
        //console.log(this.list);
      }
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.searchBox {
  margin-top: 15px;
}
.searchInput {
  width: 350px;
}
</style>
