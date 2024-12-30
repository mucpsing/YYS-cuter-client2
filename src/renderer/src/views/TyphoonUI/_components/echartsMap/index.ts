import * as echarts from "echarts"
import { type Ref } from "vue"
import { type DataItem, data, baseGeoCoordMap } from "@Typhoon/data/cityData"

/**
 * @description:  拦截 Canvas 创建，修复频繁读取数据警告
 */
export function fixEchatrstImageDataWarning() {
  const originalGetContext = HTMLCanvasElement.prototype.getContext

  // 使用类型断言绕过 TypeScript 类型检查
  ;(HTMLCanvasElement.prototype.getContext as any) = function (
    this: HTMLCanvasElement,
    type: "2d" | "webgl" | "webgl2" | "bitmaprenderer" | string,
    options?: CanvasRenderingContext2DSettings | WebGLContextAttributes | any,
  ): RenderingContext | null {
    if (type === "2d") {
      options = options || {}
      if (typeof options === "object") {
        ;(options as CanvasRenderingContext2DSettings).willReadFrequently = true
      }
    }
    return originalGetContext.call(this, type, options)
  }
}

export const convertData = function (data: DataItem[]) {
  let res: any[] = []
  for (let i = 0; i < data.length; i++) {
    const geoCoord = baseGeoCoordMap[data[i].name]
    if (geoCoord) {
      res.push({
        name: data[i].name,
        value: geoCoord.concat(data[i].value),
      })
    }
  }

  console.log({ res })
  return res
}

export async function initEcharts2d(
  echartsElementIDorRef: HTMLElement | Ref<HTMLElement> | string,
) {
  let target
  if (echartsElementIDorRef instanceof HTMLElement) {
    target = echartsElementIDorRef
  } else if (typeof echartsElementIDorRef === "string") {
    target = document.getElementById(echartsElementIDorRef)
  } else if (typeof echartsElementIDorRef === "object") {
    target = echartsElementIDorRef.value
  } else {
    console.warn("仅支持HTMLElement|Ref<HTMLElement>|string类型")
  }

  console.log({ target })
  fixEchatrstImageDataWarning()

  const myChart = echarts.init(target, "echarts-2d-map", {
    renderer: "canvas", // 确保使用 Canvas 渲染器
    devicePixelRatio: window.devicePixelRatio, // 解决eacharts
  })

  function renderItem(params, api) {
    var coords = [
      [116.7, 39.53],
      [103.73, 36.03],
      [112.91, 27.87],
      [120.65, 28.01],
      [119.57, 39.95],
    ]
    var points = []
    for (var i = 0; i < coords.length; i++) {
      points.push(api.coord(coords[i]))
    }

    var color = api.visual("color")

    console.log({ coords, points, color })
    return {
      type: "polygon",
      shape: {
        points: echarts.graphic.clipPointsByRect(points, {
          x: params.coordSys.x,
          y: params.coordSys.y,
          width: params.coordSys.width,
          height: params.coordSys.height,
        }),
      },
      style: api.style({
        fill: color,
        stroke: echarts.color.lift(color),
      }),
    }
  }

  myChart.setOption({
    animationDuration: 6000,
    // backgroundColor: "transparent",
    title: {
      text: "台风信息展示平台 - 高德地图API",
      subtext: "Data From [www.typhoon.org.cn]",
      sublink: "https://tcdata.typhoon.org.cn/zjljsjj.html",
      left: "left",
      z: 10,
    },
    tooltip: {
      trigger: "item",
    },
    amap: {
      // 高德地图中心经纬度
      center: [116.397428, 39.90923],
      // 高德地图缩放
      zoom: 4.8,
      // 启用resize
      resizeEnable: false,
      // 移动过程中实时渲染 默认为true 如数据量较大 建议置为false
      renderOnMoving: false,
      // 高德的地图样式需要使用id进行设置
      // https://lbs.amap.com/api/javascript-api-v2/guide/map/map-style/
      mapStyle: "amap://styles/fresh",
      // viewMode: '3D',
      // pitch: 60,
      echartsLayerInteractive: true,
      largeMode: false,
      returnMapCameraState: true,
    },
    series: [
      // {
      //   id: "lines_test",
      //   type: "lines",
      //   coordinateSystem: "amap",
      //   polyline: true,
      //   effect: {
      //     show: true,
      //     trailLength: 0.7,
      //     color: "blue",
      //     symbol: "circle",
      //     symbolSize: 5,
      //   },
      //   lineStyle: {
      //     color: "blue",
      //     width: 2,
      //     opacity: 0.8,
      //   },
      //   data: [],
      // },
      // {
      //   id: "pm2.5",
      //   name: "pm2.5",
      //   type: "scatter",
      //   coordinateSystem: "amap",
      //   data: [],
      //   symbolSize: function (val) {
      //     return val[2] / 10
      //   },
      //   encode: { value: 2 },
      //   label: {
      //     formatter: "{b}",
      //     position: "right",
      //     show: false,
      //   },
      //   emphasis: { label: { show: true } },
      // },
      // {
      //   name: "Top 5",
      //   type: "effectScatter",
      //   coordinateSystem: "amap",
      //   data: convertData(
      //     data
      //       .sort(function (a, b) {
      //         return b.value - a.value
      //       })
      //       .slice(0, 6),
      //   ),
      //   symbolSize: function (val) {
      //     return val[2] / 10
      //   },
      //   encode: {
      //     value: 2,
      //   },
      //   showEffectOn: "render",
      //   rippleEffect: {
      //     brushType: "stroke",
      //   },
      //   label: {
      //     formatter: "{b}",
      //     position: "right",
      //     show: true,
      //   },
      //   itemStyle: {
      //     shadowBlur: 10,
      //     shadowColor: "#333",
      //   },
      //   emphasis: {
      //     scale: true,
      //   },
      //   zlevel: 1,
      //   z: 2,
      // },
    ],
  })

  return myChart
}
