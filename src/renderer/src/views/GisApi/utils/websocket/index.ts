/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2026-01-15 17:10:20
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2026-01-16 10:27:28
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\utils\websocket\index.ts
 * @Description: 管理所有ws的连接
 */

import { TaskWebSocket } from "@gisapi/utils/websocket/task-ws"
import { useTaskStore } from "@gisapi/store/taskStore"
import { API } from "@gisapi/store/API"

class WebSocketManager {
    private taskWebSocket: TaskWebSocket | null = null
    private static instance: WebSocketManager

    private constructor() {}

    static getInstance(): WebSocketManager {
        if (!WebSocketManager.instance) {
            WebSocketManager.instance = new WebSocketManager()
        }
        return WebSocketManager.instance
    }

    initTaskWebSocket(): void {
        if (!this.taskWebSocket) {
            const taskStore = useTaskStore()
            const wsUrl = API.testWs
            this.taskWebSocket = new TaskWebSocket(wsUrl, taskStore)
            this.taskWebSocket.connect()
        }
    }

    destroyTaskWebSocket(): void {
        this.taskWebSocket?.disconnect()
        this.taskWebSocket = null
    }

    sendTaskMessage(data: any): void {
        this.taskWebSocket?.send(data)
    }
}

export const wsManager = WebSocketManager.getInstance()
