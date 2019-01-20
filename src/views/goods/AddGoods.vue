<template>
  <div class="add-goods">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 步骤条 -->
    <el-steps :active="active" finish-status="success" class="mt-15">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
      <el-step title="步骤 4"></el-step>
      <el-step title="步骤 5"></el-step>
    </el-steps>

    <!-- 标签页组件 -->
    <el-form ref="addProductForm" :model="addProductForm" label-width="80px">
      <el-tabs tab-position="left" @tab-click="toggleTab">
          <el-tab-pane label="基本信息">
            <!-- 商品基本信息 -->
            <el-form-item label="商品名称">
              <el-input v-model='addProductForm.goods_name'></el-input>
            </el-form-item>
            <el-form-item label="商品价格">
              <el-input  v-model='addProductForm.goods_price'></el-input>
            </el-form-item>
            <el-form-item label="商品重量">
              <el-input  v-model='addProductForm.goods_weight'></el-input>
            </el-form-item>
            <el-form-item label="商品数量">
              <el-input  v-model='addProductForm.goods_number'></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                placeholder="请选择分类"
                expand-trigger="hover"
                :change-on-select="false"
                :show-all-levels="false"
                :options="addProductForm.pcategory"
                :props="addProductForm.selfDefineAttr"
                v-model="addProductForm.selectedOptions">
              </el-cascader>
            </el-form-item>
            <el-form-item label="是否促销">
              <el-radio-group v-model="addProductForm.is_promote" size="medium">
                <el-radio border label="true">是</el-radio>
                <el-radio border label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-tab-pane>
      <el-tab-pane label="商品参数">

      </el-tab-pane>
      <el-tab-pane label="商品属性">
2
      </el-tab-pane>
      <el-tab-pane label="商品图片">
      <el-upload
          action="http://localhost:8888/api/private/v1/upload"
          :headers="headerObj"
          :file-list="fileList"
          :before-upload="handleBeforeUpload"
          :on-preview="handlePreview"
          :on-success="handleSuccess"
          :on-remove="handleRemove"
          list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品内容">
        <quill-editor
          v-model="content"
          ref="myQuillEditor"
          :options="editorOption"
          @blur="onEditorBlur($event)"
          @focus="onEditorFocus($event)"
          @ready="onEditorReady($event)">
        </quill-editor>
      </el-tab-pane>
    </el-tabs>
    </el-form>
    <div class="footer">
        <el-button>取 消</el-button>
        <el-button type="primary" @click="addProductSubmit('addProductForm')">确 定</el-button>
     </div>
  </div>
</template>
<script>
import { getCateList } from '@/api'
export default {
  data () {
    return {
      active: 0,
      searchVal: '',
      addProductForm: {
        is_promote: false,
        pcategory: [],
        selectedOptions: [],
        dparam: [],
        dtype: [],
        sparam: [],
        richText: '',
        pictures: [],
        selfDefineAttr: {
          value: 'cat_id',
          label: 'cat_name'
        }

      },
      // 设置请求头
      headerObj: {
        Authorization: localStorage.getItem('mytoken')
      },
      // 默认显示
      fileList: [
        { name: '狗.png', url: 'http://img4.imgtn.bdimg.com/it/u=1192400329,3991339099&fm=26&gp=0.jpg' }
      ],
      content: null, // 富文本编辑器内容
      editorOption: {} // 富文本编辑器配置项
    }
  },
  created () {
    // 初始化分类信息
    this.initCategory()
  },
  methods: {
    initCategory () {
      getCateList().then(res => {
        console.log(res)
        if (res.meta.status === 200) {
          this.addProductForm.pcategory = res.data
        }
      })
    },
    toggleTab (obj) {
      this.active = parseInt(obj.index)
    },
    addProductSubmit (formref) {
      console.log('提交添加')
    },
    // 上传前判断
    handleBeforeUpload (file) {
      if (file.size > 60000) {
        this.$message.error('图片不能大于60kb')
        return false
      }
    },
    // 图片预览
    handlePreview (file) {
      console.log(file)
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
      console.log('图片移除')
    },
    handleSuccess (response, file, fileList) {
      // console.log('response: ', response)
      // console.log('file: ', file)
      // console.log('fileList: ', fileList)
      this.$message.success(response.meta.msg)
    },
    onEditorBlur (quill) {
      console.log('editor blur!', quill)
    },
    onEditorFocus (quill) {
      console.log('editor focus!', quill)
    },
    onEditorReady (quill) {
      console.log('editor ready!', quill)
    }
  }
}

</script>
<style lang="scss">
.quill-editor {
  height: 400px;
  .ql-container {
    height: 300px;
  }
}
.amap-wrapper {
  width: 500px;
  height: 500px;
}
</style>
<style scoped>
.title {
  height: 45px;
  line-height: 45px;
  background-color: #D7E2EF;
  padding-left: 20px;
}
.el-tabs .el-tab-pane {
  padding-right: 20px;
}
.el-steps {
  margin: 15px 0px;
  padding-left: 20px;
}
.footer {
  margin-top: 10px;
  text-align: center;
}
</style>
