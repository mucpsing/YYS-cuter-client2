/*
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2023-09-11 22:37:27
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2023-09-16 23:05:28
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\NsNpcManager\croe\api.ts
 * @Description: 所有的api只能通过store里面的内部类进行调用，不对其他组件进行暴露
 */
import Axios from "axios"
import config from "../store/config"
import { updateWithBothTable } from "../store/index"
import type { NpcInfo, NpcTableName } from "../types"

const baseURL = `http://${config.SERVER_IP}:${config.SERVER_PROT}/v1/`
const server = Axios.create({ baseURL, timeout: 1000 })

const API = {
  getNpcInfoById: "/getNpcInfoById/{id}",
  updateNpcInfoById: "/updateNpcInfoById/{id}",
  getItemList: "/getItemList/{id}",
}

export async function getNpcInfoById(NpcId: number): Promise<NpcInfo | undefined> {
  try {
    const res = await server.get(API.getNpcInfoById.replace("{id}", NpcId.toString()))
    console.log(res)
    if (res.status == 200 && res.data.success) {
      return res.data.res as NpcInfo
    }
    return undefined
  } catch (err) {
    return undefined
  }
}

export async function getItemList(itemId: number): Promise<NpcInfo | undefined> {
  try {
    const res = await server.get(API.getItemList.replace("{id}", itemId.toString()))

    if (res.status == 200 && res.data.success) {
      return res.data.res as NpcInfo
    }
    return undefined
  } catch (err) {
    return undefined
  }
}

// both: boolean = updateWithBothTable.value,
export async function updateNpcInfoById<T>(
  NpcId: number,
  newData: T,
  table_name: NpcTableName,
  both: boolean = updateWithBothTable.value,
): Promise<T | undefined> {
  try {
    switch (table_name) {
      case "NpcParams":
        if ("Attribute" in newData) delete newData["Attribute"]
        if ("AttributeLevel" in newData) delete newData["AttributeLevel"]
        break
    }

    const url = API.updateNpcInfoById.replace("{id}", NpcId.toString())

    console.log("更新数据: ", newData)

    const res = await server.patch(url, newData, { params: { table_name, both } })

    if (res.status == 200 && res.data.success) return res.data.res

    return undefined
  } catch (err) {
    return undefined
  }
}
