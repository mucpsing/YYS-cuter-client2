/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2025-08-05 15:25:35
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2026-01-16 10:28:35
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\store\taskStore.ts
 * @Description: 存储所有历史任务记录的store
 */

import { defineStore } from "pinia"
import * as server from "@gisapi/utils/server"
import type { TaskItemT } from "@gisapi/Types"

export const useTaskStore = defineStore("taskStore", {
    state: () => ({
        currtTaskId: "" as string,
        dialog: {
            visible: false,
            title: "",
            content: "",
        },
        taskList: [] as TaskItemT[],

        watchTaskEventLoopId: {} as { [key: string]: NodeJS.Timeout }, //
        watchInteralTime: 1000 as number, // 默认1秒间隔
        watchInteralCount: 0 as number, // 默认监听1分钟没有任何任务的话，自动停止
        watchInteralMaxCount: 60 as number, // 默认监听1分钟没有任何任务的话，自动停止
    }),

    getters: {
        currentSelectTask: (state) => {
            const searchTask = state.taskList.find((task) => task.task_id === state.currtTaskId)
            if (!searchTask) return state.taskList[0]
            return searchTask
        },
    },

    actions: {
        // 现在topToolbar.vue中调用执行
        async init() {
            console.log("initTask 获取任务列表")

            const taskHistoryList = await server.getAllTask()

            console.log({ taskHistoryList })
        },

        watchTask(taskId: string) {
            this.watchTaskEventLoopId[taskId] = setInterval(async () => {
                const remoteTask = await server.getTaskById(taskId)

                if (!remoteTask) return console.log("远程调用失败？")

                this.updateTask(taskId, remoteTask)

                if (remoteTask.status === "completed") {
                    clearInterval(this.watchTaskEventLoopId[taskId])
                    delete this.watchTaskEventLoopId[taskId]
                }
            }, this.watchInteralTime)
        },

        watchTaskWs(taskId: string) {},

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

        async getRemoteHistoryTaskList(): Promise<TaskItemT[] | undefined> {
            return await server.getAllTask()
        },
    },
})
