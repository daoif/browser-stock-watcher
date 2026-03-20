# 全貌（OVERVIEW）

## 一句话
- 这是一个可配置、多目标的浏览器库存监听扩展。它在浏览器启动后和后续定时检查目标页面状态，命中成功规则时发系统通知，其他情况下只记录状态，不做自动购买。

## 模块边界
- 设置页：以扩展自己的完整标签页页面打开，地址是 `chrome-extension://.../options.html`，用于管理目标列表、成功规则、缺货关键词、检查间隔、启停、手动检查和最近结果。
- 后台服务：负责启动检查、定时检查、任务串行队列、报警调度和通知派发。
- 临时标签页检查器：负责创建后台标签页、访问目标 URL、等待页面稳定、识别成功页、缺货页和 Cloudflare 挑战页。
- 存储层：保存目标配置和最近结果。
- 通知层：调用浏览器标准通知，把可购买提醒投递到系统通知区，并在点击通知后打开目标页面。
- 发布层：负责版本号同步、release notes、GitHub Actions 打包和 Release 上传。

## 关键数据流 / 依赖
- 用户在设置页保存多个目标配置。
- 后台服务在浏览器启动、安装完成、闹钟触发和手动运行时读取配置。
- 点击扩展图标时，后台直接打开或聚焦扩展自己的 `options.html` 标签页。
- 每个目标交给临时标签页检查器串行执行。
- 检查器访问真实页面，读取最终 URL、标题和正文片段。
- 判断结果写回存储层；命中成功规则时再交给通知层。
- 发布时由 GitHub Actions 读取仓库源码，运行 `npm ci`、`npm run build`、`npm run zip`，再上传 zip 到 GitHub Release。

## 当前目录结构
- `entrypoints/background.ts`：后台服务入口。
- `entrypoints/options/`：设置页入口和样式入口。
- `src/lib/`：检查器、存储、通知、权限、校验和通用工具。
- `src/options/`：Vue 设置页和组件。
- `public/icon/`：扩展图标。
- `DOCS/OPERATIONS/install-and-test.md`：安装和测试说明。
- `DOCS/OPERATIONS/release-guide.md`：版本同步和发布流程。
- `.github/workflows/release.yml`：GitHub Release 自动发布工作流。

## 产品边界
- 做：监听、识别、通知、状态记录、错误反馈、打包交付。
- 不做：自动购买、自动提交订单、自动绕过验证码、自动求解 Cloudflare 人机验证。

## 当前选型
- 平台：Chrome / Edge Manifest V3。
- 前端：Vue 3 + Tailwind CSS。
- 设置页入口：点击图标后打开 `chrome-extension://.../options.html` 顶级标签页，不使用 popup 小窗。
- 文档语言：首发只保留中文，不维护英文版文档。
- 仓库归属：GitHub 用户名按 `daoif` 组织 README 和 Release 链接。
- 设计约束：纯白简洁，不用 UI 组件库，边框和留白按整体关系控制。
- 交付标准：成品交付，不接受 mock、MVP、半成品。

## 文档导航
- 设计蓝图和任务列表：见 `PLANS/2026-03-20-browser-stock-watcher.md`
- 安装和测试：见 `OPERATIONS/install-and-test.md`
- 发布指南：见 `OPERATIONS/release-guide.md`
- 关键决策：见 `DECISIONS/`
