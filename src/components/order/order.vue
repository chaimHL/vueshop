<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索框区域 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 省市区三级联动（带'全部'选项） -->
      <el-button type="primary" class="area-btn" @click="showBox">选择地区</el-button>
      <!-- 选择地址的对话框 -->
      <el-dialog
        title="选择地址"
        :visible.sync="addressVisible"
        width="30%">
        <el-cascader
          size="large"
          :options="options"
          v-model="selectedOptions">
        </el-cascader>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addressVisible = false">取 消</el-button>
          <el-button type="primary" @click="addressVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { regionDataPlus } from 'element-china-area-data'
export default {
  data() {
    return {
      addressVisible: false,
      options: regionDataPlus,
      selectedOptions: []
    }
  },
  created() {
    console.log(regionDataPlus)
  },
  methods: {
    showBox() {
      this.addressVisible = true
    }
  }
}
</script>

<style lang='less' scoped>
.area-btn{
  margin-top: 16px;
}
.el-cascader{
  width: 100%;
}
</style>
