<template>
  <div>
    <!-- 面包屑导航 -->
    <crumbs-navigation text1="用户管理" text2="用户列表"></crumbs-navigation>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="stateChange(scope.row.id, scope.row.mg_state)" active-color="#409eff" inactive-color="#eaedf1"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="amendUsers(scope.row.id)"></el-button>
            </el-tooltip>
            <!-- 编辑按钮 -->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button size="mini" type="warning" icon="el-icon-delete" @click="deleteUsers(scope.row.id)"></el-button>
            </el-tooltip>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button size="mini" type="danger" icon="el-icon-setting" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%">
      <!-- 对话框内容区域 -->
      <el-form :model="addForm" label-width="70px" :rules="formRules" ref="addFormRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="cancelAddForm">取 消</el-button>
        <el-button type="primary" @click="notarizeAddForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="amendDialogVisible" width="50%">
      <!-- 对话框内容区域 -->
      <el-form :model="amendForm" label-width="70px" :rules="formRules" ref="amendFormRef">
        <el-form-item label="用户名">
          <el-input v-model="amendForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="amendForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="amendForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="cancelAmendForm">取 消</el-button>
        <el-button type="primary" @click="notarizeAmendForm(amendForm.id)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%">
      <!-- 对话框内容区域 -->
      <div>
        <p>当前的用户：{{ userInfo.username }}</p>
        <p>当前的角色：{{ userInfo.role_name }}</p>
        <p>
          分配新角色：
          <el-select v-model="roleValue" placeholder="请选择">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id"> </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleinfo(userInfo.id)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      amendDialogVisible: false,
      setRoleDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      formRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 6, message: '用户名在 3 ~ 6 个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码长度在 6 ~ 16 个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      amendForm: {},
      // 被分配角色的用户信息
      userInfo: {},
      // 所有的角色信息
      rolesList: [],
      roleValue: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      let { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userList = res.data.users
      this.total = res.data.total
    },
    handleSizeChange(newPagesize) {
      this.queryInfo.pagesize = newPagesize
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async stateChange(id, type) {
      let { data: res } = await this.$http.put('users/' + id + '/state/' + type)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
    },
    notarizeAddForm() {
      this.$refs.addFormRef.validate(async valid => {
        // valid是一个boolean值 是验证表单数据是否都满足要求
        if (!valid) return false
        let { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    cancelAddForm() {
      this.$refs.addFormRef.resetFields()
      this.addDialogVisible = false
    },
    async amendUsers(id) {
      let { data: res } = await this.$http.get('users/' + id)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.amendDialogVisible = true
      this.amendForm = res.data
    },
    cancelAmendForm() {
      this.$refs.amendFormRef.resetFields()
      this.amendDialogVisible = false
    },
    notarizeAmendForm(id) {
      this.$refs.amendFormRef.validate(async valid => {
        // valid是一个boolean值 是验证表单数据是否都满足要求
        if (!valid) return false
        let { data: res } = await this.$http.put('users/' + id, { email: this.amendForm.email, mobile: this.amendForm.mobile })
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.amendDialogVisible = false
        this.getUserList()
      })
    },
    async deleteUsers(id) {
      let confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult === 'cancel') return this.$message.info('已取消删除')
      if (confirmResult === 'confirm') {
        let { data: res } = await this.$http.delete('users/' + id)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getUserList()
      }
    },
    async setRole(userInfo) {
      this.setRoleDialogVisible = true
      this.userInfo = userInfo
      console.log(userInfo)
      let { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rolesList = res.data
      console.log(res)
    },
    async saveRoleinfo(id) {
      let { data: res } = await this.$http.put('users/' + id + '/role', {
        rid: this.roleValue
      })
      this.setRoleDialogVisible = false
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getUserList()
      console.log(res)
      console.log(id, this.roleValue)
    }
  }
}
</script>

<style lang="less" scoped></style>
