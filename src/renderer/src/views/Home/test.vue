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
    const graphic = data.map(function (item, dataIndex) {
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
    })

    myChart.setOption({ graphic })
  }, 100)
}

function updatePosition() {
  myChart.setOption({
    graphic: data.map(function (item, _dataIndex) {
      return {
        position: myChart.convertToPixel("grid", item),
      }
    }),
    series: [{ id: "a", data: data }],
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
        type: "custom",
        renderItem: function (params, api) {
          if (params.context.rendered) {
            return
          }
          params.context.rendered = true
          let points = []
          for (let i = 0; i < data.length; i++) {
            points.push(api.coord(data[i]))
          }
          let color = api.visual("color")
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
        data: data,
      },
    ],
  }

  draggable()

  myChart.on("dataZoom", updatePosition)
  myChart.setOption(option)
  myChart.getZr().on("click", onPointClick)

  window.addEventListener("resize", updatePosition)
  window.addEventListener("keydown", function (event) {
    // 检查是否同时按下了Ctrl键和Z键
    if (event.ctrlKey && event.key === "z") {
      // 阻止默认行为（可选，取决于你的需求）
      // event.preventDefault();
      data.splice(data.length - 1, 1)
      updatePosition()
    }
  })
})
</script>
