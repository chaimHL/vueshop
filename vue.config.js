module.exports = {
  devServer: {
    // 自动打开浏览器
    open: true,
    // 修改端口号
    port: 8888
  },
  chainWebpack: config => {
    // 发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      // 将默认的入口文件clear后改成main-prod.js
      config.entry('app').clear().add('./src/main-prod.js')
      // 凡是声明在 externals 中的第三方依赖包，都不会被打包
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })
      // 为了自定制首页内容，给html插件增加一个自定义的属性isProd
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })
    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      // 将默认的入口文件clear后改成main-dev.js
      config.entry('app').clear().add('./src/main-dev.js')

      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
}
