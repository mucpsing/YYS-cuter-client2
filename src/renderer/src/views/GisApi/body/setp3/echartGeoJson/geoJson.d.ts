/*
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2024-08-07 22:31:20
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2024-08-07 22:47:03
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\GisApi\body\setp3\geoJson.d.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 定义GeoJSON的基础类型
export type GeoJsonType =
  | "Feature"
  | "FeatureCollection"
  | "GeometryCollection"
  | "LineString"
  | "MultiLineString"
  | "MultiPoint"
  | "MultiPolygon"
  | "Point"
  | "Polygon"

export interface Position {
  [0]: number
  [1]: number
  [2]?: number // 可选的高程
}

// export type Coordinates = Position[] | Position[][] | Position[][][]

export interface GeometryObject {
  type: GeoJsonType
  coordinates: Position[] | Position[][] | Position[][][]
}

export interface FeatureProperties {
  [name: string]: any
}

export interface Feature {
  type: "Feature"
  properties: FeatureProperties
  geometry: GeometryObject
}

export interface FeatureCollection {
  type: "FeatureCollection"
  crs?: {
    type: string
    properties: {
      name: string
    }
  }
  features: Feature[]
}

// 示例GeoJSON数据的TypeScript类型
const geojson: FeatureCollection = {
  type: "FeatureCollection",
  crs: {
    type: "name",
    properties: {
      name: "urn:ogc:def:crs:OGC:1.3:CRS84",
    },
  },
  features: [
    {
      type: "Feature",
      properties: { name: "range_clip" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [444148.69649, 2515029.900612],
            [444161.574624830973335, 2515056.973512940108776],
            [444174.452759662002791, 2515084.046413879841566],
            // 更多坐标...
            [444148.69649, 2515029.900612], // 确保多边形闭合
          ],
        ],
      },
    },
    // 更多特征...
  ],
}

export default geojson
