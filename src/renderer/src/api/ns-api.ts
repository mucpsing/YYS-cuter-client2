/*
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2023-09-11 22:37:27
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2023-10-10 14:55:56
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\NsNpcManager\croe\api.ts
 * @Description: 所有的api只能通过store里面的内部类进行调用，不对其他组件进行暴露
 */
import Axios from "axios"
import config from "@nsData/config"
// import { useNsConfiglStore } from "@nsStore/index"
import { updateWithBothTable } from "../views/NsNpcManager/store/index"
import { NotifyPlugin } from "tdesign-vue-next"

import type { NpcInfo, NpcTableName } from "@/types/npc"
import type { ItemDataType } from "@/types/item"

const baseURL = `http://${config.SERVER_IP}:${config.SERVER_PORT}/${config.API_VERSION}/`
const server = Axios.create({ baseURL, timeout: 1000 })

const API = {
  getNpcInfoById: "/getNpcInfoById/{id}",
  updateNpcInfoById: "/updateNpcInfoById/{id}",
  getItemList: "/getItemList/{id}",
  getItemInfoById: "/getItemInfoById/{id}",
  getSkillList: "/getSkillList",
  updateSkillById: "/getSkillList/{id}",
}

function urlErrMsg(url) {
  NotifyPlugin("error", {
    title: `接口调用失败${url}`,
    // content: msg,
    duration: 2000,
  })
}

export async function getItemInfoById(ItemId: number): Promise<ItemDataType | undefined> {
  const url = API.getItemInfoById.replace("{id}", ItemId.toString())

  try {
    const res = await server.get(url)

    console.log(res)
    if (res.status == 200 && res.data.success) {
      return res.data.res as ItemDataType
    }
    return undefined
  } catch (err) {
    urlErrMsg(url)
    return undefined
  }
}

export async function getNpcInfoById(NpcId: number): Promise<NpcInfo | undefined> {
  const url = API.getNpcInfoById.replace("{id}", NpcId.toString())

  try {
    const res = await server.get(url)

    console.log(res)
    if (res.status == 200 && res.data.success) {
      return res.data.res as NpcInfo
    }
    return undefined
  } catch (err) {
    urlErrMsg(url)
    return undefined
  }
}

export async function getItemList(itemId: number): Promise<NpcInfo | undefined> {
  const url = API.getNpcInfoById.replace("{id}", itemId.toString())

  try {
    const res = await server.get(API.getItemList.replace("{id}", itemId.toString()))

    if (res.status == 200 && res.data.success) {
      return res.data.res as NpcInfo
    }
    return undefined
  } catch (err) {
    urlErrMsg(url)

    return undefined
  }
}

// both: boolean = updateWithBothTable.value,
export async function updateNpcInfoById(
  NpcId: number,
  newData: object,
  table_name: NpcTableName,
  both: boolean = updateWithBothTable.value,
): Promise<object | undefined> {
  switch (table_name) {
    case "NpcParams":
      if ("Attribute" in newData) delete newData["Attribute"]
      if ("AttributeLevel" in newData) delete newData["AttributeLevel"]
      break
  }

  if (Object.keys(newData).length == 0) return

  const url = API.updateNpcInfoById.replace("{id}", NpcId.toString())
  console.log("更新数据: ", newData)

  try {
    const res = await server.patch(url, newData, { params: { table_name, both } })

    if (res.status == 200 && res.data.success) return res.data.res

    return undefined
  } catch (err) {
    urlErrMsg(url)
    console.log(err)

    return undefined
  }
}

export async function getSkillList() {
  const url = API.getSkillList
  try {
    const res = await server.get(url)

    if (res.status == 200 && res.data.success) return res.data.res

    return []
  } catch (err) {
    urlErrMsg(url)
    console.log(err)
    console.log(err)

    return []
  }
}

export async function updateSkillById() {}
