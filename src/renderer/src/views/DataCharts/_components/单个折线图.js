// See https://github.com/ecomfe/echarts-stat
const rawData = {
  mainTitle: "上横站",
  subTitle: "实测单沙过程对比图",
  startTime: "2020-06-16 14:00:00",
  axis: { y: { name: "水\n位\n(m)", min: 3, max: -1 } },
  range: 0.01,
  data: [
    0.57, 0.45, 0.45, 0.62, 0.91, 1.14, 1.18, 1.07, 0.92, 0.76, 0.63, 0.49, 0.34, 0.25, 0.25, 0.52,
    0.92, 1.3, 1.53, 1.57, 1.43, 1.28, 1.09, 0.88, 0.67, 0.49, 0.34, 0.3, 0.51, 0.84, 1.06, 1.11,
    1.03, 0.87, 0.76, 0.62, 0.49, 0.37, 0.33, 0.42, 0.78, 1.25, 1.56, 1.7, 1.59, 1.38, 1.19, 0.96,
    0.71, 0.49, 0.29, 0.15, 0.09, 0.3, 0.67, 0.98, 1.08, 1.02, 0.91, 0.77, 0.61, 0.46, 0.34, 0.32,
    0.55, 1.04, 1.51, 1.79, 1.81, 1.59, 1.32, 1.06, 0.8, 0.55, 0.32, 0.11, -0.04, -0.07, 0.2, 0.62,
    0.95, 1.05, 0.98, 0.87, 0.71, 0.55, 0.41, 0.33, 0.41, 0.79, 1.3, 1.71, 1.9, 1.82, 1.55, 1.29,
    1.03, 0.74, 0.47, 0.22, 0.02, -0.12, -0.08, 0.37, 0.77, 1.03, 1.11, 1.03, 0.92, 0.76, 0.6, 0.47,
    0.42, 0.64, 1.16, 1.66, 2, 2.07, 1.85, 1.59, 1.3, 1, 0.66, 0.39, 0.13, -0.07, -0.18, 0.04, 0.5,
    0.86, 1.04, 1.07, 1, 0.88, 0.73, 0.6, 0.5, 0.55, 0.95, 1.47, 1.9, 2.12, 2.04, 1.79, 1.51, 1.2,
    0.87, 0.56, 0.28, 0.03, -0.14, -0.22, 0.09, 0.57, 0.94, 1.08, 1, 0.91, 0.8, 0.66, 0.55, 0.51,
    0.65, 1.15, 1.68, 2.06, 2.14, 1.97, 1.72, 1.42, 1.08, 0.75, 0.45, 0.17, -0.06, -0.22, -0.19,
    0.25, 0.7, 0.97, 1.08, 1.04, 0.93, 0.78, 0.63, 0.5, 0.46, 0.81, 1.36, 1.84, 2.13, 2.09, 1.84,
    1.55, 1.25, 0.95, 0.65, 0.36, 0.09, -0.12, -0.26, -0.15, 0.37, 0.79, 1.01, 1.04, 1.01, 0.9,
    0.74, 0.63, 0.52, 0.55, 0.95,
  ],
}
const mainTitle = rawData.mainTitle
const subTitle = rawData.subTitle
const data1 = rawData.data

function addRandomError(numbers, errorMargin, decimalPlaces = 3) {
  // 确保errorMargin是一个正数
  if (errorMargin < 0) {
    throw new Error("Error margin must be a non-negative number")
  }

  // 创建一个新数组来存储带有误差的数据
  const numbersWithError = []

  // 遍历原始数组
  for (let i = 0; i < numbers.length; i++) {
    // 生成一个介于-errorMargin和errorMargin之间的随机数
    const randomError = Math.random() * (2 * errorMargin) - errorMargin
    // 将随机误差加到原始数据上
    const newValue = numbers[i] + randomError

    const roundedValue = Number(newValue.toFixed(decimalPlaces))

    // 将带有误差的新值添加到新数组中
    numbersWithError.push(roundedValue)
  }

  // 返回带有误差的新数组
  return numbersWithError
}

