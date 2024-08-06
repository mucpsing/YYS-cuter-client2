/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-08-06 10:57:10
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-08-06 11:24:23
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\body\setp3\echartGeoJson.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import * as echarts from "echarts"
import { debounce } from "lodash"

/**
 * @description: 对多边形的折点进行稀释，减少折点数量
 * @param {T} arr
 * @return {*}
 */
export function getOddIndexedElements<T>(arr: T[]): T[] {
  // 创建一个空数组来存储结果
  let result = []

  // 遍历原数组
  for (let i = 0; i < arr.length; i++) {
    if (i == 0 || i == arr.length - 1) {
      result.push(arr[i])
    } else if (i % 2 !== 0) {
      // 如果是奇数下标，则将当前元素添加到结果数组中
      result.push(arr[i])
    }
  }

  // 返回结果数组
  return result
}

class ChartGeoJson {
  protected el: HTMLElement
  protected chart: echarts.ECharts
  readonly DEFAULT_RENDER_CONFIG = {
    title: "图片标题",
    max_len: 200,
    range: [],
  }

  public centerCoords = [] as number[]
  public drawPolygonCount = 0
  public drawRectCount = 0
  public rectBounds = [] as number[]
  public isDraw = false

  constructor(el: HTMLElement, config: any) {
    this.el = el
    this.chart = echarts.init(this.el, null, config)
  }

  public render(geojson: any, renderConfig: any) {
    if (!geojson) return console.warn("have no geojsonData")

    if (!this.chart) return console.warn("echarts not init")

    const config = Object.assign(this.DEFAULT_RENDER_CONFIG, renderConfig)

    // 对折现的折点进行稀释
    let polygon = getOddIndexedElements<number>(geojson.features[0].geometry.coordinates[0])

    while (polygon.length > config.max_len) polygon = getOddIndexedElements(polygon)

    // xy坐标轴的余量
    const axisOffset = 0.05
    const bounds = {
      maxx: Math.max(...polygon.map((item) => item[0])),
      minx: Math.min(...polygon.map((item) => item[0])),
      maxy: Math.max(...polygon.map((item) => item[1])),
      miny: Math.min(...polygon.map((item) => item[1])),
    }
    const shap = {
      w: bounds.maxx - bounds.minx,
      h: bounds.maxy - bounds.miny,
    }

    // 计算中心点
    this.centerCoords = [
      bounds.minx + (bounds.maxx - bounds.minx) / 2,
      bounds.miny + (bounds.maxy - bounds.miny) / 2,
    ]

    const option = {
      xAxis: {
        show: false,
        min: bounds.minx - shap.w * axisOffset,
        max: bounds.maxx + shap.w * axisOffset,
        type: "value",
        axisLine: { onZero: false },
      },
      yAxis: {
        show: false,
        min: bounds.miny - shap.h * axisOffset,
        max: bounds.maxy + shap.h * axisOffset,
        type: "value",
        axisLine: { onZero: false },
      },

      tooltip: {
        triggerOn: "none",
        formatter: function (params) {
          return "X: " + params.data[0].toFixed(2) + "<br>Y: " + params.data[1].toFixed(2)
        },
      },

      grid: {
        show: false, // 所有边距统一设置

        left: "5%",
        right: "5%",
        top: "5%",
        bottom: "5%",
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

      series: [
        {
          id: "polygon_base",
          type: "line",
          data: polygon,
          Symbol: false,
          symbolSize: 0,
        },
      ],
    }

    this.chart.setOption(option)
    this.chart.on("finished", () => {
      this.drawPolygonCount++
    })
  }

  public drawRect(w: number = 297 / 2, h: number = 210 / 2, x?: number, y?: number) {
    if (!this.chart) return console.log("this.chart is null")

    // 中心坐标在上一步绘制折线后已经提前生成
    let position
    if (x && y) {
      position = [x, y]
    } else {
      const centerXY = this.chart.convertToPixel({ seriesId: "polygon_base" }, [
        ...this.centerCoords,
      ])

      position = [centerXY[0] - w / 2, centerXY[1] - h / 2]
    }

    this.recordBounds([position[0], position[1], w, h])

    const graphic = [
      {
        id: "sel_rect",
        z: 10,
        type: "rect",
        draggable: true,
        position,

        shape: {
          x: 0,
          y: 0,
          width: w,
          height: h,
        },
        style: {
          fill: "transparent", // 设置为透明填充
          stroke: "#ff0000", // 设置边框颜色为红色
          lineWidth: 2, // 设置边框宽度为2
        },

        onmouseup: (e) => {
          this.recordBounds([e.target.x, e.target.y, e.target.shape.width, e.target.shape.height])
        },
      },
    ]

    this.chart.setOption({ graphic })
    this.drawRectCount++
    this.isDraw = true
  }

  public recordBounds(position: number[]) {
    this.rectBounds = position
  }

  public clean() {
    if (this.chart) this.chart.dispose()
  }
}
