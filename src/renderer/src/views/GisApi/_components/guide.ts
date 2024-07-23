/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2024-07-22 10:26:15
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2024-07-23 09:42:19
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\_components\guide.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import introJs from "intro.js"
import "intro.js/introjs.css"
// import "intro.js/themes/introjs-dark.css"

const curIntro = introJs.tour()

curIntro.setOptions({
  prevLabel: `上一步`,
  nextLabel: `下一步`,
  skipLabel: `跳过`,
  doneLabel: `完成`,
  tooltipPosition: `bottom` /* 引导说明框相对高亮说明区域的位置 */,
  hidePrev: true, // 隐藏第一步中的上一个按钮
  tooltipClass: `` /* 引导说明文本框的样式 */,
  highlightClass: `` /* 说明高亮区域的样式 */,
  exitOnOverlayClick: false /* 是否允许点击空白处退出 */,
  showStepNumbers: false /* 是否显示说明的数据步骤*/,
  keyboardNavigation: false /* 是否允许键盘来操作 */,
  showButtons: true /* 是否按键来操作 */,
  showBullets: true /* 是否使用点点点显示进度 */,
  showProgress: false /* 是否显示进度条 */,
  scrollToElement: true /* 是否滑动到高亮的区域 */,
  overlayOpacity: 0.6 /* 遮罩层的透明度 */,
  positionPrecedence: [
    `bottom`,
    `top`,
    `right`,
    `left`,
  ] /* 当位置选择自动的时候，位置排列的优先级 */,
  disableInteraction: false /* 是否禁止与元素的相互关联 */,
  // hintPosition: "top-middle",
  steps: [
    {
      element: targetName, //这是添加引导的元素id
      intro: "引导一1111111111111111", //这是引导提示内容
      position: "right", //这是引导位置
    },
  ],
})

curIntro.start()
