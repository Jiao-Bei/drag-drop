import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    server:{
      host:'127.0.0.1' ,//ip地址
      port: 24123, // 设置服务启动端口号
      open: true, // 设置服务启动时是否自动打开浏览器
    }
  },

  // vue.config.js 添加如下配置
  module: {
    rules: [
      {
        test: require('path').resolve(__dirname, 'node_modules/leader-line/'),
        use: [{
          loader: 'skeleton-loader',
          options: {procedure: content => `${content}export default LeaderLine`}
        }]
      }
    ]
  },
  configureWebpack: config => {
    let path = require('path')
    config.module.rules.push({
      test: path.resolve(__dirname, 'node_modules/leader-line/'),
      use: [
        {
          loader: 'skeleton-loader',
          options: {
            procedure: content => `${content}export default LeaderLine`
          }
        }
      ]
    })
  }
})
