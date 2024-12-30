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
