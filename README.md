# Browser Stock Watcher

<p align="center">
  <img src="public/icon/128.png" alt="Browser Stock Watcher" width="120">
</p>

<h1 align="center">Browser Stock Watcher</h1>

<p align="center">
  <a href="https://github.com/daoif/browser-stock-watcher/releases">
    <img src="https://img.shields.io/badge/版本-v0.1.0-blue.svg" alt="版本">
  </a>
  <a href="https://github.com/daoif/browser-stock-watcher/releases">
    <img src="https://img.shields.io/badge/发布方式-GitHub%20Release-green.svg" alt="发布方式">
  </a>
</p>

<p align="center">
  💬 <a href="https://qm.qq.com/q/AHUKoyLVKg">QQ 交流群: 993975349</a>
</p>

> 一个面向个人使用的浏览器库存监听扩展。它会在浏览器启动后和后续定时运行时检查多个目标地址，命中成功规则后把消息推到系统通知区。

> **转载说明**
> 本项目欢迎任何社区、论坛、平台转载分享。
> 但请勿将本项目发布至某 L 站。
> 原因是：本项目包含社群链接，按该站相关尺度，这类内容属于“推广”。

---

## 项目简介

这个扩展只做三件事：

- 监听你配置的多个目标地址
- 识别成功跳转、缺货状态和 Cloudflare 挑战状态
- 在命中成功规则后发出浏览器标准通知

它不做自动购买，不做自动提交订单，不做验证码求解，也不做任何站点攻击类行为。

---

## 功能特性

| 功能 | 说明 |
|------|------|
| 多目标监听 | 可以一次配置多个目标地址 |
| 成功 URL 规则 | 用正则匹配最终成功跳转地址 |
| 缺货关键词识别 | 页面内容命中关键词就判定为缺货 |
| Cloudflare 挑战检测 | 识别挑战页并等待一段时间，不误报可购买 |
| 标准通知 | 命中成功规则后发浏览器标准通知，进入系统通知区 |
| 完整设置页 | 点击扩展图标后，直接打开 `chrome-extension://.../options.html` 的完整标签页 |

---

## 安装使用

### 开发者模式安装

1. 先跑 `npm install`
2. 再跑 `npm run build`
3. 打开浏览器扩展管理页，开启开发者模式
4. 选择“加载已解压的扩展程序”，指向 `.output/chrome-mv3`
5. 点击扩展图标，确认打开的是扩展自己的完整标签页页面
6. 在设置页里添加目标，保存时授权对应站点的页面读取权限

### Release 安装

首发后可直接从 GitHub Releases 下载 zip 或发布产物。发布规范见 `DOCS/OPERATIONS/release-guide.md`。

---

## 本地开发

```powershell
npm install
npm run compile
npm run build
npm run zip
```

### 构建产物

- 可直接加载目录：`.output/chrome-mv3`
- 打包压缩包：`.output/browser-stock-watcher-0.1.0-chrome.zip`

---

## 文档导航

- 文档入口：`DOCS/README.md`
- 当前状态：`DOCS/STATUS.md`
- 安装与测试：`DOCS/OPERATIONS/install-and-test.md`
- 发布指南：`DOCS/OPERATIONS/release-guide.md`
- 变更日志：`CHANGELOG.md`
- 发布说明：`release-notes.md`

---

## 版本信息

当前版本：**v0.1.0**

完整更新记录见 `CHANGELOG.md`。


