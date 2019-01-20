<template>
  <div class="users">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-input placeholder="请输入内容" v-model="searchVal" class="search-input"
    @keydown.enter.native="searchUser">
    <!-- .native修饰符的作用是，让封装的组件也能够绑定原生的事件 -->
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <el-button type="primary" plain
    @click="addDialogFormVisible = true">添加用户</el-button>
      <el-table
      v-loading="loading"
    :data="Userslist"
    border
    class="mt-15"
    style="width: 100%">
    <el-table-column
      type="index"
      width="50">
    </el-table-column>
    <el-table-column
      property="username"
      label="姓名"
      width="120">
    </el-table-column>
    <el-table-column
      property="email"
      label="邮箱"
      width="150">
    </el-table-column>
    <el-table-column
      property="mobile"
      label="电话">
    </el-table-column>
     <el-table-column
      prop=""
      label="状态">
              <template slot-scope="scope">
          <el-switch
            :disabled="scope.row.username==='admin'"
            @change="toggleState(scope.row.mg_state,scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
    </el-table-column>
    <el-table-column
        prop=""
        label="操作">
        <!-- 通过scope.row可以取到表格那一行对象里面的属性 -->
        <template slot-scope="scope">
          <!-- 点击编辑将当前点击用户的所有信息传递到函数中去 -->
          <el-button type="primary" icon="el-icon-edit" circle @click="handleEditUser(scope.row)" :disabled="scope.row.username==='admin'"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="handleDelUser(scope.row.id)" :disabled="scope.row.username==='admin'"></el-button>
          <el-button type="warning" icon="el-icon-check" circle @click="handleGrantUser(scope.row)" :disabled="scope.row.username==='admin'"></el-button>
        </template>
      </el-table-column>
  </el-table>
        <el-pagination
      class="mt-15 page"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="1"
      :page-sizes="[1, 2,3, 4]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalNum">
    </el-pagination>
    <!-- 添加用户的弹出框  找到dialog组件 -->
    <el-dialog
        :before-close="closeDialog"
        title="添加用户"
        :visible.sync="addDialogFormVisible"
      >
        <el-form :model="addForm" ref="addFormRef" :rules="myrules">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input  type="password" v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelAdd">取 消</el-button>
          <el-button type="primary" @click="submitAdd('addFormRef')">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 点击编辑按钮 弹出用户编辑 -->
        <el-dialog
        title="编辑用户"
        :visible.sync="editDialogFormVisible"
      >
        <el-form :model="editForm" ref="editFormRef" :rules="myrules">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username" >
          <el-input v-model="editForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitEdit('editFormRef')">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 用户角色分配 -->
    <el-dialog title="分配角色" :visible.sync="grantDialogFormVisible">
      <el-form :model="grantForm" ref="grantFormRef" :rules="myrules">
        <el-form-item label="当前用户" :label-width="formLabelWidth">
          <el-input v-model="grantForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="选择角色" :label-width="formLabelWidth">
          <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitGrant">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
