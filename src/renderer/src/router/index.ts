/*!
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2022-11-21 23:22:02.057232
 * @Last Modified by: CPS
 * @Last Modified time: 2022-11-21 23:22:02.057232
 * @Projectname
 * @file_path "D:\CPS\MyProject\Projects_Personal\YYS\YYS-cuter-client\packages\renderer\src\router"
 * @Filename "router"
 * @Description: 路由生成
 */

import Home from "@renderer/views/Home/index.vue"

import { createRouter, createWebHistory } from "vue-router"
import type { RouteRecordRaw } from "vue-router"

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/ImageCuter",
    name: "ImageCuter",
    component: () => import("@renderer/views/ImageCuter/index.vue"),
  },
  {
    path: "/GisApi",
    name: "GisApi",
    component: () => import("@renderer/views/GisApi/index.vue"),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
