// import { type graphic } from "echarts"
import chroma from "chroma-js"

export interface TyphoonData {
  DATE: string[]
  TYPE: number[]
  PRES: string[]
  WND: number[]
  OWD: number[]
  X: number[]
  Y: number[]
  geojson: any
  RAW: any[]
  //   geojson: GeoJSON.FeatureCollection<GeoJSON.LineString>
}

export function typhoonStrongType(val: number) {
  if (val == 0) return "弱于热带低压"
  else if (val == 1) return "热带低压"
  else if (val == 2) return "热带风暴"
  else if (val == 3) return "强热带风暴"
  else if (val == 4) return "台风"
  else if (val == 5) return "强台风"
  else if (val == 6) return "超强台风"
  else if (val == 9) return "变性"
  else return "未知"
}

export function converCoords(coord: number | string) {
  return Math.round(parseInt(coord as string) / 10)
}

export function parserEachPointData(rawData: string[]) {
  const yydd = `${rawData[0].slice(0, 4)}年${rawData[0].slice(4, 6)}${rawData[0].slice(6, 8)}`
  const HHMM = `${rawData[0].slice(8, 10)}时`
  return {
    日期: `${yydd} ${HHMM}`,
    强度: typhoonStrongType(parseInt(rawData[1])),
    "最底气压(hPa)": rawData[4],
    "最大风速(MSW,m/s)": rawData[5],
    平均风速: rawData.length > 6 ? rawData[6] : "暂无记录",
  }
}

export function parserTyphoonData(data: DataObjItemT) {
  return {
    生成时间: data.RAW[0][0],
    结束时间: data.RAW[data.RAW.length - 1][0],
    最大强度: "",
    最大风速: "",
  }
}

export function initDataItem() {
  return {
    id: 0,
    分类标志: "AAAAA", // 分类标志，66666'表示最佳路径资料;
    国际编号: "BBBB", // 国际编号,年份的最后两位数+两位数的编号:
    路径记录: "CCC", // 路径数据记录的行数;
    热带低压: "DDDD", // 包括热带低压在内的热带气旋序号,
    热带气旋: "EEEE", // 我国对热带气旋的编号:
    终结记录: "F", // 热带气旋终结记录: 0表示消散,1表示移出西太台风委员会的责任海区,2表示合并,3表示准静止,
    路径间隔: "G", // 每行路径间隔小时数: 2017年以前均为6(小时)，2017年开始登陆个例有3小时加密记录的为3,其余仍为6;
    英文名称: "H...H", // 热带气旋的英文名称,名称后加“(-1)n”表示副中心及其序号:
    生成日期: "I...I", // 数据集形成的日期.
    RAW: [] as string[][],
  }
}

export type DataObjItemT = ReturnType<typeof initDataItem>

/**
 * @description: 解析txt文件，返回文件对象
 */
export async function parserDataFromTxt(file: File, START_KEY: string = "66666") {
  const resList: DataObjItemT[] = []
  const text = await file.text()
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line)

  let tpyhoon_id: number = 0
  let res = initDataItem()

  for (const line of lines) {
    // 解析数据行
    const eachLine = line.split(/\s+/)

    // 解析数据头
    if (line.startsWith(START_KEY) && eachLine.length == 9) {
      // 记录上一个
      if (tpyhoon_id > 0) {
        resList.push(res)
        res = initDataItem()
      }

      // 遇到新台风头部，保存当前台风数据
      res["分类标志"] = eachLine[0]
      res["国际编号"] = eachLine[1]
      res["路径记录"] = eachLine[2]
      res["热带低压"] = eachLine[3]
      res["热带气旋"] = eachLine[4]
      res["终结记录"] = eachLine[5]
      res["路径间隔"] = eachLine[6]
      res["英文名称"] = eachLine[7]
      res["生成日期"] = eachLine[8]
      res.id = tpyhoon_id

      tpyhoon_id += 1
    } else if (eachLine.length == 6 && eachLine[0].length == 10) {
      res.RAW.push(eachLine)
    }
  }

  return resList
}

// type GradientColor = graphic.LinearGradient | string

/**
 * @description: 颜色来自https://www.grabient.com/，将这个网站的颜色通过css写入，然后转换成echarts颜色
 * @param {string} className
 * @return {*}
 */
export function parseGradientToEchartsColor(className: string) {
  // 获取所有已加载的样式表
  const styleSheets = Array.from(document.styleSheets) as CSSStyleSheet[]

  let backgroundColor: string | null = null
  let backgroundImage: string | null = null

  // 遍历所有样式表
  for (const styleSheet of styleSheets) {
    // 忽略跨域样式表（无法访问的样式表）
    try {
      const rules = styleSheet.cssRules || styleSheet.rules
      if (!rules) continue

      // 遍历所有规则，查找匹配的类
      for (const rule of rules) {
        if (rule instanceof CSSStyleRule && rule.selectorText.includes(`.${className}`)) {
          backgroundColor = rule.style.backgroundColor || backgroundColor
          backgroundImage = rule.style.backgroundImage || backgroundImage
        }
      }
    } catch (e) {
      console.warn("无法访问跨域样式表", e)
    }
  }

  // 如果没有找到背景图或背景色，返回默认颜色
  if (!backgroundColor && !backgroundImage) {
    console.warn(`No background color or background image found for class: ${className}`)
    return "#000" // 默认黑色
  }

  // 处理渐变背景图
  if (backgroundImage && backgroundImage.startsWith("linear-gradient")) {
    const gradientMatch = backgroundImage.match(/linear-gradient\(([\d\.]+)deg,\s*([^\)]+)\)/)

    if (gradientMatch) {
      const angle = parseFloat(gradientMatch[1]) // 渐变角度
      const colors = gradientMatch[2].split(",").map((c) => c.trim()) // 渐变颜色数组

      // 计算渐变方向的 cos 和 sin 值
      const angleRad = (angle * Math.PI) / 180
      const x = Math.cos(angleRad) // 渐变方向的 X 轴分量
      const y = Math.sin(angleRad) // 渐变方向的 Y 轴分量

      // 返回 LinearGradient 所需的参数
      return [
        x,
        y,
        0,
        1, // 渐变方向
        colors.map((color, index) => ({
          offset: index / (colors.length - 1), // 计算渐变位置
          color: color,
        })),
      ]
    }
  }

  // 如果没有渐变效果，返回纯色（背景色）
  return backgroundColor || "#000" // 默认返回黑色
}

/**
 * @description: 扩展echarts的颜色，数据太多的时候不太够用，生成每个颜色的浅色和深色版本
 * @param {string} colors 要扩展的颜色列表
 */
export function generateColorSeries(colors: string[] | null = null): string[] {
  // 这个是echarts原来的颜色盘
  const defaultColor = [
    "#5470c6",
    "#91cc75",
    "#fac858",
    "#ee6666",
    "#73c0de",
    "#3ba272",
    "#fc8452",
    "#9a60b4",
    "#ea7ccc",
  ]

  colors = colors || defaultColor
  const lightColor: string[] = []
  const darkColor: string[] = []

  const expandedColors: string[] = []

  colors.forEach((color) => {
    // 使用 chroma.js 生成浅色和深色版本
    lightColor.push(chroma(color).brighten(2).hex()) // 生成浅色
    darkColor.push(chroma(color).darken(2).hex()) // 生成深色
  })

  return expandedColors.concat(colors, darkColor, lightColor)
}

export const extendEchartColors = generateColorSeries()
