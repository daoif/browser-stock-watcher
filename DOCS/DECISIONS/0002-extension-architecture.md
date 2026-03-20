# 决策：浏览器扩展架构

## 结论
- 采用 Chrome / Edge Manifest V3 扩展。
- 点击扩展图标时，直接打开扩展自己的完整标签页页面，地址是 `chrome-extension://.../options.html`。
- 后台检查使用真实后台标签页导航，不把后台 `fetch()` 作为主路径。

## 背景
- 需求的触发条件是浏览器启动和后续定时检查，而不是用户访问某个特定页面。
- 目标站点可能存在 Cloudflare 挑战，真实浏览器导航比后台直接请求更接近正常访问路径。
- 用户明确要求不要扩展按钮下的 popup 小窗，也不要依赖浏览器托管的 options 打开方式，而要扩展自己的顶级标签页页面。

## 取舍
- 选择了什么：`runtime.onStartup` + `alarms` + `tabs` + `storage` + `notifications` 的扩展架构，并由后台直接打开或聚焦 `chrome-extension://.../options.html`。
- 放弃了什么：本地网页常驻方案、油猴脚本挂全站方案、后台 `fetch()` 作为主检查路径、浏览器托管的 `openOptionsPage()` 打开方式。
