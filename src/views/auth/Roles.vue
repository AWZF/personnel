
<template>
  <div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
     <!-- 设置添加角色按钮 -->
    <el-button type="primary" plain @click="addDialogFormVisible = true">添加角色</el-button>
     <!-- 创建表格  1.先忽略下箭头 创建基础的页面 并建立插槽备用-->
    <el-table
          class="mt-15"
          :data="roleList"
          border
          style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
           <el-row v-show='scope.row.children.length!==0'
           v-for='firstItem in scope.row.children' :key="firstItem.id"
           >
             <el-col :span='4'>
                <el-tag closable @close="handleDelRight(firstItem.id, scope.row)">{{firstItem.authName}}</el-tag>
                <i class="el-icon-arrow-right" v-if="firstItem.children.length>0"></i>
             </el-col>
             <el-col :span='20'>
                <el-row v-for="secondItem in firstItem.children"
                :key="secondItem.id"
                >
                  <el-col :span="4">
                    <el-tag closable type="success" @close="handleDelRight(secondItem.id, scope.row)">{{secondItem.authName}}</el-tag>
                    <!-- 添加右箭头 -->
                    <i class="el-icon-arrow-right" v-if="secondItem.children.length>0"></i>
                   </el-col>
                   <el-col :span="20">
                       <el-tag closable type="warning" v-for="thirdItem in secondItem.children" :key="thirdItem.id" @close="handleDelRight(thirdItem.id, scope.row)">
                          {{thirdItem.authName}}
                       </el-tag>
                   </el-col>
                </el-row>
             </el-col>
           </el-row >
           <el-row v-show='scope.row.children.length===0'>
             <span>该角色没有权限，请前往分配！</span>
           </el-row>
          </template>

        </el-table-column>
        <el-table-column
        type="index"
        width="50">
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称">
        </el-table-column>
        <el-table-column
          prop="roleDesc"
          label="描述">
        </el-table-column>
        <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="editRoles(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="delRoles(scope.row.id)"></el-button>
          <el-button type="warning" icon="el-icon-check" circle @click="grantRole(scope.row)"></el-button>
        </template>
        </el-table-column>
    </el-table>

    <!-- 添加角色 -->
    <el-dialog
        :before-close="closeDialog"
        title="添加角色"
        :visible.sync="addDialogFormVisible"
      >
        <el-form :model="addForm" ref="addFormRef" :rules="myrules">
        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth" prop="roleDesc">
          <el-input  v-model="addForm.roleDesc"></el-input>
        </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelAdd">取 消</el-button>
          <el-button type="primary" @click="submitAdd('addFormRef')">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 编辑角色 -->
    <el-dialog
        :before-close="closeDialog"
        title="编辑角色"
        :visible.sync="editDialogFormVisible"
      >
        <el-form :model="editForm" ref="editFormRef" :rules="myrules">
        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth" prop="roleDesc">
          <el-input  v-model="editForm.roleDesc"></el-input>
        </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelAdd">取 消</el-button>
          <el-button type="primary" @click="submitEdit('editFormRef')">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 授权弹框 -->
        <el-dialog
        title="授权角色"
        :visible.sync="grantDialogFormVisible"
      >
       <!-- 此处需要一个div 来装下整个树状控件default-checked-keys默认勾选的节点的 key的数组array -->
       <div class="tree-box">
          <el-tree
            :data="rightList"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
            highlight-current
            :default-checked-keys='selectedIds'
            :props="defaultProps">
          </el-tree>
       </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="grantDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitGrant">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
// <!-- template插槽数据未写！！！！！！太复杂了！  @click="submitGrant"-->
import { getRoles, addRoles, editRole, delRole, getRights, grantUserRight, delUserRight } from '@/api'
export default {
  data () {
    return {
      roleList: [],
      rightList: [],
      defaultProps: {
        // 选中子节点的键值
        children: 'children',
        // 显示子节点的内容
        label: 'authName'
      },
      // 显示权限id 存在里面
      selectedIds: [],
      // 用于存入点击授权的所有结果
      currentRole: {},
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      editForm: {
        roleName: '',
        roleDesc: ''
      },
      myrules: {
        roleName: [
          {
            required: true, message: '请输入角色名称', trigger: 'blur'
          }
        ],
        roleDesc: [
          {
            required: true, message: '请输入角色描述', trigger: 'blur'
          }
        ]

      },
      // 添加用户数据
      addDialogFormVisible: false,
      editDialogFormVisible: false,
      grantDialogFormVisible: false,
      formLabelWidth: '80px'
    }
  },
  created () {
    this.initTable()
  },
  methods: {
    initTable () {
      getRoles()
        .then(res => {
          console.log(res)
          this.roleList = res.data
        })
    },
    // 添加用户方法
    closeDialog (done) {
      this.$refs.addFormRef.clearValidate()
      done()
    },
    cancelAdd () {
      this.$refs.addFormRef.clearValidate()
      this.addDialogFormVisible = false
    },
    submitAdd (formRef) {
      this.$refs[formRef].validate((ispass) => {
        if (ispass) {
          console.log(this.addForm)
          // 在这里发请求添加用户   sp_manager数据库表
          addRoles(this.addForm)
            .then(res => {
              if (res.meta.status === 201) {
                this.$message.success('添加用户成功')
                this.addDialogFormVisible = false
                this.addForm.roleName = ''
                this.addForm.roleDesc = ''
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
    editRoles (row) {
      // console.log(row)
      this.editForm.id = row.id
      this.editForm.roleName = row.roleName
      this.editForm.roleDesc = row.roleDesc
      this.editDialogFormVisible = true
    },
    submitEdit (formRef) {
      this.$refs[formRef].validate((ispass) => {
        if (ispass) {
          editRole(this.editForm)
            .then(res => {
              if (res.meta.status === 200) {
                this.editDialogFormVisible = false
                this.$message.success('用户修改成功')
                this.initTable()
              }
            })
        } else {
          this.$message.warning('请按规则填写表单')
        }
      })
    },
    delRoles (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delRole(id)
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
    grantRole (row) {
      this.grantDialogFormVisible = true
      this.currentRole = row
      // 根据接口获取树状控件 值: list 或 tree , list 列表显示权限, tree 树状显示权限,参数是url参数:type
      getRights('tree')
        .then(res => {
          console.log(res)
          this.rightList = res.data
          this.selectedIds.length = 0
          row.children.forEach(firstItem => {
            if (firstItem.children && firstItem.children.length > 0) {
              firstItem.children.forEach(secondItem => {
                if (secondItem.children && secondItem.children.length > 0) {
                  secondItem.children.forEach(thirdItem => {
                    this.selectedIds.push(thirdItem.id)
                  })
                }
              })
            }
          })
        })
    },
    submitGrant () {
      let childKeys = this.$refs.tree.getCheckedKeys()
      let fatherKeys = this.$refs.tree.getHalfCheckedKeys()
      console.log(childKeys)
      console.log(fatherKeys)
      let idArr = [...childKeys, ...fatherKeys]
      // console.log(idArr)
      let idStrs = idArr.join(',')
      grantUserRight(this.currentRole.id, idStrs)
        .then(res => {
          console.log(res)
          if (res.meta.status === 200) {
            this.initTable()
            this.grantDialogFormVisible = false
            this.$message.success(res.meta.msg)
          }
        })
    },
    handleDelRight (rightId, row) {
      delUserRight(rightId, row.id)
        .then(res => {
          row.children = res.data
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.roles {
  .el-tag {
    margin: 5px;
  }
  .tree-box {
    height: 300px;
    overflow: auto;
  }
}
</style>
