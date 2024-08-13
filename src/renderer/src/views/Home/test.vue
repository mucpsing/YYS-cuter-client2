<template>
  <div class="" style="width: 800px; height: 600px">
    <div ref="testRef" class="w-full h-full"></div>
    <t-button @click="test">ttttt</t-button>
  </div>
</template>

<script setup lang="ts">
import * as echarts from "echarts"

const hasSetOption = (tar) => typeof tar.setOption === "function"

const testRef = ref()
const symbolSize = 20

let myChart
const data: [number, number][] = []

const poloyDataList: number[][] = []

function test() {
  // console.log(myChart instanceof echarts.ECharts)
  console.log(myChart instanceof HTMLElement)
  console.log(hasSetOption(myChart))
}
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
    if (distanceSquared <= (symbolSize / 2) ** 2) {
      dataNearIndex = idx
      return true
    }
    return false
  })

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

  draggable() // 重新添加拖拽功能（如果需要）
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