function generateHourlyTimestamps(startDateStr, hours = 24) {
  // 直接使用提供的字符串创建Date对象，这里假设startDateStr已经是本地时间
  const startDate = new Date(startDateStr)
  if (isNaN(startDate.getTime())) {
    throw new Error("Invalid date string")
  }

  const timestamps = []

  // 循环遍历每一个小时
  for (let i = 0; i < hours; i++) {
    // 复制startDate以避免修改原始对象（虽然在这个特定函数中不是必需的，但通常是一个好习惯）
    const currentDate = new Date(startDate)
    // 设置当前小时（注意：这里直接加小时数，因为startDate已经是本地时间了）
    currentDate.setHours(startDate.getHours() + i, 0, 0, 0)
    // 如果超过23小时，则自动调整到下一天（这通常由setHours方法处理）
    timestamps.push(currentDate.getTime())
  }

  return timestamps
}

const data2 = addRandomError(data1, rawData.range)
const timeS = generateHourlyTimestamps(rawData.startTime, data1.length)

echarts.registerTransform(ecStat.transform.regression)

option = {
  backgroundColor: "#fff",

  graphic: [
    {
      type: "text",
      left: "4%", // 相对于容器居中
      bottom: "3%", // 你可以根据需求调整这个值
      style: {
        text: `${new Date(timeS[0]).toLocaleString()}`,
        textAlign: "right", // 文本水平居中对齐
        fill: "#333", // 文本颜色
        fontSize: 14, // 字体大小
        // 如果需要，可以进一步设置 textBaseline 等属性来调整文本位置
      },
    },
    {
      type: "text",
      right: "4%", // 相对于容器居中
      bottom: "3%", // 你可以根据需求调整这个值
      style: {
        text: `${new Date(timeS[timeS.length - 1]).toLocaleString()}`,
        textAlign: "right", // 文本水平居中对齐
        fill: "#333", // 文本颜色
        fontSize: 14, // 字体大小
        // 如果需要，可以进一步设置 textBaseline 等属性来调整文本位置
      },
    },
  ],

  legend: {
    show: true,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderRadius: 5,
    orient: "vertical", // 图例垂直排列
    x: "80%", // 图例水平位置在右侧
    y: "12%", // 图例垂直位置在顶部附近，也可以是一个数值（如'20%'）来调整具体位置
    padding: 14, // 图例内边距，这里假设我们想要图例与右侧和顶部保持一定距离
    data: [
      {
        name: "实测数据",
        icon: "rect",
        itemStyle: {
          itemHeight: 10,
          itemWidth: 10,
        },
      },
      "模拟数据",
    ], // 图例项数据
  },

  dataset: [
    {
      source: {
        timeS: timeS,
        实测: data1,
      },
    },
    {
      source: {
        timeS: timeS,
        模拟: data2,
      },
    },
  ],
  title: {
    text: rawData.mainTitle,
    // subtext: subTitle,
    sublink: "https://github.com/ecomfe/echarts-stat",
    left: "center",
    bottom: "0%",
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
    },
  },
  xAxis: {
    type: "time",
    show: true,
    axisLine: {
      show: 1,
      onZero: 0,
      symbol: ["none", "none"], // 箭头
    },
    axisTick: {
      show: 1,
      inside: 1,
      interval: 0,
      length: 5,
    },
    axisLabel: {
      show: 1,
      formatter: "{dd}日",
    },
    splitLine: {
      show: 1,
      lineStyle: {
        type: "dashed",
      },
    },
  },
  yAxis: {
    name: rawData.axis.y.name,
    nameLocation: "center",
    nameRotate: 0,
    nameGap: 50,
    nameTextStyle: {
      fontSize: 14,
      align: "center",
      borderDashOffset: 200,
      verticalAlign: "middle",
    },
    min: rawData.axis.y.min,
    max: rawData.axis.y.max,
    inverse: false,
    axisLine: {
      show: 1,
      onZero: 1,
      symbol: ["none", "none"], // 箭头
    },
  },
  series: [
    {
      id: "0",
      name: "模拟数据",
      type: "scatter",
      datasetIndex: 1,
      symbolSize: 6,
      itemStyle: {
        color: "red",
      },
    },
    {
      id: "1",
      name: "实测数据",
      type: "line",
      smooth: false,
      datasetIndex: 0,
      symbolSize: 0,
      symbol: "none",
      showSymbol: false,
      label: { show: false, fontSize: 16 },
      labelLayout: { dx: -20 },
      encode: { label: 2, tooltip: 1 },
    },
  ],
}
