<template>
  <div>
    <crumbs-navigation text1="权限管理" text2="权限列表"></crumbs-navigation>
    <el-card>
      <el-table :data="userRightList" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="权限名称" prop="authName"> </el-table-column>
        <el-table-column label="路径" prop="path"> </el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag :type="scope.row.level == 0 ? '' : (scope.row.level == 1 ? 'success' : 'warning')">
              {{scope.row.level == 0 ? '一级' : (scope.row.level == 1 ? '二级' : '三级')}}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userRightList: []
    }
  },
  created() {
    this.getRightList()
  },
  methods: {
    async getRightList() {
      let { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userRightList = res.data
      console.log(res)      
    }
  }
}
</script>

<style lang="less" scoped></style>
