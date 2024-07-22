// import { driver } from "driver.js"
import introJs from "intro.js"
import "intro.js/introjs.css"
import "intro.js/themes/introjs-dark.css"

import eventBus from "@renderer/libs/eventBus"

const d = introJs()

eventBus.on("show-guide", (args) => {
  const targetName = `#Gis-Api__template_input_mxd_name_${args[2]}`
  console.log("show-guide", targetName)

  introJs.hint(targetName)
})
