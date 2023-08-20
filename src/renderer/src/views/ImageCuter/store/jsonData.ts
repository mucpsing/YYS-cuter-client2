import { reactive } from "vue";
import type { CoordsData } from "../imageCuter";

export type JsonDataType = {
  [id: string]: CoordsData;
};

export default reactive({
  data: {} as JsonDataType,

  async setData(newData: JsonDataType) {
    this.data = newData;
  },

  async updageData(key: string, value: any) {
    this.data[key] = value;
  },
});
