/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-08-14 11:02:49
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-08-15 15:22:30
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\_components\echarts\index.ts
 * @Description:
 */
import * as echarts from "echarts"
import type { ECharts } from "echarts"
import * as utils from "./utils"

export default class ChartViewer {
  private chart: ECharts
  private polygonData: any[]
  private drawPolygonCount: number

  public centerCoords: [number, number]
  public config

  constructor(inputTarget: string | HTMLElement, polygenData: number[], config: any) {
    if (typeof inputTarget === "string") {
      const el = document.querySelector(inputTarget)

      if (!el) throw new Error("echart init error")

      this.chart = echarts.init(el as HTMLElement)
    } else if (inputTarget instanceof HTMLElement) {
      this.chart = echarts.init(inputTarget as HTMLElement)
    } else {
      throw new Error("echart init error")
    }

    this.polygonData = polygenData
    this.config = config
    this.drawPolygonCount = 0
    this.centerCoords = [0, 0]

    this.creageOption()
  }

  private creageOption() {
    // 稀释多边形，防止卡顿
    // 根据config.max_len，保留第一个和最后一个点，并且每隔一个点保留一个点
    const polygonRaw = this.polygonData.features[0].geometry.coordinates[0]

    // 计算边界
    const bounds = utils.calculateBounds(polygonRaw)
    // 计算宽高
    const shape = utils.calculateCenterAndShape(bounds)
    // xy坐标轴的余量
    const axis = utils.calculateAxisRange(bounds, shape)

    // 记录中心坐标用于初始化
    this.centerCoords = [shape.centerX, shape.centerY]

    const options = {
      xAxis: {
        show: false,
        min: axis.xAxisMin,
        max: axis.xAxisMax,
        type: "value",
        axisLine: { onZero: false },
      },
      yAxis: {
        show: false,
        min: axis.yAxisMin,
        max: axis.yAxisMax,
        type: "value",
        axisLine: { onZero: false },
      },

      dataZoom: [
        {
          type: "inside",
          xAxisIndex: 0,
          filterMode: "none",
        },
        {
          type: "inside",
          yAxisIndex: 0,
          filterMode: "none",
        },
      ],
    }

    this.chart.setOption(options)
  }

  public drawPolygon() {
    // 稀释多边形，防止卡顿
    // 根据config.max_len，保留第一个和最后一个点，并且每隔一个点保留一个点
    const polygonRaw = this.polygonData.features[0].geometry.coordinates[0]
    const polygon = utils.diluteThePolygon(polygonRaw, this.config.max_len)
    const series = [
      {
        id: "polygon_base",
        type: "line",
        data: polygon,
        Symbol: false,
        symbolSize: 0,
      },
    ]

    this.chart.setOption({ series })
    this.drawPolygonCount++
  }

  public dispose() {
    if (this.chart) this.chart.dispose()
  }

  public resize() {
    this.chart.dispatchAction({ type: "dataZoom", start: 0, end: 100 })
  }
}
