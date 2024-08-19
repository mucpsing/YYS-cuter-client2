/*
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2024-08-13 21:13:19
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-08-19 11:18:21
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\GisApi\_components\echartsComponemt\dragRect.ts
 * @Description: 对已存在的echarts实例添加点击绘制的功能
 */

import type * as echarts from "echarts"
import { isPointEqual, isClosedPath } from "./utils"
import { isNearExistingPoint, isEchartsInstance } from "./utils"

export default class ChartDragLine {
  public chart: echarts.ECharts

  private _dataId: string
  private _dataObj: { [dataId: string]: number[][] }
  private config: { symbolSize: number; rectFillColor: string }

  private dragging: boolean

  constructor(inputTar: echarts.ECharts) {
    if (isEchartsInstance(inputTar)) {
      this.chart = inputTar as echarts.ECharts
    } else {
      throw new Error("inputTar is not a valid echarts instance")
    }

    this._dataObj = { "0": this._createData([]) }
    this._dataId = "0"
    this.config = { symbolSize: 20, rectFillColor: "rgba(255, 205, 205, .5 )" }
    this.dragging = false

    this.initTooltip()
    this.registEvent() // 注册事件
  }

  public getPolyData(key?: string) {
    return this._dataObj[key || this._dataId]
  }

  private _createData(data: any): number[][] {
    const that = this
    return new Proxy(data, {
      set(target, key, value) {
        // 判断当前是否正在拖拽
        if (that.dragging) return true

        const oldValue = target[key]
        if (oldValue !== value) {
          target[key] = value
          that.updateSeries()
        }
        return true
      },
    })
  }

  public addPolygon(): [string, number[][]] {
    const allKeys = Object.keys(this._dataObj).map((strKey) => parseInt(strKey))

    const newKey = (Math.max(...allKeys) + 1).toString() // 生成一个最大的key

    const newData = this._createData([])

    this._dataObj[newKey] = newData
    // this._dataId = newKey

    return [newKey, newData]
  }

  public switchPoly(key) {
    if (!this._dataObj[key]) return
    this._dataId = key
  }

  public getPolygon(key?: string) {
    if (!key) key = Object.keys(this._dataObj)[0]

    if (this._dataObj[key]) return this._dataObj[key]

    return
  }

  public getPolyList() {
    return Object.keys(this._dataObj)
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

        this._dataObj[this._dataId].splice(this._dataObj[this._dataId].length - 1, 1)
      }
    })
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

  private showTooltip = (dataId: string, dataIndex: number) => {
    const seriesId = `line_${dataId}`

    if (this._dataId !== dataId) {
      console.log("切换id")
      this.switchPoly(dataId)
    }

    const series = this.chart.getOption().series as any[]
    const seriesIndex = series.findIndex((it) => it.id === seriesId)

    if (dataIndex === -1) return

    this.chart.dispatchAction({ type: "showTip", dataIndex, seriesIndex })
  }

  private hideTooltip = (dataId: string, dataIndex: number) => {
    const seriesId = `line_${dataId}`

    const series = this.chart.getOption().series as any[]
    const seriesIndex = series.findIndex((it) => it.id === seriesId)

    if (dataIndex === -1) return
    this.chart.dispatchAction({ type: "hideTip", seriesIndex, dataIndex })
  }

  private updateSeries() {
    if (this.dragging) return

    const series: echarts.SeriesOption[] = []
    const key = this._dataId

    const color = this.config.rectFillColor
    const data = this._dataObj[key]

    series.push({
      id: `line_${key}`,
      type: "line",
      name: `line_${key}`,
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

    this.chart.setOption({ series })
    this.renderDragPoints() // 绘制拖动点（注册拖动事件）
  }

  private renderDragPoints() {
    const that = this

    setTimeout(() => {
      // 判断当前是否正在拖拽
      if (that.dragging) return
      that.dragging = true

      // Add shadow circles (which is not visible) to enable drag.
      // 视图绘制完成后再绘制拖拽点
      if (that._dataObj[that._dataId].length === 0) return

      const id = that._dataId

      const graphic = that._dataObj[that._dataId].map((item, idx) => ({
        id: `drag_point_${that._dataId}_${idx}`,
        type: "circle",
        position: that.chart.convertToPixel("grid", item),
        shape: {
          cx: 0,
          cy: 0,
          r: that.config.symbolSize / 2,
        },
        invisible: true,
        draggable: true,

        ondrag: (event) => that.onPointDragging(id, idx, [event.offsetX, event.offsetY]),
        onmousemove: () => that.showTooltip(id, idx),
        onmouseout: () => that.hideTooltip(id, idx),

        z: 100,
      }))

      this.chart.setOption({ graphic })
      that.dragging = false
    }, 50)
  }

  private onPointDragging(dataId, dataIndex: number, pos: [number, number]) {
    if (this.dragging) return

    const newPos = this.chart.convertFromPixel("grid", pos)
    const data = this._dataObj[dataId]
    const _isPointEqual = isPointEqual(data[0], data[data.length - 1])

    if ((dataIndex == 0 || dataIndex == data.length - 1) && _isPointEqual) {
      data[0] = newPos
      data[data.length - 1] = newPos
    } else {
      data[dataIndex] = newPos
    }
  }

  private onPointClick(params: { offsetX: number; offsetY: number }) {
    const { offsetX, offsetY } = params
    const data = this._dataObj[this._dataId]
    const pointInPixel = [offsetX, offsetY]
    const pointInGrid = this.chart.convertFromPixel("grid", pointInPixel)

    // 检查新点是否在图表区域内
    if (!this.chart.containPixel("grid", pointInPixel)) return

    // 检查新点附近是否已有点
    const existingPoints = data.map((item) => this.chart.convertToPixel("grid", item))

    // 判断是否在现有点附近，如果是则获取该下标
    const dataNearIndex = existingPoints.findIndex((points) =>
      isNearExistingPoint(pointInPixel, points, this.config.symbolSize),
    )

    const isClosed = isClosedPath(data)
    const isLastPoint = dataNearIndex === data.length - 1 && data.length > 0

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

    if (isLastPoint && !isClosed) {
      data.pop()
    }
  }
}
