# 操作：发布指南

## 目的
- 在首发前把仓库内容、版本信息、构建产物和 GitHub Release 流程统一起来，避免仓库里混入不该提交的东西，也避免发布时文档和版本脱节。

## 发布前检查
1. 检查 `.gitignore`，确认 `node_modules/`、`.output/`、`.wxt/`、`reference/`、日志和 zip 产物都不会进仓库。
2. 检查 `README.md`、`CHANGELOG.md`、`release-notes.md` 的版本号是否一致。
3. 检查 `package.json` 的 `version` 是否已经更新。
4. 运行 `npm run compile`、`npm run build`、`npm run zip`。
5. 确认 `.output/browser-stock-watcher-<version>-chrome.zip` 已生成。

## 版本号同步
- `package.json` -> `version`
- `README.md` -> 顶部版本徽章和版本信息
- `CHANGELOG.md` -> 新版本记录
- `release-notes.md` -> 本次发布说明

## 发布步骤
1. 更新版本号和发布说明。
2. 本地跑：`npm run compile`、`npm run build`、`npm run zip`。
3. 提交代码。
4. 创建并推送 tag：`vX.Y.Z`
5. 等待 GitHub Actions 自动创建 Release 并上传 zip 产物。

## 本地命令
```powershell
git add -A
git commit -m "release: vX.Y.Z"
git tag vX.Y.Z
git push origin main
git push origin vX.Y.Z
```

## 如何确认成功
- GitHub Actions 运行成功。
- GitHub Releases 页面出现对应版本。
- Release 附件里有 `browser-stock-watcher-<version>-chrome.zip`。
- `README.md`、`CHANGELOG.md`、`release-notes.md` 和 `package.json` 的版本一致。