import { getUserList, addUser, delUser, editUser, changeState, getRoles, grantRole } from '@/api'
export default {
  data () {
    // 数据输入验证
    let checkEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邮箱'))
      } else {
        // 校验邮箱规则
        // eslint-disable-next-line
        let emailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
        if (emailReg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的邮箱格式'))
        }
      }
    }
    return {
      loading: true,
      searchVal: '',
      totalNum: 0,
      pagesize: 2,
      pagenum: 1,
      Userslist: [],
      // 添加框显示与隐藏
      addDialogFormVisible: false,
      // 添加框内容左侧宽度设置
      formLabelWidth: '80px',
      //  添加用户参数
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editDialogFormVisible: false,
      editForm: {
        // id默认为-1 防止重复
        id: -1,
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      grantForm: {
        username: '',
        id: '' // 用户id
      },
      grantDialogFormVisible: false,
      selectRoleId: '',
      roleList: [],
      myrules: {
        username: [
          {
            required: true, message: '请输入用户名', trigger: 'blur'
          }
        ],
        password: [
          {
            required: true, message: '请输入密码', trigger: 'blur'
          }
        ],
        email: [
          // validator属性指定自定义的校验函数即可
          {
            required: true, validator: checkEmail, trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true, message: '请输入电话', trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    // 调用初始化table的方法
    this.initTable()
  },
  methods: {
    initTable () {
      getUserList({ query: this.searchVal, pagenum: this.pagenum, pagesize: this.pagesize })
        .then(res => {
          console.log(res)
          this.totalNum = res.data.total
          this.Userslist = res.data.users
          // -------------
          this.loading = false
        })
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.initTable()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pagenum = val
      this.initTable()
    },
    // 添加用户js方法
    submitAdd (formRef) {
      this.$refs[formRef].validate((ispass) => {
        if (ispass) {
          // 在这里发请求添加用户   sp_manager数据库表
          addUser(this.addForm)
            .then(res => {
              if (res.meta.status === 201) {
                this.$message.success('添加用户成功')
                this.addDialogFormVisible = false
                this.addForm.username = ''
                this.addForm.password = ''
                this.addForm.email = ''
                this.addForm.mobile = ''
                this.initTable()
              } else {
                this.$message.success(res.meta.msg)
              }
            })
        } else {
          this.$message.error('请正确填写表单')
        }
      })
    },
    // 删除单个用户
    handleDelUser (id) {
      // 调用$confirm方法即可打开消息提示，它模拟了系统的 confirm。Message Box 组件也拥有极高的定制性，我们可以传入options作为第三个参数，它是一个字面量对象。type字段表明消息类型，可以为success，error，info和warning，无效的设置将会被忽略。注意，第二个参数title必须定义为String类型，如果是Object，会被理解为options。在这里我们用了 Promise 来处理后续响应。
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delUser(id)
          .then(res => {
            console.log(res)
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
    // 点击编辑按钮方法  先渲染再提交修改 只能修改电话和邮箱 用户名及密码都不可以修改
    handleEditUser (row) {
      this.editForm.id = row.id
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
      this.editDialogFormVisible = true
    },
    submitEdit (formRef) {
      console.log(this.$refs[formRef])
      this.$refs[formRef].validate((ispass) => {
        if (ispass) {
          editUser(this.editForm)
            .then(res => {
              console.log(res)
              if (res.meta.status === 200) {
                this.editDialogFormVisible = false
                this.$message.success('更新用户成功')
                this.initTable()
              }
            })
        } else {
          this.$message.warning('请按规则填写表单')
        }
      })
    },
    toggleState (state, row) {
      changeState(row.id, row.mg_state)
        .then(res => {
          console.log(res)
          this.$message.success(res.meta.msg)
        })
    },
    // 搜索用户
    searchUser () {
      this.initTable()
      this.searchVal = ''
    },
    // 用户权限授予  先显示对话框
    handleGrantUser (row) {
      console.log(1)
      this.grantForm.username = row.username
      this.grantForm.id = row.id // 给用户id赋值
      this.grantDialogFormVisible = true
      // eslint-disable-next-line no-trailing-spaces
      this.selectRoleId = row.role_name 
      // eslint-disable-next-line func-call-spacing
      getRoles ()
        .then(res => {
          console.log(res)
          this.roleList = res.data
        })
    },
    // ---------------
    submitGrant () {
      if (typeof this.selectRoleId === 'string') {
        this.grantDialogFormVisible = false
        return false
      }
      grantRole(this.grantForm.id, this.selectRoleId)
        .then(res => {
          console.log(res)
          this.$message.success(res.meta.msg)
          this.initTable()
          this.grantDialogFormVisible = false
        })
    },
    closeDialog (done) {
      // 这两个方法 虽然可以删除提示的错误信息 但是都不回清除掉输入的内容  clearValidate() :before-close="closeDialog"
      this.$refs.addFormRef.clearValidate()
      console.log('1')
      done()
    },
    cancelAdd () {
      this.addDialogFormVisible = false
      this.$refs.addFormRef.clearValidate()
      console.log('2')
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
