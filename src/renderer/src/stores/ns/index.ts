import { defineStore } from "pinia"
import { SkillTemplate } from "@data/ns/skill"
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
    async getSkillDataFromApi() {
      const skillList = await getSkillList()
      let index = 1
      if (skillList.length > 0) this.data.length = 0

      skillList.forEach((item) => {
        const keys = Object.keys(item)

        keys.forEach((key, idx) => {
          if (keys.length == 1) {
            item[key]["index"] = index
            this.data.push(item[key])
            index += 1
          } else if (key != "技能说明") {
            item[key]["index"] = index
            this.data.push(item[key])
            index += 1
          }
        })
      })

      console.log("this.data: ", this.data.length)
    },
  },
})
