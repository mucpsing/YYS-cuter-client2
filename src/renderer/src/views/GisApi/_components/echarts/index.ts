/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-08-14 11:02:49
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-08-14 17:19:20
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\_components\echarts\index.ts
 * @Description:
 */
import * as echarts from "echarts"
import type { ECharts, EChartsOption } from "echarts"
import {} from "./utils"

export default class ChartViewer {
  private chart: ECharts
  private option: EChartsOption
  private config

  constructor(inputTarget: string | HTMLElement, polygenData: number[], config: any) {
    if (typeof inputTarget === "string") {
      const el = document.querySelector(inputTarget)
      if (el) this.chart = echarts.init(el as HTMLElement)
    } else if (inputTarget instanceof HTMLElement) {
      this.chart = echarts.init(inputTarget as HTMLElement)
    } else {
      throw new Error("echart init error")
    }

    this.creageOption(polygenData)
  }

  private creageOption(geojsonData: any[]) {
    // 稀释多边形，防止卡顿
    // 根据config.max_len，保留第一个和最后一个点，并且每隔一个点保留一个点
    const polygonRaw = geojsonData.features[0].geometry.coordinates[0]
    const polygon = this.diluteThePolygon(polygonRaw, this.config.max_len)

    // 计算边界
    const bounds = this.calculateBounds(polygon)
    // 计算宽高
    const shape = this.calculateCenterAndShape(bounds)
    // xy坐标轴的余量
    const axis = this.calculateAxisRange(bounds, shape)

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
    }
    this.chart.setOption(options)
  }
}
