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

import routerList from "@renderer/router/routerList"

import { createRouter, createWebHistory } from "vue-router"
import type { RouteRecordRaw } from "vue-router"

const routes: Array<RouteRecordRaw> = routerList.map((item) => ({
  path: item.routerPath,
  name: item.name,
  component: item.comment,
}))

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
