/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2025-08-05 15:25:35
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2025-10-16 08:55:18
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
    currtTaskId: "" as string,
    dialog: {
      visible: true,
      title: "",
      content: "",
    },
    taskList: [] as TaskItemT[],
    // taskList: [
    //   { task_id: "test", progress: 50, status: "pending", preview: "" },
    //   { task_id: "test2", progress: 50, status: "pending", preview: "" },
    //   { task_id: "test3", progress: 50, status: "pending", preview: "" },
    //   { task_id: "test4", progress: 50, status: "pending", preview: "" },
    //   { task_id: "test5", progress: 50, status: "pending", preview: "" },
    // ] as TaskItemT[],
  }),

  getters: {
    currentSelectTask: (state) => {
      const searchTask = state.taskList.find((task) => task.task_id === state.currtTaskId)
      if (!searchTask) return state.taskList[0]
      return searchTask
    },
  },

  actions: {
    // 设置成当前激活，展示具体任务信息到任务页
    selectTask(taskId: string) {
      this.currtTaskId = taskId
    },

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
