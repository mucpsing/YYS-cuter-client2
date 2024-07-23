/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-07-22 10:26:15
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-07-23 09:42:19
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\_components\guide.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// import { driver } from "driver.js"
import introJs from "intro.js"
import "intro.js/introjs.css"
import "intro.js/themes/introjs-dark.css"

import eventBus from "@renderer/libs/eventBus"

const allSteps = [
  {
    element: "#one", //这是添加引导的元素id
    intro: "引导一1111111111111111", //这是引导提示内容
    position: "right", //这是引导位置
  },
  {
    element: "#two",
    intro: "引导二1111111111111111",
    position: "left",
  },
  {
    element: "#finally",
    intro: "引导结束",
    position: "top",
  },
]

eventBus.on("show-guide", (args) => {
  const targetName = `#Gis-Api__template_input_mxd_name_${args[2]}`
  console.log("show-guide", targetName)

  introJs.hint(targetName).setOption({ hints: [{ hint: "First hint", element: targetName }] })
})
