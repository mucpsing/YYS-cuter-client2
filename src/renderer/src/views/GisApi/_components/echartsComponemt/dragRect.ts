/*
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2024-08-13 21:13:19
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2024-08-13 22:30:52
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\GisApi\_components\echartsComponemt\dragRect.ts
 * @Description: 使用echarts创建一个支持点击新建点，可以拖拽各个点的多边形，支持闭合
 */
import * as echarts from "echarts"
import type { ECharts, SetOptionOpts, EChartsOption } from "echarts/types/dist/echarts"

export class ChartDragLine {
  private chart: ECharts
  private option: EChartsOption
  private dataId: keyof typeof this.dataObj
  private dataObj: { [dataId: string]: number[][] }
  private config: { symbolSize: number }

  constructor(inputTar: ECharts | HTMLElement | String) {
    if (this._isEchartsInstance(inputTar)) {
      this.chart = inputTar as ECharts
    } else if (inputTar instanceof HTMLElement) {
      this.chart = echarts.init(inputTar) as ECharts
    } else if (typeof inputTar === "string") {
      this.chart = echarts.init(document.querySelector(inputTar) as HTMLElement) as ECharts
    } else {
      throw new Error("inputTar is not a valid echarts instance")
    }

    this.option = {}
    this.dataObj = { "0": [] }
    this.dataId = "0"
    this.config = { symbolSize: 20 }

    this.regedistEvent() // 注册点击事件
    this.regeistDraggableEvent() // 绘制拖动点（注册拖动事件）

    this.chart.on("dataZoom", this.updatePosition)

    // this.chart.setOption(this.option)
  }

  private createSeries() {
    const series: any[] = []
    Object.keys(this.dataObj).forEach((key) => {
      series.push({
        id: `line_${key}`,
        type: "line",
        smooth: false,
        symbolSize: this.config.symbolSize,
        data: this.dataObj[key],
      })

      series.push({
        id: `custom_polygon_${key}`,
        type: "custom",
        renderItem: function (params, api) {
          if (params.context.rendered) return
          params.context.rendered = true
          let points = []
          for (let i = 0; i < data.length; i++) {
            points.push(api.coord(data[i]))
          }
          // let color = api.visual("color")
          let color = "rgba(255, 205, 205, .5 )"
          return {
            type: "polygon",
            transition: ["shape"],
            shape: {
              points: points,
            },
            style: api.style({
              fill: color,
              stroke: echarts.color.lift(color, 0.1),
            }),
          }
        },
        clip: true,
        data: this.dataObj[key],
      })
    })

    return series
  }

  private getOption() {
    const data = this.dataObj

    this.option = {
      tooltip: {
        triggerOn: "none",
        formatter: function (params) {
          return "X: " + params.data[0].toFixed(2) + "<br>Y: " + params.data[1].toFixed(2)
        },
      },

      xAxis: {
        min: -100,
        max: 70,
        type: "value",
        axisLine: { onZero: false },
      },

      yAxis: {
        min: -30,
        max: 60,
        type: "value",
        axisLine: { onZero: false },
      },

      series: this.createSeries(),
    }
  }

  private regedistEvent() {
    // 点击事件
    this.chart.getZr().on("click", this.onPointClick)

    // 窗口大小变化事件
    window.addEventListener("resize", this.updatePosition)

    // 键盘事件
    window.addEventListener("keydown", (event) => {
      const data = this.dataObj[this.dataId]

      // 检查是否同时按下了Ctrl键和Z键
      if (event.ctrlKey && event.key === "z") {
        // 阻止默认行为（可选，取决于你的需求）
        // event.preventDefault();
        data.splice(data.length - 1, 1)
        this.updatePosition()
      }
    })
  }

  private regeistDraggableEvent() {
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
          ondrag: (event) => {
            this.onPointDragging(dataIndex, [event.offsetX, event.offsetY])
          },
          onmousemove: () => {
            this.showTooltip(dataIndex)
          },
          onmouseout: () => {
            this.hideTooltip(dataIndex)
          },
          z: 100,
        }
      })

      this.chart.setOption({ graphic })
    }, 100)
  }
  private showTooltip = (dataIndex: number) => {
    this.chart.dispatchAction({
      type: "showTip",
      seriesIndex: 0,
      dataIndex: dataIndex,
    })
  }

  private hideTooltip = (dataIndex: number) => {
    this.chart.dispatchAction({
      type: "hideTip",
      seriesIndex: 0,
      dataIndex: dataIndex,
    })
  }

  private onPointDragging(dataIndex: number, pos: [number, number]) {
    const data = this.dataObj[this.dataId]
    const myChart = this.chart

    data[dataIndex] = myChart.convertFromPixel("grid", pos)
    myChart.setOption({ series: [{ id: "a", data: data }] })
  }

  private updatePosition() {
    const data = this.dataObj[this.dataId]
    this.chart.setOption({
      graphic: data.map((item, _dataIndex) => {
        return {
          position: this.chart.convertToPixel("grid", item),
        }
      }),
      series: [{ id: "a", data }],
    })
  }

  private onPointClick(params: any) {
    const data = this.dataObj[this.dataId]
    const myChart = this.chart

    const pointInPixel = [params.offsetX, params.offsetY]
    const pointInGrid = myChart.convertFromPixel("grid", pointInPixel)

    // 检查新点是否在图表区域内
    if (!myChart.containPixel("grid", pointInPixel)) return

    // 检查新点附近是否已有点
    const existingPoints = data.map((item) => myChart.convertToPixel("grid", item))
    const pointDistanceSquared = (p1, p2) => (p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2

    // BUG 当点击的位置是最后一个时，应该不执行任何动作
    let dataNearIndex: number = -1
    const isPointNearExisting = existingPoints.some((existingPoint, idx) => {
      const distanceSquared = pointDistanceSquared(pointInPixel, existingPoint)
      // 获取临近点的下标
      // symbolSize 是半径，所以需要比较距离的平方和 symbolSize^2
      if (distanceSquared <= (this.config.symbolSize / 2) ** 2) {
        dataNearIndex = idx
        return true
      }
      return false
    })

    // 没有找到临近的点
    if (~dataNearIndex) return

    // 没有临近点，则直接添加
    if (!isPointNearExisting) {
      data.push(pointInGrid)
    } else {
      if (dataNearIndex == data.length - 1) {
        data.splice(dataNearIndex, 1)
      } else if (dataNearIndex == 0) {
        // 两种情况，当已经是闭合路径时，则表示需要删除
        if (data[0] == data[data.length - 1]) {
          data.splice(data.length - 1, 1)
        } else {
          // 否则，则表示需要闭合路径
          data.push(data[0])
        }
      } else {
        data.push(data[dataNearIndex])
      }
    }

    myChart.setOption({ series: [{ id: "a", data: data }] })

    this.regeistDraggableEvent() // 绘制拖动点（注册拖动事件）
  }

  private _isEchartsInstance(tar: any): boolean {
    return typeof tar.setOption === "function"
  }
}
