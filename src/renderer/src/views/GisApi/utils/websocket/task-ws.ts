/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2026-01-15 17:11:19
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2026-01-15 17:11:25
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\utils\websocket\task-ws.ts
 * @Description: 这是任务管理器专用的ws模块
 */
// utils/websocket/task-ws.ts
export class TaskWebSocket {
    private ws: WebSocket | null = null
    private reconnectAttempts = 0
    private maxReconnectAttempts = 5
    private reconnectDelay = 3000

    constructor(private url: string, private store: any) {}

    connect(): void {
        this.ws = new WebSocket(this.url)

        this.ws.onopen = this.handleOpen.bind(this)
        this.ws.onmessage = this.handleMessage.bind(this)
        this.ws.onerror = this.handleError.bind(this)
        this.ws.onclose = this.handleClose.bind(this)
    }

    private handleOpen(): void {
        console.log("WebSocket连接已建立")
        this.reconnectAttempts = 0

        // 发送认证信息（如果需要）
        this.send({
            type: "auth",
            token: localStorage.getItem("token"),
        })
    }

    private handleMessage(event: MessageEvent): void {
        try {
            const data = JSON.parse(event.data)
            this.handleTaskUpdate(data)
        } catch (error) {
            console.error("解析WebSocket消息失败:", error)
        }
    }

    private handleTaskUpdate(data: any): void {
        const { store } = this

        // 根据消息类型更新store
        switch (data.type) {
            case "task_update":
                store.updateTask(data.task)
                break
            case "task_add":
                store.addTask(data.task)
                break
            case "task_remove":
                store.removeTask(data.taskId)
                break
            case "task_list":
                store.setTaskList(data.tasks)
                break
        }
    }

    send(data: any): void {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data))
        }
    }

    private handleError(error: Event): void {
        console.error("WebSocket错误:", error)
    }

    private handleClose(): void {
        console.log("WebSocket连接关闭")
        this.attemptReconnect()
    }

    private attemptReconnect(): void {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++
            setTimeout(() => {
                console.log(`尝试重新连接 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
                this.connect()
            }, this.reconnectDelay)
        }
    }

    disconnect(): void {
        this.ws?.close()
    }
}
