<template>
<!-- 面包屑 -->
   <div class="right">
      <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

     <el-table
      class="mt-15"
      :data="rightList"
      border
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径">
      </el-table-column>
      <el-table-column
        label="层级">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level==='0'">{{scope.row.level | filterLevel}}</el-tag>
          <el-tag v-else-if="scope.row.level==='1'" type="success">{{scope.row.level | filterLevel}}</el-tag>
          <el-tag v-else type="warning">{{scope.row.level | filterLevel}}</el-tag>
        </template>
      </el-table-column>
    </el-table>
   </div>
</template>
<script>
import { getRights } from '@/api'
export default {
  data () {
    return {
      rightList: []
    }
  },
  created () {
    this.initTable()
  },
  filters: {
    filterLevel (level) {
      if (level === '0') {
        return '一级'
      } else if (level === '1') {
        return '二级'
      } else {
        return '三级'
      }
    }
  },
  methods: {
    initTable () {
      getRights('list')
        .then(res => {
          console.log(res)
          this.rightList = res.data
        })
    }
  }
}
</script>
