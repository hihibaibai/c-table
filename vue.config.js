const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack:{
    resolve:{fallback:{ "fs": 'mock', "child_process": 'mock', "os": require.resolve("os-browserify/browser"), "path": require.resolve("path-browserify")}}
  },
  lintOnSave:false
})
