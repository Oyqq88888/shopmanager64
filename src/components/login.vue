<template>
  <div class="login-wrap">
    <el-form class="login-form" label-position="top" label-width="80px" :model="formData">
      <h2>用户登陆</h2>
      <el-form-item label="用户">
        <el-input v-model="formData.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formData.password"></el-input>
      </el-form-item>
      <el-button
      @click.prevent="handleLogin()"
      class="login-btn" type="success">登陆</el-button>

    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formData: {
        username: '',
        password: ''
      }

    }
  },
  methods: {
    handleLogin () {
      this.$http.post(`login`, this.formData)
      .then((res) => {
        console.log(res)
        const {data: {data,meta: {msg, status}}} = res
        if (status === 200) {
          this.$message({
          message: '登陆成功',
          type: 'success'
        })
        } else {
          this.$message.error('msg')
        }
      })
    }
  }
}
</script>

<style>
.login-wrap {
  height: 100%;
  background-color: #324152;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-form {
  background-color: #ffffff;
  border-radius: 5px;
  width: 400px;
  padding: 30px;
}
.login-btn {
  width: 100%;
}
</style>
