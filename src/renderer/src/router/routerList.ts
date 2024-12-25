/*
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2023-09-10 21:57:59
 * @LastEditors: Capsion 373704015@qq.com
 * @LastEditTime: 2024-12-25 23:33:51
 * @FilePath: \YYS-cuter-client2\src\renderer\src\router\routerList.ts
 * @Description: 路由元数据，用于生成路由和侧边栏的主菜单列
 */
export const routerList = [
  {
    name: "仪表盘",
    icon: "yuzhiyibiaopan",
    iconSub: "home1",
    routerPath: "/home",
    comment: () => import("@renderer/views/Home/index.vue"),
  },
  {
    name: "截图插件",
    icon: "caijian",
    iconSub: "tupiancaijian",
    routerPath: "/ImageCuter",
    comment: () => import("@renderer/views/ImageCuter/index.vue"),
  },
  {
    name: "河道断面图",
    icon: "icon-yys-chart-trend-full",
    iconSub: "icon-yys-fsux_zhexiantu",
    routerPath: "/ImageCuter",
    comment: () => import("@renderer/views/ImageCuter/index.vue"),
  },
  {
    name: "GisAPI",
    icon: "icon-yys-GISguankong",
    iconSub: "icon-yys-logistic",
    routerPath: "/GisApi",
    comment: () => import("@renderer/views/GisApi/index.vue"),
  },
  {
    name: "Typhoon",
    icon: "icon-yys-taifeng",
    iconSub: "icon-yys-logistic",
    routerPath: "/TyphoonUI",
    comment: () => import("@renderer/views/TyphoonUI/index.vue"),
  },
  // {
  //   name: "NS-NPC管理",
  //   icon: "icon-yys-youxi",
  //   iconSub: "icon-yys-yonghuziliao-xianxing",
  //   routerPath: "/NsNpcManager",
  //   comment: () => import("@renderer/views/NsNpcManager/index.vue"),
  // },
  // {
  //   name: "NS-物品管理",
  //   icon: "icon-yys-youxi",
  //   iconSub: "icon-yys-yonghuziliao-xianxing",
  //   routerPath: "/NsItemManager",
  //   comment: () => import("@renderer/views/NsItemManager/index.vue"),
  // },
  // {
  //   name: "NS-技能管理",
  //   icon: "icon-yys-youxi",
  //   iconSub: "icon-yys-yonghuziliao-xianxing",
  //   routerPath: "/NsSkillManager",
  //   comment: () => import("@renderer/views/NsSkillManager/index.vue"),
  // },
]

export const lastRouterPath = routerList[routerList.length - 1].routerPath

export default routerList
