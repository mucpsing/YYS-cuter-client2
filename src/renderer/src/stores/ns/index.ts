import { defineStore } from "pinia"
import { SkillTemplate } from "@data/ns/skill"

export const useNsConfiglStore = defineStore("config", {
  state: () => ({
    SERVER_IP: "127.0.0.1",
    SERVER_PORT: 5050,
    API_VERSION: "v1",
  }),
})

export const useNsNpcStore = defineStore("npc", {
  state: () => ({
    currtId: 0,
  }),
})

export const useNsItemStore = defineStore("item", {
  state: () => ({
    currtId: 0,
  }),
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
    setData(newData) {
      this.data = newData
    },
  },
})
