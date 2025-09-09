/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2025-08-05 15:25:35
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2025-08-15 17:29:52
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\store\taskStore.ts
 * @Description: 存储所有历史任务记录的store
 */

import { defineStore } from "pinia"
import type { FormDataItemT, MxdToImgFormT } from "@gisapi/Types"

export interface TaskItemT {
  preview: string
  task_id: string
  status:
    | "pending"
    | "running"
    | "processing"
    | "completed"
    | "failed"
    | "cancelling"
    | "cancelled"
    | "invalid" // invalid
  progress: number
  request: MxdToImgFormT
  created_at: number
  updated_at: number
  result: any
  error: any
}

export const useTaskStore = defineStore("taskStore", {
  state: () => ({
    dialog: {
      visible: true,
      title: "",
      content: "",
    },
    // taskList: [] as TaskItemT[],
    taskList: [{ task_id: "test", progress: 50, status: "pending", preview: "" }] as TaskItemT[],
  }),

  actions: {
    getTask(taskId: string) {
      return this.taskList.find((task) => task.task_id === taskId)
    },

    addTask(taskInfo: TaskItemT) {
      // body调用接口后，返回的taskInfo转换为本地的taskItem
      // 将taskItem放到state中
      // 显示taskDialog
      if (!taskInfo.preview) taskInfo.preview = ""
      this.taskList.push(taskInfo)
    },
    updateTask(taskId: string, newTaskInfo: Partial<TaskItemT>) {
      // 更新任务状态
      const task = this.taskList.find((taskItem) => taskItem.task_id === taskId)
      if (!task) return
      Object.assign(task, newTaskInfo)
    },

    showDialog() {
      this.dialog.visible = true
    },
    closeDialog() {
      this.dialog.visible = false
    },
  },
})
