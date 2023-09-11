import Axios from "axios"
import config from "../store/config"

import type { NpcInfo } from "../types"

const baseURL = `http://${config.SERVER_IP}:${config.SERVER_PROT}`
const server = Axios.create({ baseURL })

const API = {
  getNpcInfoById: "/getNpcInfoById/{id}",
}

export async function getNpcInfoById(NpcId: number): Promise<NpcInfo | null> {
  return await server.get(API.getNpcInfoById.replace("{id}", NpcId.toString()))
}
