import { defineConfig } from "wxt"

export default defineConfig({
  srcDir: ".",
  modules: ["@wxt-dev/module-vue"],
  manifest: {
    name: "库存监听器",
    description: "启动浏览器后和定时运行时检查多个目标地址，命中规则后发出通知。",
    permissions: ["alarms", "notifications", "storage", "tabs", "scripting"],
    optional_host_permissions: ["<all_urls>"],
    icons: {
      16: "icon/16.png",
      32: "icon/32.png",
      48: "icon/48.png",
      128: "icon/128.png",
    },
    action: {
      default_title: "打开库存监听设置",
    },
  },
})
