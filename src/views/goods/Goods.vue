<template>
  <div class="goods">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-input placeholder="请输入内容" v-model="searchVal" class="search-input"
    @keydown.enter.native="searchPro">
    <!-- .native修饰符的作用是，让封装的组件也能够绑定原生的事件 -->
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>
     <el-button type="primary" plain @click="handleAddGoods">添加商品</el-button>
     <!-- 商品列表 -->
    <el-table
      class="mt-15 mb-15"
      border
      :data="Proslist"
      stripe
      style="width: 100%">
      <el-table-column
        label="编号"
        type="index"
        :width="tabWidths[0]">
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称"
        :width="tabWidths[1]">
      </el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价格"
        :width="tabWidths[2]">
      </el-table-column>
      <el-table-column
        prop="goods_state"
        label="商品状态"
        :width="tabWidths[3]">
      </el-table-column>
      <el-table-column
        prop="goods_weight"
        label="商品重量"
        :width="tabWidths[4]">
      </el-table-column>
      <el-table-column
        prop="add_time"
        label="创建时间"
        :width="tabWidths[5]">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button plain title='编辑' type="primary" size="small" @click="toEditProduct(scope.row)" icon="el-icon-edit"></el-button>
          <el-button plain title='删除' type="danger" size="small" @click="deleteProduct(scope.row)" icon="el-icon-delete"></el-button>
          <el-button plain title='审核' type="warning" size="small" @click="testPro(scope.row)" icon="el-icon-check"></el-button>
        </template>
      </el-table-column>
    </el-table>
     <!-- 分页 -->
      <el-pagination
      class="mt-15 page"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="1"
      :page-sizes="[100, 200,300, 400]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalNum">
    </el-pagination>
  </div>
</template>
<script>
import { getProList } from '@/api'
export default {
  data () {
    return {
      searchVal: '',
      pagesize: 10,
      totalNum: 0,
      pagenum: 1,
      Proslist: [],
      tabWidths: [50, 350, 80, 80, 100, 130, 260]
    }
  },
  created () {
    this.initTable()
  },
  methods: {
    // 初始化列表
    initTable () {
      getProList({ query: this.searchVal, pagenum: this.pagenum, pagesize: this.pagesize })
        .then(res => {
          console.log(res)
          this.totalNum = res.data.total
          this.Proslist = res.data.goods
        })
    },
    // 编程式导航跳转
    handleAddGoods () {
      this.$router.push({ name: 'addGoods' })
    },
    // 搜索商品
    searchPro () {
      this.initTable()
      this.searchVal = ''
    },
    // 点击下一页
    handleSizeChange (val) {
      this.pagesize = val
      this.initTable()
    },
    // 点击页数
    handleCurrentChange (val) {
      this.pagenum = val
      this.initTable()
    },
    // 编辑按钮
    toEditProduct (row) {
      console.log('编辑')
    },
    // 删除
    deleteProduct (row) {
      console.log('删除')
    },
    // 审核商品
    testPro (row) {
      console.log('审核')
    }
  }

}

</script>
<style lang="scss" scoped>
.search-input {
  width: 300px;
  margin-right: 5px;
}
</style>
