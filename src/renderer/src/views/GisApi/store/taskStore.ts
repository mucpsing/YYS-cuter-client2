/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2025-08-05 15:25:35
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2025-08-05 15:31:35
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\store\taskStore.ts
 * @Description: 存储所有历史任务记录的store
 */

import { defineStore } from "pinia"

export interface TaskItemT {
  taskId: string
  request: any
}
export const useTaskStroe = defineStore("taskStore", {
  state: () => ({
    dialog: {
      visible: false,
      title: "",
      content: "",
    },
    taskList: [] as TaskItemT[],
  }),

  actions: {
    showDialog() {
      this.dialog.visible = true
    },
    closeDialog() {
      this.dialog.visible = false
    },
  },
})
