/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-08-06 10:57:10
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-08-07 16:41:03
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\body\setp3\echartGeoJson.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import * as echarts from "echarts"
import interact from "interactjs"
import { throttle } from "lodash"

/**
 * 保留数组的第一个元素、最后一个元素以及所有奇数索引（从0开始计数）的元素。
 * @param {T[]} arr 输入的数组。
 * @return {T[]} 包含指定元素的数组。
 */
export function retainFirstLastAndOddIndexed<T>(arr: T[]): T[] {
  if (arr.length === 0) return []

  let result = [arr[0]] // 始终包含第一个元素

  // 遍历原数组（从索引1开始，因为第一个元素已经添加到结果中）
  for (let i = 1; i < arr.length - 1; i++) {
    if (i % 2 !== 0) {
      // 如果是奇数索引，则将当前元素添加到结果数组中
      result.push(arr[i])
    }
  }

  // 添加最后一个元素
  result.push(arr[arr.length - 1])

  return result
}

export interface DrawPolygonConfig {
  title?: string
  max_len?: number
  range?: number[]
}

class ChartGeoJson {
  protected el: HTMLElement

  readonly DEFAULT_RENDER_CONFIG = {
    title: "图片标题",
    max_len: 200,
    range: [],
  }

  public centerCoords = [] as number[]
  public drawPolygonCount = 0
  public drawRectCount = 0
  public rectBounds = [] as number[]
  public rectCoords = [] as number[]

  public rectPoints = [] as number[]
  public chart: echarts.ECharts
  private interact: any

  public events: {
    onRectDraw?: (this: ChartGeoJson) => void
    onRectMove?: (this: ChartGeoJson) => void
    onRectResize?: (this: ChartGeoJson) => void
    onDataZoom?: (this: ChartGeoJson) => void
  } = {}

  constructor(el: HTMLElement, config: any) {
    this.el = el
    // const width = this.el.clientWidth
    // const height = this.el.clientHeight

    this.chart = echarts.init(this.el, null, config)

    if (config.events) {
      Object.assign(this.events, config.events)
    }

    this.chartEventRegister()
  }

  private chartEventRegister() {
    const that = this
    this.chart
      .on("dataZoom", () => {
        console.log("dataZoom")
        that.emit("onDataZoom")
      })
      .on("click", function (params) {
        console.log(params)
      })
  }

  public on(event: keyof typeof this.events, callback: (...any: any[]) => any) {
    if (!this.events[event]) {
      this.events[event] = throttle(callback, 100)
    }

    return this
  }

  private emit(event: keyof typeof this.events): void {
    if (this.events && this.events[event]) {
      this.events[event](this)
    }
  }

