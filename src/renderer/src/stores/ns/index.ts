import { defineStore } from "pinia"

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
    data: [],
  }),

  actions: {
    setData(newData) {
      this.data = newData
    },
  },
})
