<template>
  <div class="" style="width: 800px; height: 600px">
    <div ref="testRef" class="w-full h-full"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from "echarts"
const testRef = ref()
const symbolSize = 20

let myChart
const data = [
  [40, -10],
  [-30, -5],
  [-76.5, 20],
  [-63.5, 40],
  [-22.1, 50],
]

const poloyDataList: number[][] = []

function draggable() {
  setTimeout(function () {
    // Add shadow circles (which is not visible) to enable drag.
    // 视图绘制完成后再绘制拖拽点
    myChart.setOption({
      graphic: data.map(function (item, dataIndex) {
        return {
          type: "circle",
          position: myChart.convertToPixel("grid", item),
          shape: {
            cx: 0,
            cy: 0,
            r: symbolSize / 2,
          },
          invisible: true,
          draggable: true,
          ondrag: function (event) {
            onPointDragging(dataIndex, [event.offsetX, event.offsetY])
          },
          onmousemove: function () {
            showTooltip(dataIndex)
          },
          onmouseout: function () {
            hideTooltip(dataIndex)
          },
          z: 100,
        }
      }),
    })
  }, 100)
}

function updatePosition() {
  myChart.setOption({
    graphic: data.map(function (item, _dataIndex) {
      return {
        position: myChart.convertToPixel("grid", item),
      }
    }),
  })
}

function showTooltip(dataIndex: number) {
  myChart.dispatchAction({
    type: "showTip",
    seriesIndex: 0,
    dataIndex: dataIndex,
  })
}
function hideTooltip(_dataIndex: number) {
  myChart.dispatchAction({ type: "hideTip" })
}

function onPointDragging(dataIndex: number, pos: [number, number]) {
  data[dataIndex] = myChart.convertFromPixel("grid", pos)
  // Update data
  myChart.setOption({
    series: [
      {
        id: "a",
        data: data,
      },
    ],
  })
}

function drawPolygon(poloyData: number[]) {
  // 绘制多边形
  poloyDataList.push(poloyData)

  const position = getPosition(poloyDataList)

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
        console.log("当前coords: ", [
          e.target.x,
          e.target.y,
          e.target.shape.width,
          e.target.shape.height,
        ])
      },
    },
  ]

  myChart.setOption({ graphic })
}

function onPointClick(params: any) {
  const pointInPixel = [params.offsetX, params.offsetY]
  const pointInGrid = myChart.convertFromPixel("grid", pointInPixel)

  // 检查新点是否在图表区域内
  if (myChart.containPixel("grid", pointInPixel)) {
    // 检查新点附近是否已有点
    const existingPoints = data.map((item) => myChart.convertToPixel("grid", item))
    const pointDistanceSquared = (p1, p2) => (p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2

    let isPointNearExisting
    existingPoints.some((existingPoint, idx) => {
      const distanceSquared = pointDistanceSquared(pointInPixel, existingPoint)
      // symbolSize 是半径，所以需要比较距离的平方和 symbolSize^2
      if (distanceSquared <= symbolSize ** 2) {
        isPointNearExisting = data[idx]
      }
      return distanceSquared <= (symbolSize / 2) ** 2
    })

    if (isPointNearExisting) {
      // 使用临近的点
      data.push(isPointNearExisting)

      // 绘制多边形
    } else {
      // 创建新点
      data.push(pointInGrid)
    }

    myChart.setOption({
      series: [
        {
          id: "a",
          data: data,
        },
      ],
    })
    draggable() // 重新添加拖拽功能（如果需要）
  }
}
onMounted(() => {
  myChart = echarts.init(testRef.value)

  const option = {
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

    series: [
      {
        id: "a",
        type: "line",
        smooth: false,
        symbolSize: symbolSize,
        data: data,
      },
      {
        id: "b",
        type: "area",
        data: data, // 闭合数据
        areaStyle: {},
        lineStyle: {
          opacity: 0, // 隐藏线条
        },
      },
    ],
  }

  draggable()

  myChart.on("dataZoom", updatePosition)
  myChart.setOption(option)
  myChart.getZr().on("click", onPointClick)

  window.addEventListener("resize", updatePosition)
})
</script>
