# 决策：仓库首发与 GitHub 发布

## 结论
- 首发仓库只维护中文版文档，不额外维护英文版。
- 根目录 `README.md` 开头放 QQ 交流群入口。
- GitHub 用户名按 `daoif` 组织 README 链接和 Release 链接。
- 发布方式采用 `tag -> GitHub Actions -> GitHub Release`。

## 背景
- 当前用户主要是中文用户，首发阶段维护双语文档只会增加同步成本。
- 仓库发布前需要把 README、CHANGELOG、release notes 和自动发布流程一次整理到位。
- 这个项目的发布物是浏览器扩展 zip，不是桌面程序安装器，发布流程可以保持简单。

## 取舍
- 选择了什么：只保留中文文档、补齐首发 README、CHANGELOG、release notes、Release workflow。
- 放弃了什么：首发阶段同步维护英文文档；手工上传产物为主的发布方式。