  public interactInit(element: HTMLElement, outerId: string = "#interactInitId") {
    if (element.parentElement) {
      element.parentElement.id = "interactInitId"
    } else {
      console.error("需要指定一个parentID")
    }
    const that: ChartGeoJson = this

    that.interact = interact(element)
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        // modifiers: [
        //   // interact.modifiers.restrictEdges({ outer: outerId }),
        //   interact.modifiers.restrictSize({ min: { width: 10, height: 10 } }),
        // ],
        listeners: {
          move: (event) => {
            const target = event.target
            let x = parseFloat(target.getAttribute("data-x")) || 0
            let y = parseFloat(target.getAttribute("data-y")) || 0

            target.style.width = event.rect.width + "px"
            target.style.height = event.rect.height + "px"

            x += event.deltaRect.left
            y += event.deltaRect.top

            target.style.transform = "translate(" + x + "px," + y + "px)"
            target.setAttribute("data-x", x)
            target.setAttribute("data-y", y)

            const bounds = [x, y, event.rect.width, event.rect.height].map((item) =>
              Math.trunc(item),
            )
            that.recordBounds(bounds)
            that.emit("onRectResize")
          },
        },
      })
      .draggable({
        listeners: {
          move: (event) => {
            const target = event.target
            // keep the dragged position in the data-x/data-y attributes
            const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx
            const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy

            // translate the element
            target.style.transform = "translate(" + x + "px, " + y + "px)"

            // update the posiion attributes
            target.setAttribute("data-x", x)
            target.setAttribute("data-y", y)

            const bounds = [x, y, event.rect.width, event.rect.height].map((item) =>
              Math.trunc(item),
            )
            that.recordBounds(bounds)
            that.emit("onRectMove")
          },
        },
        inertia: true,
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: outerId,
            endOnly: true,
          }),
        ],
      })

    return that
  }

  public drawPolygon(geojson: any, config: DrawPolygonConfig) {
    if (!geojson) return console.warn("have no geojsonData")
    if (!this.chart) return console.warn("echarts not init")

    config = Object.assign(this.DEFAULT_RENDER_CONFIG, config)

    // 对折现的折点进行稀释
    let polygon = retainFirstLastAndOddIndexed<number>(geojson.features[0].geometry.coordinates[0])

    while (polygon.length > config.max_len) polygon = retainFirstLastAndOddIndexed(polygon)

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

    const renderW = this.el.clientWidth
    const renderH = (renderW * shap.h) / shap.w
    console.log({ width: renderW, height: renderH })
    // this.chart.resize({ width: renderW, height: renderH })
    // this.chart.resize({ width: realW, height: realH })

    // console.log(maxW, maxH)

    const offset = Math.max(shap.w, shap.h)
    console.log({ offset })
    const xAxisMin = bounds.minx + shap.w / 2 - offset / 2
    const xAxisMax = bounds.maxx - shap.w / 2 + offset / 2

    const yAxisMin = bounds.miny + shap.h / 2 - offset / 2
    const yAxisMax = bounds.maxy - shap.h / 2 + offset / 2
    console.log({ xAxisMin, xAxisMax, yAxisMin, yAxisMax })
    console.log(xAxisMax - xAxisMin)
    console.log(yAxisMax - yAxisMin)

    const option = {
      xAxis: {
        show: false,
        min: xAxisMin,
        max: xAxisMax,
        // min: bounds.minx - shap.w * axisOffset,
        // max: bounds.maxx + shap.w * axisOffset,
        type: "value",
        axisLine: { onZero: false },
      },
      yAxis: {
        show: false,
        // min: bounds.miny - shap.h * axisOffset,
        // max: bounds.maxy + shap.h * axisOffset,
        min: yAxisMin,
        max: yAxisMax,
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
        left: "0%",
        right: "0%",
        top: "0%",
        bottom: "0%",
        // left: "5%",
        // right: "5%",
        // top: "5%",
        // bottom: "5%",
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
      this.emit("onRectDraw")
    })
  }

  //   public drawRect(w: number = 297 / 2, h: number = 210 / 2, x?: number, y?: number) {
  //     if (!this.chart) return console.log("this.chart is null")

  //     // 中心坐标在上一步绘制折线后已经提前生成
  //     let position
  //     if (x && y) {
  //       position = [x, y]
  //     } else {
  //       const centerXY = this.chart.convertToPixel({ seriesId: "polygon_base" }, [
  //         ...this.centerCoords,
  //       ])

  //       position = [centerXY[0] - w / 2, centerXY[1] - h / 2]
  //     }

  //     this.recordBounds([position[0], position[1], w, h])

  //     const graphic = [
  //       {
  //         id: "sel_rect",
  //         z: 10,
  //         type: "rect",
  //         draggable: true,
  //         position,

  //         shape: {
  //           x: 0,
  //           y: 0,
  //           width: w,
  //           height: h,
  //         },
  //         style: {
  //           fill: "transparent", // 设置为透明填充
  //           stroke: "#ff0000", // 设置边框颜色为红色
  //           lineWidth: 2, // 设置边框宽度为2
  //         },

  //         onmouseup: (e) => {
  //           this.recordBounds([e.target.x, e.target.y, e.target.shape.width, e.target.shape.height])
  //         },
  //       },
  //     ]

  //     this.chart.setOption({ graphic })
  //     this.drawRectCount++
  //     this.isDraw = true
  //   }
  private _recordBounds = throttle((position: number[]) => {
    // console.log(position)
    if (!this.chart) return

    const startXY = [position[0], position[1]]
    const endXY = [position[0] + position[2], position[1] + position[3]]
    this.rectBounds = [...startXY, ...endXY]

    if (this.drawPolygonCount == 0) return
    const leftTopXY = this.chart.convertFromPixel({ seriesId: "polygon_base" }, startXY)
    const rightbottomXY = this.chart.convertFromPixel({ seriesId: "polygon_base" }, endXY)
    this.rectCoords = [...leftTopXY, ...rightbottomXY]
  }, 100)

  public cover2Coord(coords: number[]) {
    if (this.drawPolygonCount == 0) return coords

    return this.chart.convertFromPixel({ seriesId: "polygon_base" }, coords)
  }

  public recordBounds(position: number[]) {
    this._recordBounds(position)
  }

  public dispose() {
    if (this.chart) this.chart.dispose()
  }
}

export default ChartGeoJson
