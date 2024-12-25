<!--
 * @Author: Capsion 373704015@qq.com
 * @Date: 2024-08-01 20:05:49
 * @LastEditors: Capsion 373704015@qq.com
 * @LastEditTime: 2024-12-25 21:54:08
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\Home\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import * as echarts from "echarts"
// import "echarts/extension-src/bmap/bmap"
// type EChartsOption = echarts.EChartsOption

import { baseBmap, baseGeoCoordMap as geoCoordMap, data } from "./data"
import { type DataItem } from "./data"

const convertData = function (data: DataItem[]) {
  var res: { name: string; value: number[] }[] = []
  for (var i = 0; i < data.length; i++) {
    var geoCoord = geoCoordMap[data[i].name]
    if (geoCoord) {
      res.push({
        name: data[i].name,
        value: geoCoord.concat(data[i].value),
      })
    }
  }
  return res
}

let option = {
  backgroundColor: "transparent",
  title: {
    text: "全国主要城市空气质量 - 百度地图",
    subtext: "data from PM25.in",
    sublink: "http://www.pm25.in",
    left: "center",
  },
  tooltip: {
    trigger: "item",
  },
  bmap: {
    center: [104.114129, 37.550339],
    zoom: 5,
    roam: true,
    mapStyle: baseBmap,
  },
  series: [
    {
      name: "pm2.5",
      type: "scatter",
      coordinateSystem: "bmap",
      data: convertData(data),
      symbolSize: function (val) {
        return val[2] / 10
      },
      encode: {
        value: 2,
      },
      label: {
        formatter: "{b}",
        position: "right",
        show: false,
      },
      emphasis: {
        label: {
          show: true,
        },
      },
    },
    {
      name: "Top 5",
      type: "effectScatter",
      coordinateSystem: "bmap",
      data: convertData(
        data
          .sort(function (a, b) {
            return b.value - a.value
          })
          .slice(0, 6),
      ),
      symbolSize: function (val) {
        return val[2] / 10
      },
      encode: {
        value: 2,
      },
      showEffectOn: "render",
      rippleEffect: {
        brushType: "stroke",
      },
      label: {
        formatter: "{b}",
        position: "right",
        show: true,
      },
      itemStyle: {
        shadowBlur: 10,
        shadowColor: "#333",
      },
      emphasis: {
        scale: true,
      },
      zlevel: 1,
    },
  ],
}
</script>

<template>
  <div class="flex w-full h-full p-2 bg-slate-400">
    <div>test11123</div>
  </div>
</template>
