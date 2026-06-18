# LegacyTree 数字遗产与家谱平台

LegacyTree 是一个纯前端的数字遗产与家谱管理平台，用于构建交互式家族树、记录家族故事、整理老照片、规划数字遗产。数据默认保存在浏览器本地，IndexedDB 承载实体数据，localStorage/sessionStorage 保存轻量设置与会话密钥状态。

## 功能介绍

- 家谱树：D3.js 渲染交互式树，支持缩放、平移、搜索、居中、全屏、SVG 导出、节点详情抽屉、配偶虚线关系。
- 成员详情：展示头像、性别、生卒年份、出生地、简介、故事时间线、照片画廊、亲属关系和遗产规划。
- 家族故事：按回忆、成就、趣事、家训分类筛选，可在卡片和时间线视图之间切换。
- 老照片馆：照片墙、年份时间轴、Canvas 基础修复滤镜、修复前后状态展示。
- 遗产规划：按遗嘱意向、数字资产、纪念品、信件创建规划，支持草稿、定稿、归档状态流转。
- 设置：加密密码、JSON 导出、加密导出、GEDCOM 导入、深浅主题切换。

## 快速启动

```bash
npm install
npm run dev
```

访问地址：http://localhost:38406

## 技术栈

| 技术 | 用途 |
|---|---|
| Vue 3 + TypeScript | 应用与类型安全 |
| Pinia | family/story/photo/legacy/settings 独立状态管理 |
| Vue Router 4 | 页面路由 |
| Naive UI | 表格、表单、抽屉、弹窗、消息 |
| D3.js | 家谱树布局、缩放和平移 |
| Canvas API | 老照片基础滤镜修复 |
| Web Crypto API | PBKDF2 + AES-GCM 加密 |
| IndexedDB + idb | 本地持久化 |

## 文件结构清单

```text
src/
├── stores/        # familyStore.ts, storyStore.ts, photoStore.ts, legacyStore.ts, settingsStore.ts
├── types/         # family.d.ts, story.d.ts, photo.d.ts, legacy.d.ts, settings.d.ts, import-export.d.ts
├── constants/     # enums.ts, default-templates.ts
├── components/common/  # MemberAvatar, TimelineView, MediaGallery, EmptyState, ConfirmDialog, MessageBridge
├── components/tree/    # FamilyTreeView, TreeNode, TreeControls
├── hooks/         # useFamily(), useStory(), usePhoto(), useEncryption()
├── pages/         # FamilyTree, MemberDetail, Stories, Photos, Legacy, Settings
├── router/        # index.ts, routes.ts, guards.ts
├── db/            # family-db.ts, story-db.ts, photo-db.ts, legacy-db.ts, secure-store.ts, index.ts
├── utils/         # gedcom-parser.ts, crypto.ts, export.ts, image-filter.ts, member-status.ts, error-handler.ts
└── assets/        # 默认头像、空状态插画、图标
```

## 枚举使用位置清单

所有枚举唯一来源为 `src/constants/enums.ts`。

| 枚举 | 使用位置 |
|---|---|
| Gender | `src/types/family.d.ts` FamilyMember 类型；`src/constants/default-templates.ts` 示例成员；`src/pages/FamilyTree.vue` 成员表单；`src/pages/MemberDetail.vue` 成员详情；`src/utils/gedcom-parser.ts` GEDCOM 性别转换 |
| StoryCategory | `src/types/story.d.ts` Story 类型；`src/constants/default-templates.ts` 示例故事；`src/stores/storyStore.ts` 分类筛选状态；`src/pages/Stories.vue` 筛选标签、故事卡片、撰写表单 |
| LegacyType | `src/types/legacy.d.ts` LegacyPlan 类型；`src/constants/default-templates.ts` 示例规划；`src/pages/Legacy.vue` 规划列表图标标签、创建表单类型选择；`src/pages/MemberDetail.vue` 规划类型展示 |
| MemberStatus | `src/types/family.d.ts` FamilyTreeNode 类型；`src/utils/member-status.ts` 状态推导；`src/stores/familyStore.ts` 树节点状态生成；`src/components/tree/TreeNode.vue` 节点样式；`src/pages/FamilyTree.vue` 成员详情标记 |

## 数据加密说明

- 算法：密码通过 PBKDF2 派生 AES-GCM 256 位密钥，PBKDF2 使用 SHA-256 和 120000 次迭代。
- 密钥管理：派生出的原始密钥仅放在 sessionStorage，本页面会话关闭后需要重新输入密码。localStorage 只保存提示语，不保存密码。
- 加密范围：IndexedDB 写入层通过 `src/db/secure-store.ts` 自动包装加密/解密；成员个人信息、故事内容、遗产规划内容会随实体记录加密存储。照片图片 base64 体积较大，不做额外字段级加密；照片标题、年份、地点、人物等标注信息随 Photo 记录进入 DB 包装层。
- 导出加密：`src/utils/export.ts` 支持加密导出 JSON，Family、Story、LegacyPlan 会写为加密载荷；照片保留图片字段以避免体积膨胀，标注信息按当前实现保留在导出结构中。

## 导入导出说明

- JSON 导出：设置页可导出完整 family、stories、photos、legacyPlans 数据。
- 加密 JSON 导出：需要先设置加密密码，否则 Web Crypto 层会提示密钥未解锁。
- GEDCOM 导入：`src/utils/gedcom-parser.ts` 支持读取 `INDI`、`NAME`、`SEX`、`BIRT DATE`、`DEAT DATE` 元素并转换为 FamilyMember。
- GEDCOM 限制：当前版本不解析 `FAM`、`HUSB`、`WIFE`、`CHIL` 家庭关系块，因此导入后父子和配偶关系需要在家谱树中手动补充。

## 全局异常处理说明

`src/utils/error-handler.ts` 提供统一错误通知桥接，`src/components/common/MessageBridge.vue` 将 Naive UI `n-message` 注入工具层。IndexedDB、导入导出、加密、Canvas 修复等异步操作通过 store/hook 调用，可将错误交给友好提示展示；解密失败会提示检查密码。D3 家谱树如果渲染数据为空，仍保留工具栏和页面容器，成员详情可通过路由返回有效成员。

## License

MIT
