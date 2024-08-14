/*
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2024-08-13 21:13:19
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-08-14 16:40:18
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\GisApi\_components\echartsComponemt\dragRect.ts
 * @Description: 对已存在的echarts实例添加点击绘制的功能
 */

import type * as echarts from "echarts"
import { isPointEqual, isClosedPath } from "./utils"
import { isNearExistingPoint, isEchartsInstance } from "./utils"

export default class ChartDragLine {
  private chart: echarts.ECharts
  private dataId: string
  private dataObj: { [dataId: string]: number[][] }
  private config: { symbolSize: number; rectFillColor: string }

  constructor(inputTar: echarts.ECharts) {
    if (isEchartsInstance(inputTar)) {
      this.chart = inputTar as echarts.ECharts
    } else {
      throw new Error("inputTar is not a valid echarts instance")
    }

    this.dataObj = { "0": [] }
    this.dataId = "0"
    this.config = { symbolSize: 20, rectFillColor: "rgba(255, 205, 205, .5 )" }

    this.initTooltip()
    this.registEvent() // 注册事件
    this.updateSeries() // 绘制视图
  }

  private initTooltip() {
    this.chart.setOption({
      tooltip: {
        triggerOn: "none",
        formatter: (params) =>
          "X: " + params.data[0].toFixed(2) + "<br>Y: " + params.data[1].toFixed(2),
      },
    })
  }

  private registEvent() {
    // 点击事件
    this.chart.getZr().on("click", (params) => this.onPointClick(params))

    // 缩放事件，一般不需要，可能会覆盖原来的
    // this.chart.on("dataZoom", () => this.updateSeries(this))

    // 窗口大小变化事件，一般不需要
    // window.addEventListener("resize", () => this.updateSeries(this))

    // 键盘事件
    window.addEventListener("keydown", (event) => {
      // 检查是否同时按下了Ctrl键和Z键
      if (event.ctrlKey && event.key === "z") {
        // 阻止默认行为（可选，取决于你的需求）
        // event.preventDefault();

        this.dataObj[this.dataId].splice(this.dataObj[this.dataId].length - 1, 1)

        this.updateSeries()
      }
    })
  }

  private showTooltip = (dataIndex: number) => {
    this.chart.dispatchAction({ type: "showTip", seriesIndex: 0, dataIndex })
  }

  private hideTooltip = (dataIndex: number) => {
    this.chart.dispatchAction({ type: "hideTip", seriesIndex: 0, dataIndex })
  }

  private updateSeries() {
    const series: echarts.SeriesOption[] = []
    Object.keys(this.dataObj).forEach((key) => {
      let color = this.config.rectFillColor

      const data = this.dataObj[key]

      series.push({
        id: `line_${key}`,
        type: "line",
        smooth: false,
        symbolSize: this.config.symbolSize,
        data,
      })

      series.push({
        id: `custom_polygon_${key}`,
        type: "custom",
        renderItem: (params, api) => {
          if (params.context.rendered) return
          params.context.rendered = true

          return {
            type: "polygon",
            transition: ["shape"],
            shape: { points: data.map((it) => api.coord(it)) },
            style: {
              fill: color,
              stroke: color,
            },
          }
        },
        clip: true,
        data,
      })
    })

    this.chart.setOption({ series })
    this.renderDragPoints() // 绘制拖动点（注册拖动事件）
  }

  private renderDragPoints() {
    setTimeout(() => {
      // Add shadow circles (which is not visible) to enable drag.
      // 视图绘制完成后再绘制拖拽点
      const graphic = this.dataObj[this.dataId].map((item, dataIndex) => {
        return {
          type: "circle",
          position: this.chart.convertToPixel("grid", item),
          shape: {
            cx: 0,
            cy: 0,
            r: this.config.symbolSize / 2,
          },
          invisible: true,
          draggable: true,

          ondrag: (event) => this.onPointDragging(dataIndex, [event.offsetX, event.offsetY]),
          onmousemove: () => this.showTooltip(dataIndex),
          onmouseout: () => this.hideTooltip(dataIndex),

          z: 100,
        }
      })

      this.chart.setOption({ graphic })
    }, 100)
  }

  private onPointDragging(dataIndex: number, pos: [number, number]) {
    const newPos = this.chart.convertFromPixel("grid", pos)
    const data = this.dataObj[this.dataId]
    const _isPointEqual = isPointEqual(data[0], data[data.length - 1])

    if ((dataIndex == 0 || dataIndex == data.length - 1) && _isPointEqual) {
      data[0] = newPos
      data[data.length - 1] = newPos
    } else {
      data[dataIndex] = newPos
    }

    this.updateSeries()
  }

  private onPointClick(params: { offsetX: number; offsetY: number }) {
    const { offsetX, offsetY } = params
    const data = this.dataObj[this.dataId]
    const pointInPixel = [offsetX, offsetY]
    const pointInGrid = this.chart.convertFromPixel("grid", pointInPixel)
    const oldLen = data.length

    // 检查新点是否在图表区域内
    if (!this.chart.containPixel("grid", pointInPixel)) return

    // 检查新点附近是否已有点
    const existingPoints = data.map((item) => this.chart.convertToPixel("grid", item))

    // 判断是否在现有点附近，如果是则获取该下标
    const dataNearIndex = existingPoints.findIndex((points) =>
      isNearExistingPoint(pointInPixel, points, this.config.symbolSize),
    )

    const isClosed = isClosedPath(data)
    const isLastPoint = dataNearIndex === data.length - 1

    // 路径未闭合，没有临近点：新增
    if (dataNearIndex === -1 && !isClosed) {
      data.push(pointInGrid)
    }

    // 闭合路径，点击最后一个点：删除
    if (isLastPoint && isClosed) {
      data.pop()
    }

    // 路径闭合，点击起点：删除
    if (dataNearIndex === 0 && isClosed) {
      data.pop()
    }

    // 路径未闭合，点击起点：闭合
    if (dataNearIndex === 0 && !isClosed) {
      data.push(data[0])
    }

    // 数据已动，更新视图
    if (oldLen !== data.length) this.updateSeries()
  }
}
