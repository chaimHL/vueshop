<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert
        title="添加商品"
        type="info"
        center
        show-icon>
      </el-alert>
      <!-- 步骤条区域 -->
      <el-steps :active="activeStep - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab 区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs v-model="activeStep" :tab-position="'left'" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item label="板式">
              <el-checkbox-group v-model="manyTabData">
                <el-checkbox :label="item" v-for="(item, i) in manyTabData" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">商品属性，没啥新知识点就忽略</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
            <!-- 图片预览 -->
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce" />
            <el-button type="primary" class="btn-add" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 引入 lodash， 其官方推荐用_作为引入的名字
import _ from 'lodash'

export default {
  data() {
    return {
      // 步骤条前激活的步骤
      activeStep: 0,
      // 表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 富文本编辑器内容
        goods_introduce: ''
      },
      // 表单验证规则
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'change' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'change' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'change' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'change' }
        ]
      },
      // 动态参数
      manyTabData: [],
      // 上传图片地址
      uploadUrl: 'https://jsonplaceholder.typicode.com/posts/',
      // 图片预览对话框是否显示
      dialogVisible: false,
      // 预览图片的地址
      dialogImageUrl: ''
    }
  },
  methods: {
    // tab 标签切换时触发
    beforeTabLeave(activeName, oldActiveName) {
      // 如果当前处于第一个 tab 且商品名称为空，则阻止 tab 切换
      if (oldActiveName === '0' && this.addForm.goods_name.trim() === '') {
        this.$message.error('请填写商品名称')
        return false
      }
    },
    // 点击 tab 触发
    tabClicked() {
      if (this.activeStep === '1') {
        const manyTabData = '49吋4K超薄曲面 人工智能,55吋4K观影曲面 30核HDR,55吋4K超薄曲面 人工智能,65吋4K超薄曲面 人工智能'
        this.manyTabData = manyTabData.split(' ')
      }
    },
    // 点击预览图片触发
    handlePreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 点击删除图片触发
    handleRemove() {},
    // 添加商品
    add() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) {
          return this.$message.error('请填写完整')
        }
        // 在案例的完整 api 中，因为要提交的表单数据和储存在 data 里的表单数据存在格式冲突
        // 所以需要用到深拷贝，用 lodash 这个 js 库里的 cloneDeep 方法
        // 要先在运行依赖安装 lodash
        const form = _.cloneDeep(this.addForm)
        console.log(form)
        this.$router.push('/goods')
      })
    }
  }
}
</script>

<style lang='less' scoped>
.el-checkbox{
  margin: 0 10px 8px 0!important;
}
.btn-add{
  margin-top: 16px;
}
</style>
