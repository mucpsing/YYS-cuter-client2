import { reactive } from "vue";
import type { HwndInfo } from "../imageCuter";

export default reactive({
  hwndInfoList: [] as HwndInfo[],
  currtHwnd: 0,
});
