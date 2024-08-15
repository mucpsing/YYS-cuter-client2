/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-08-06 10:57:10
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-08-15 11:04:13
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\body\setp3\echartGeoJson.ts
 * @Description: 根据geojson创建多边形的echart图例，使用interactjs添加一个可以拖拽的矩形框用来裁剪输出范围
 * @example:
 * myChart = new ChartGenJson(chartContainerRef.value, { renderer: "canvas" })
 * if (rectElementRef.value) {
      myChart
        .interactInit(rectElementRef.value)
        .on("onRectMove", (e) => emit("update:rect", e.rectCoords))
        .on("onRectResize", (e) => emit("update:rect", e.rectCoords))
      // .on("onDataZoom", (e) => emit("update:rect", e.rectCoords))
    }
 */
import * as echarts from "echarts"
import interact from "interactjs"
import { throttle } from "lodash"
import type { FeatureCollection } from "./geoJson"
import * as utils from "./utils"

export interface DrawPolygonConfig {
  title?: string
  max_len?: number
  axis_offset?: number
  range?: number[]
}

class ChartGeoJson {
  protected el: HTMLElement

  readonly DEFAULT_RENDER_CONFIG = {
    title: "图片标题",
    max_len: 200,
    range: [],
    axis_offset: 0.05,
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
    onPolygonDraw?: (this: ChartGeoJson) => void
    onRectMove?: (this: ChartGeoJson) => void
    onRectResize?: (this: ChartGeoJson) => void
    onDataZoom?: (this: ChartGeoJson) => void
  } = {}

  constructor(el: HTMLElement, config: any) {
    this.el = el
    this.chart = echarts.init(this.el, null, config)

    if (config.events) {
      Object.assign(this.events, config.events)
    }

    this.chartEventRegister()
  }

  private chartEventRegister() {
    this.chart
      .on("dataZoom", () => {
        this.emit("onDataZoom")
      })
      .on("finished", () => {
        // 如果未绘制一些数据会获取失败
        this.emit("onPolygonDraw")
      })
      .on("click", (params) => {
        console.log(params)
      })
      .on("mousedown", (params) => {
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

  public drawPolygon(geojson: FeatureCollection, config: DrawPolygonConfig) {
    if (!geojson) return console.warn("have no geojsonData")
    if (!this.chart) return console.warn("echarts not init")

    config = Object.assign(this.DEFAULT_RENDER_CONFIG, config)

    // 稀释多边形，防止卡顿
    // 根据config.max_len，保留第一个和最后一个点，并且每隔一个点保留一个点
    const polygonRaw = geojson.features[0].geometry.coordinates[0]
    const polygon = utils.diluteThePolygon(polygonRaw, config.max_len as number)

    // 计算边界
    const bounds = utils.calculateBounds(polygon)

    // 计算宽高
    const shape = utils.calculateCenterAndShape(bounds)

    // 记录中心坐标用于初始化
    this.centerCoords = [shape.centerX, shape.centerY]

    // 桔色成人xy坐标轴和余量
    const axis = utils.calculateAxisRange(bounds, shape)

    const option = {
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

      graphic: [
        {
          id: "test",
          type: "polygon",
          shape: {
            points: polygon,
          },
        },
      ],
    }

    this.chart.setOption(option)
    this.drawPolygonCount++
  }

  private _recordBounds = throttle((position: number[]) => {
    if (!this.chart) return

    const startXY = [position[0], position[1]]
    const endXY = [position[0] + position[2], position[1] + position[3]]
    this.rectBounds = [...startXY, ...endXY]

    if (this.drawPolygonCount == 0) return
    const leftTopXY = this.chart.convertFromPixel({ seriesId: "polygon_base" }, startXY)
    const rightbottomXY = this.chart.convertFromPixel({ seriesId: "polygon_base" }, endXY)
    this.rectCoords = [...leftTopXY, ...rightbottomXY]
  }, 100)

  /**
   * @description: 裁剪框坐标转换成图像上的投影坐标
   * @param {number} coords [x, y]
   */
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

  public resize() {
    this.chart.dispatchAction({
      type: "dataZoom",
      start: 0,
      end: 100,
    })
  }
}

export default ChartGeoJson
