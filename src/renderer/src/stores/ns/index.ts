/*
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2023-09-30 09:40:42
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2023-10-20 00:07:09
 * @FilePath: \YYS-cuter-client2\src\renderer\src\stores\ns\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineStore } from "pinia"
import { SkillTemplate, printDataMap } from "@data/ns/skill"
import { getSkillList, updateSkillById } from "@renderer/api/ns-api"

export const useNsConfiglStore = defineStore("config", {
  state: () => ({
    SERVER_IP: "127.0.0.1",
    SERVER_PORT: 5050,
    API_VERSION: "v1",
  }),
})

export const useNsNpcStore = defineStore("npc", {
  state: () => ({ currtId: 0 }),
})

export const useNsItemStore = defineStore("item", {
  state: () => ({ currtId: 0 }),
})

export const useNsSkillStore = defineStore("skill", {
  state: () => ({
    currtId: 0,
    data: [SkillTemplate],
  }),

  getters: {
    skillList(state) {
      return state.data.map((item) => {
        const res = {}
        let deep = 1
        for (const [key, value] of Object.entries(item)) {
          if (deep == 1) {
            return item[key]
          }
          deep += 1
        }

        return res
      })
    },
  },

  actions: {
    async dataUpdateByApi() {
      console.log("getSkillDataFromApi")

      const skillList = await getSkillList()

      if (skillList.length > 0) this.data.length = 0
      // this.data = skillList
      skillList.forEach((item, index) => {
        index += 1
        this.data.push(Object.assign({ index }, item))
      })

      let searchData = this.data.map((item) => {
        return {
          id: item.SkillId,
          name: item["Skill Name"],
        }
      })

      console.log(searchData)

      // let index = 1
      // skillList.forEach((item) => {
      // const keys = Object.keys(item)

      // keys.forEach((key, idx) => {
      //   if (keys.length == 1) {
      //     item[key]["index"] = index
      //     this.data.push(item[key])
      //     index += 1
      //   } else if (key != "技能说明") {
      //     item[key]["index"] = index
      //     this.data.push(item[key])
      //     index += 1
      //   }
      // })
      // })

      printDataMap(this.data)
    },
  },
})
