<template>
  <div>
    <crumbs-navigation text1="权限管理" text2="角色列表"></crumbs-navigation>
    <el-card>
      <el-button type="primary">添加角色</el-button>
      <el-table :data="userRoleList" border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row type="flex" justify="space-between" :class="['center', 'dbbottom', index == 0 ? 'dbtop' : '']" v-for="(item, index) in scope.row.children" :key="item.id">
              <el-col :span="6">
                <el-tag closable size="medium" @close="removeRightById(scope.row, item.id)">{{ item.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="18">
                <el-row type="flex" justify="space-between" :class="['center', index2 == 0 ? '' : 'dbtop']" v-for="(itemSecond, index2) in item.children" :key="itemSecond.id">
                  <el-col :span="7">
                    <el-tag closable type="success" size="medium" @close="removeRightById(scope.row, itemSecond.id)">{{ itemSecond.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="17">
                    <el-tag closable type="warning" size="medium" v-for="itemThird in itemSecond.children" :key="itemThird.id" @close="removeRightById(scope.row, itemThird.id)">
                      {{ itemThird.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <!-- 编辑按钮 -->
            <el-button size="mini" type="warning" icon="el-icon-delete">删除</el-button>
            <!-- 分配权限按钮 -->
            <el-button size="mini" type="danger" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限弹出框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialog" width="50%" @close="removeDefKeys">
      <!-- 树形控件 -->
      <el-tree :data="showsetRightList" ref="treeRef" default-expand-all :default-checked-keys="defKeys" :props="treeProps" show-checkbox node-key="id"> </el-tree>
      <span slot="footer">
        <el-button @click="setRightDialog = false">取 消</el-button>
        <el-button type="primary" @click="allotRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userRoleList: [],
      setRightDialog: false,
      showsetRightList: [],
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      defKeys: [],
      roleId: ''
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      let { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userRoleList = res.data
      console.log(res)
    },
    async removeRightById(role, rightId) {
      console.log(role.id, rightId)
      let confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult === 'cancel') return this.$message.info('已取消删除')
      if (confirmResult === 'confirm') {
        let { data: res } = await this.$http.delete('roles/' + role.id + '/rights/' + rightId)
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        role.children = res.data
      }
    },
    async showSetRightDialog(role) {
      this.roleId = role.id
      this.setRightDialog = true
      let { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.getDefKeys(role, this.defKeys)    
      this.showsetRightList = res.data
    },
    // 通过递归获取所有三级权限id
    getDefKeys(right, arr) {
      if (!right.children) {
        return arr.push(right.id)
      }
      right.children.forEach(item => this.getDefKeys(item, arr))
    },
    removeDefKeys() {
      this.defKeys = []
    },
    async allotRight() {
      const keys = [...this.$refs.treeRef.getHalfCheckedKeys(), ...this.$refs.treeRef.getCheckedKeys()]
      const rids = keys.join(',')
      let { data: res } = await this.$http.post('roles/' + this.roleId + '/rights', { rids: rids })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.setRightDialog = false
      this.getRoleList()
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.dbtop {
  border-top: 1px solid #eee;
}
.dbbottom {
  border-bottom: 1px solid #eee;
}
.center {
  display: flex;
  align-items: center;
}
</style>
