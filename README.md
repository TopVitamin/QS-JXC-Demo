# 进销存管理系统 · 前端框架 Demo

面向企业内部用户的进销存后台管理系统前端骨架。本项目侧重工程基础、页面框架、导航体系、通用组件和代表性示例页面，**不包含真实业务逻辑与后端服务**，所有数据来自本地 Mock。

## 技术栈

| 技术 | 版本 |
|---|---|
| React + TypeScript | React 19 / TypeScript 7 |
| 构建工具 | Vite 8 |
| 样式 | Tailwind CSS 4（`@tailwindcss/vite`） |
| UI 组件库 | shadcn/ui（radix-nova 风格，Radix UI） |
| 路由 | React Router 8 |
| 图标 | Lucide React |
| 消息提示 | Sonner（shadcn/ui 推荐） |

## 快速开始

需要 Node.js 20.19+（开发时使用 Node 26）。

```bash
npm install
npm run dev        # 启动开发服务器：http://localhost:5180
npm run build      # 类型检查 + 生产构建，输出到 dist/
npm run preview    # 预览生产构建
npm run lint       # oxlint 代码检查
```

> 开发端口固定为 5180（见 `vite.config.ts`），避免与本机其他 Vite 项目的默认端口 5173 冲突。

## 目录结构

```
src/
├── main.tsx                 # 应用入口：RouterProvider、Toaster、TooltipProvider
├── index.css                # Tailwind 与主题变量（浅色主题，蓝色主色）
├── config/menu.ts           # 菜单配置（一级分组 + 二级菜单），集中管理
├── router/index.tsx         # 路由：由菜单配置生成；pageRegistry 注册已开发页面
├── layouts/                 # 通用后台布局（与业务页面解耦）
│   ├── admin-layout.tsx     #   整体框架：侧边栏 + 顶部导航 + 内容区
│   ├── sidebar.tsx          #   左侧菜单：分组展开/收起、选中高亮、整体折叠
│   └── header.tsx           #   顶部导航：面包屑、折叠按钮、通知、全屏、用户菜单
├── components/
│   ├── ui/                  # shadcn/ui 组件（CLI 生成，尽量不改动）
│   └── common/              # 业务通用组件
│       ├── page-header.tsx  #   页面标题与操作栏、页面容器
│       ├── search-panel.tsx #   搜索筛选区域 + 筛选项
│       ├── data-table.tsx   #   数据表格（列定义渲染、加载骨架、空状态）+ 表格容器
│       ├── table-pagination.tsx # 分页
│       ├── status-badge.tsx #   状态标签
│       ├── empty-state.tsx  #   空数据状态
│       ├── form-dialog.tsx  #   表单弹窗 + 表单项
│       ├── confirm-dialog.tsx # 确认对话框
│       ├── page-loading.tsx #   加载状态
│       ├── option-select.tsx #  选项下拉框
│       ├── date-range.tsx   #   日期区间
│       └── detail-layout.tsx #  详情分区卡片、描述列表、底部操作栏
├── pages/                   # 业务页面（按模块划分）
│   ├── dashboard/           #   工作台首页
│   ├── basic/               #   商品管理（列表 + 新增/编辑弹窗）
│   ├── purchase/            #   采购订单（列表、详情、新建）
│   ├── sales/               #   销售订单列表
│   ├── inventory/           #   库存查询
│   ├── placeholder.tsx      #   未开发菜单的统一占位页
│   └── not-found.tsx        #   404 页面
├── hooks/use-local-table.ts # 本地列表查询：筛选条件 + 分页
├── mock/                    # 本地 Mock 数据（TypeScript）
├── types/index.ts           # 业务类型定义
└── lib/                     # 工具：cn、格式化、状态字典、演示提示
```

## 菜单与页面实现范围

| 一级菜单 | 二级菜单 | 状态 |
|---|---|---|
| 工作台 | 首页概览 | ✅ 已实现 |
| 基础资料 | 商品管理 | ✅ 已实现 |
| | 供应商管理、客户管理、仓库管理 | 占位页 |
| 采购管理 | 采购订单（含详情页 `/purchase/orders/:id`、新建页 `/purchase/orders/new`） | ✅ 已实现 |
| | 采购入库单、采购退货单 | 占位页 |
| 销售管理 | 销售订单 | ✅ 已实现（列表） |
| | 销售出库单、销售退货单 | 占位页 |
| 库存管理 | 库存查询 | ✅ 已实现 |
| | 出入库流水、库存盘点、其他入库单、其他出库单 | 占位页 |
| 系统管理 | 用户管理、角色管理 | 占位页 |

### 已实现的交互

- 菜单分组展开/收起、选中高亮、侧边栏整体折叠（折叠状态保存在浏览器本地，折叠后点击图标弹出二级菜单）
- 面包屑根据菜单配置与路由自动生成
- 列表页：条件输入、回车/点击查询、重置、基于本地数据的筛选、分页与每页条数切换
- 商品管理：新增/编辑表单弹窗（含必填校验）、启用/停用、删除确认；修改只作用于当前页面内存数据，刷新后恢复
- 采购订单：列表 → 详情跳转与返回；新建页包含基本信息与可增删的商品明细行，提交时做基础校验
- 库存查询：刷新时展示表格加载骨架
- 通知消息弹层、全部已读；用户下拉菜单
- 未实现的操作（导出、打印、审核、销售订单详情等）统一提示“演示功能，暂未实现”

### 明确未实现

后端服务与接口、真实登录与权限（RBAC）、审批流与单据状态流转、采购/销售/库存业务闭环、库存计算与单据联动、财务成本结算、自动化测试、生产部署方案。单据状态、库存提示等仅为展示用的示例字段。

## 扩展指引

- **新增页面**：在 `src/config/menu.ts` 添加菜单项 → 在 `src/pages/` 下新建页面 → 在 `src/router/index.tsx` 的 `pageRegistry` 中注册。未注册的菜单会自动显示占位页。
- **菜单外的子页面**（详情、新建等）：加入 `router/index.tsx` 的 `subRoutes`，并通过 `handle.title` 设置面包屑标题。
- **对接真实接口**：页面目前直接引用 `src/mock/` 数据，并通过 `useLocalTable` 在前端筛选分页。对接时可新增 `src/api/` 请求层，将 `useLocalTable` 中的本地筛选替换为接口查询，页面上的查询区、表格和分页用法保持不变。类型定义见 `src/types/`。
- **状态文案与颜色**：统一在 `src/lib/dict.ts` 维护。
- **添加 shadcn/ui 组件**：`npx shadcn@latest add <component>`。如果本机配置了 SOCKS 代理（`all_proxy`）导致 CLI 请求失败，可临时去掉该变量后执行：`env -u all_proxy -u ALL_PROXY npx shadcn@latest add <component>`。
