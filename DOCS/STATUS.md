# 当前状态（STATUS）

## 当前目标
- 当前项目已经整理到本地可发布状态：仓库边界清楚、首发材料齐全、GitHub Release 工作流可用、本地 git 仓库已初始化。

## 下一步（最多 3 条）
1. 连接 GitHub 远程仓库。
2. 复查 `README.md`、`CHANGELOG.md`、`release-notes.md` 的首发文案。
3. 首次提交并推送 `main`，然后用 `v0.1.0` tag 触发 GitHub Release。

## 阻塞 / 风险
- Cloudflare 挑战能否自动放行，取决于目标站点策略和当前网络环境，扩展只能识别和等待，不能保证每次都自动通过。
- 成功 URL 正则和缺货关键词需要你按目标站点实际页面内容填写，规则写偏会导致误判。
- GitHub 远程仓库还没接上，当前阶段只完成了本地首发准备。

## 最近变更
- 已收紧 `.gitignore`，把 `node_modules/`、`.output/`、`.wxt/`、`reference/` 和 zip 产物排除出仓库。
- 已补根目录 `README.md`，并按要求把 QQ 交流群放到开头。
- 已补 `CHANGELOG.md`、`release-notes.md`、`DOCS/OPERATIONS/release-guide.md` 和发布决策文档。
- 已补 `.github/workflows/release.yml`，准备按 tag 自动创建 GitHub Release。
- 已完成 `git init -b main`。
- 已重新通过 `npm run compile`、`npm run build`、`npm run zip`。
