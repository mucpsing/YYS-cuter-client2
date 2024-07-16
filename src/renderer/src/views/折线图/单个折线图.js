// See https://github.com/ecomfe/echarts-stat
const rawData = {
    mainTitle: "下横站",
    subTitle: "实测单沙过程对比图",
    startTime: "2020-06-16 14:00:00",
    axis: { y: { name: "水\n位\n(m)", min: 3, max: -1 } },
    range: 0.02,
    data: [
      0.62, 0.5, 0.48, 0.6, 0.88, 1.12, 1.2, 1.1, 0.96, 0.8, 0.68, 0.54, 0.4, 0.3, 0.28, 0.48, 0.88,
      1.28, 1.54, 1.58, 1.44, 1.3, 1.12, 0.92, 0.72, 0.54, 0.4, 0.32, 0.5, 0.84, 1.06, 1.12, 1.04,
      0.9, 0.78, 0.66, 0.52, 0.4, 0.34, 0.42, 0.74, 1.22, 1.56, 1.7, 1.6, 1.38, 1.22, 1.02, 0.76,
      0.54, 0.34, 0.2, 0.14, 0.28, 0.66, 0.96, 1.08, 1.04, 0.92, 0.8, 0.64, 0.5, 0.38, 0.34, 0.54,
      1, 1.48, 1.78, 1.8, 1.6, 1.34, 1.1, 0.86, 0.6, 0.38, 0.18, 0.02, -0.04, 0.16, 0.6, 0.94, 1.06,
      1, 0.9, 0.74, 0.58, 0.44, 0.36, 0.4, 0.78, 1.28, 1.7, 1.9, 1.82, 1.56, 1.3, 1.06, 0.8, 0.54,
      0.3, 0.08, -0.06, -0.06, 0.32, 0.76, 1.02, 1.12, 1.04, 0.94, 0.78, 0.64, 0.5, 0.44, 0.62,
      1.12, 1.64, 2, 2.08, 1.86, 1.6, 1.34, 1.04, 0.72, 0.46, 0.22, 0, -0.12, 0.02, 0.48, 0.84,
      1.04, 1.08, 1.02, 0.9, 0.76, 0.62, 0.52, 0.54, 0.92, 1.44, 1.88, 2.12, 2.04, 1.8, 1.54, 1.24,
      0.92, 0.64, 0.36, 0.12, -0.06, -0.16, 0.04, 0.54, 0.94, 1.08, 1.02, 0.92, 0.82, 0.68, 0.58,
      0.52, 0.62, 1.1, 1.66, 2.04, 2.14, 1.96, 1.72, 1.44, 1.14, 0.82, 0.52, 0.26, 0.02, -0.14,
      -0.18, 0.22, 0.68, 0.96, 1.08, 1.04, 0.94, 0.8, 0.66, 0.52, 0.46, 0.78, 1.34, 1.82, 2.12, 2.1,
      1.84, 1.54, 1.28, 1, 0.7, 0.42, 0.16, -0.04, -0.2, -0.16, 0.34, 0.78, 1, 1.04, 1, 0.92, 0.76,
      0.64, 0.54, 0.54, 0.92,
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
    data: ["实测数据", "模拟数据"], // 图例项数据
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
    bottom:"0%",
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
      symbolSize: 1,
      symbol: "circle",
      label: { show: false, fontSize: 16 },
      labelLayout: { dx: -20 },
      encode: { label: 2, tooltip: 1 },
    },
  ],
}
