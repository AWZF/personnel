<template>
<div class="categories">
      <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-button type="primary" plain @click="handleAddCate">添加分类</el-button>
    <tree-grid
      class="mt-15"
      :treeStructure="true"
      :columns="columns"
      :data-source="dataSource"
      @deleteCate="deleteCategory"
      @editCate="editCategory"
    >
    </tree-grid>
    <!-- 分页 -->
    <el-pagination
      class="page mt-15"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="1"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalNum">
    </el-pagination>
    <!-- 添加分类的表格 -->
    <el-dialog title="添加分类" :visible.sync="addDialogFormVisible">
      <!-- 3.5 给表单添加ref，主要用来js校验 -->
      <el-form :model="addForm" :rules="myrules" ref="addRef">
        <el-form-item label="分类名称" :label-width="formLabelWidth" prop="cat_name">
          <el-input v-model="addForm.cat_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" :label-width="formLabelWidth">
          <!-- change-on-select表示可以选择任意一级的节点 -->
          <el-cascader
            change-on-select
            :options="cateList"
            v-model="selectedCates"
            :props="defaultProps"
            @change="handleChange">
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="confirmAdd">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑分类表格 -->
        <el-dialog title="编辑分类" :visible.sync="editDialogFormVisible">
      <!-- 3.5 给表单添加ref，主要用来js校验 -->
      <el-form :model="editForm" :rules="myrules" ref="editRef">
        <el-form-item label="分类名称" :label-width="formLabelWidth" prop="cat_name">
          <el-input v-model="editForm.cat_name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
      </div>
    </el-dialog>
</div>
</template>
<script>
import { getCategories, addCate, getCate, editCate, delCate } from '@/api'
import TreeGrid from '@/components/TreeGrid/TreeGrid'
export default {
  components: {
    TreeGrid
  },
  data () {
    return {
      totalNum: 0,
      pagesize: 5,
      pagenum: 1,
      dataSource: [],
      columns: [{
        text: '分类名称',
        dataIndex: 'cat_name',
        width: ''
      }, {
        text: '是否有效',
        dataIndex: 'cat_deleted',
        width: ''
      }, {
        text: '排序',
        dataIndex: 'cat_level',
        width: ''
      }],
      addDialogFormVisible: false,
      editDialogFormVisible: false,
      addForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      editForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      myrules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      formLabelWidth: '80px',
      cateList: [],
      defaultProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      selectedCates: [],
      pcategory: [],
      cid: null
    }
  },
  created () {
    this.initTable()
  },
  methods: {
    handleAddCate () {
      // console.log('添加')
      this.addDialogFormVisible = true
      getCategories(2)
        .then(res => {
          // console.log(res)
          this.cateList = res.data
        })
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.initTable()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.initTable()
    },
    // 编辑按钮
    editCategory (cid) {
      console.log(cid)
      this.cid = cid
      // getCategories(2)
      //   .then(res => {
      //     // console.log(res)
      //     this.cateList = res.data
      //     return getCate(cid)
      //   }).then(res => {
      //     if (res.meta.status === 200) {
      //       this.editForm.cat_name = res.data.cat_name
      //       this.editForm.cat_pid = res.data.cat_pid
      //       this.editForm.cat_level = res.data.cat_level
      //       this.editDialogFormVisible = true
      //     }
      //   })
      getCate(cid)
        .then(res => {
          if (res.meta.status === 200) {
            this.editForm.cat_name = res.data.cat_name
            this.editForm.cat_pid = res.data.cat_pid
            this.editForm.cat_level = res.data.cat_level
            this.editDialogFormVisible = true
          }
        })
    },
    deleteCategory (cid) {
      console.log(cid)
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCate(cid)
          .then(res => {
            this.initTable()
            // console.log(res)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    initTable () {
      getCategories(3, this.pagenum, this.pagesize)
        .then(res => {
          // console.log(res)
          this.totalNum = res.data.total
          this.dataSource = res.data.result
        })
    },
    handleChange (val) {
      console.log(val)
      if (val.length === 1) {
        // 有一级父标题
        this.addForm.cat_level = 1
        this.addForm.cat_pid = val[0]
      } else if (val.length === 2) {
        // 有二级父标题
        this.addForm.cat_level = 2
        this.addForm.cat_pid = val[1]
      }
    },
    confirmAdd () {
      this.$refs.addRef.validate(isPass => {
        if (isPass) {
          console.log('提交')
          addCate(this.addForm)
            .then(res => {
              // console.log(res)
              if (res.meta.status === 201) {
                this.$message.success(res.meta.msg)
                this.addDialogFormVisible = false
                // 清空
                this.addForm.cat_pid = 0
                this.addForm.cat_level = 0
                this.addForm.cat_name = ''
                // 清空选择器id
                this.selectedCates = []
                this.initTable()
              } else {
                this.$message.error(res.meta.msg)
              }
            })
        } else {
          this.$message.error('请正确填写信息！')
        }
      })
    },
    confirmEdit () {
      let id = this.cid
      console.log('编辑' + id)
      // console.log(this.editForm)
      this.$refs.editRef.validate(isPass => {
        if (isPass) {
          editCate(id, this.editForm)
            .then(res => {
              // console.log(res)
              if (res.meta.status === 200) {
                this.$message.success(res.meta.msg)
                this.editDialogFormVisible = false
                this.selectedCates = []
                this.initTable()
              } else {
                this.$message.error(res.meta.msg)
              }
            })
        } else {
          this.$message.error('请正确填写信息！')
        }
      })
    }
  }
}
</script>
