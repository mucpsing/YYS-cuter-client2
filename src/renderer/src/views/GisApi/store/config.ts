import { ref } from "vue"
export const baseSize = ref<"small" | "large" | "medium">("large")

export const uploadFileType = {
  dfsu: ".dfsu",
  shp: ".cpg,.dbf,.sbn,.sbx,.shp,.shx,.shp.xml",
}
