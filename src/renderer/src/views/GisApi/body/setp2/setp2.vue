b
<template>
  <section
    :class="['flex flex-col w-full gap-2', 'flex-grow-[2]', 'rounded-xl text-xs xl:text-md']"
  >
    <!-- --------------- 【 工程前后的数据文件上传 】 --------------- -->
    <header
      ref="dropElementRef"
      :class="['flex-grow-[0]', 'flex flex-col gap-1 justify-center', 'min-h-[200px] relative']"
      :id="`Gis-Api__dfsu_input_${tabStore.currtFormData.id}`"
    >
      <FileTransfer />
    </header>

    <div :class="['flex-grow-[1] overflow-auto __scrollbar-bule']">
      <div class="h-[0]">
        <t-card>
          <div class="flex items-center justify-between mt-2">
            <div class="flex flex-col items-start justify-between">
              <h2 :class="['SwiperSetp__h2', 'xl:text-xl text-sm']">
                <strong>DFSU流向单位</strong>
              </h2>
              <p>
                dfsu文件默认导出是使用弧度（rad）为单位，但也可以以角度（deg）为单位，如果没有修改，默认为弧度。
              </p>
            </div>
            <div class="flex gap-1 text-md">
              <t-dropdown
                size="medium"
                :options="[
                  { content: `弧度(rad)`, value: `弧度` },
                  { content: `角度(deg)`, value: `角度` },
                ]"
                @click="(item) => (tabStore.currtFormData.radian_or_angle = (item.value as `弧度`| `角度`))"
              >
                <t-button
                  variant="outline"
                  :theme="tabStore.currtFormData.radian_or_angle == '弧度' ? 'danger' : 'warning'"
                  size="medium"
                >
                  {{ tabStore.currtFormData.radian_or_angle }}
                </t-button>
              </t-dropdown>
            </div>
          </div>

          <t-divider class="my-2"></t-divider>
          <div class="flex items-center justify-between mt-2">
            <div class="flex flex-col items-start justify-between">
              <h2 :class="['SwiperSetp__h2', 'xl:text-xl text-sm']"><strong>河道选择</strong></h2>
              <p>
                使用哪个工况的河道作用到图片中（一般建议采用工程前）：
                <t-button
                  size="small"
                  variant="outline"
                  theme="primary"
                  :onclick="() => (tabStore.currtFormData.riverRange = '工程前')"
                  >工程前</t-button
                >
                、
                <t-button
                  size="small"
                  variant="outline"
                  theme="danger"
                  :onclick="() => (tabStore.currtFormData.riverRange = '工程后')"
                  >工程后</t-button
                >
              </p>
            </div>
            <div class="flex gap-1 text-md">
              <t-dropdown
                size="medium"
                :options="[
                  { content: `工程前`, value: `工程前` },
                  { content: `工程后`, value: `工程后` },
                ]"
                @click="(item) => (tabStore.currtFormData.riverRange = (item.value as `工程前`| `工程后`))"
              >
                <t-button
                  variant="outline"
                  :theme="tabStore.currtFormData.riverRange == '工程后' ? 'primary' : 'danger'"
                  size="medium"
                >
                  {{ tabStore.currtFormData.riverRange }}
                </t-button>
              </t-dropdown>
            </div>
          </div>
          <t-divider class="my-2"></t-divider>

          <!-- --------------- 【 网格间距 】 --------------- -->
          <div class="flex items-center justify-between mt-2">
            <div class="flex flex-col items-start justify-between">
              <h2 :class="['SwiperSetp__h2', 'xl:text-xl text-sm']"><strong>网格间距</strong></h2>
              <p>河道数据点的间距（如果工程前后网格相同，则不会采用本参数）</p>
            </div>
            <div class="flex gap-1">
              <t-input-number
                theme="normal"
                size="medium"
                v-model="tabStore.currtFormData.mesh_size"
                class="w-[100px]"
                align="center"
              ></t-input-number>
            </div>
          </div>
          <t-divider class="my-2"></t-divider>

          <!-- --------------- 【 等值线显示范围 】 --------------- -->
          <div class="flex items-center justify-between mt-2">
            <div class="flex flex-col items-start justify-between">
              <h2 :class="['SwiperSetp__h2', 'xl:text-xl text-sm']">
                <strong>等值线显示范围</strong>
              </h2>
              <p>大于这个长度的流速等值线才会绘制（不变，增大，减少3中颜色线段）</p>
            </div>
            <div class="flex gap-1">
              <t-input-number
                v-model="tabStore.currtFormData.contour_range"
                theme="normal"
                size="medium"
                class="w-[100px]"
                align="center"
              ></t-input-number>
            </div>
          </div>
        </t-card>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import path from "path-browserify"
import { storeToRefs } from "pinia"
import { useDropZone } from "@vueuse/core"

import { getMd5 } from "@renderer/utils/calculateMd5"

// import DfsuInfo from "./dfsuInfo.vue"
// import FileTransfer from "./fileTransfer/index.vue"
import FileTransfer from "./fileTransfer.vue"
// import { UP_FILE_ACCEPT_TYPE } from "@gisapi/store/config"

import { uploadFileApi } from "@gisapi/api"
// import type { FileInfoBase } from "@gisapi/Types"
import { useGisApiTabStore } from "@gisapi/store/index"

const tabStore = useGisApiTabStore()
const { formDataList, currtTabId } = storeToRefs(tabStore)
let customFileUpInputElement: HTMLInputElement
const localStore = reactive({
  projectLoading: false,
  switchIconRoate: 90,
})

onMounted(() => {
  customFileUpInputElement = document.createElement("input")
})

onUnmounted(() => {
  // 挂载再卸载，用来清空这个全局的文件上传
  document.body.appendChild(customFileUpInputElement)
  document.body.removeChild(customFileUpInputElement)
})

// 用来支持拖拽文件
const dropElementRef = ref<HTMLElement>()
const { isOverDropZone } = useDropZone(dropElementRef, onDrop)
async function onDrop(files: File[] | null) {
  if (isOverDropZone && files) {
    if (files.length == 1) {
      // 文件读取
    }
  }
}

async function upFileHandler(e: any, target: "be" | "af" | "project") {
  if (!e.target) return console.log("获取实例失败")
  if (!e.target.files) return console.log("没有选中文件")

  const files = e.target.files
  const beInfo = formDataList.value[currtTabId.value].beDfsuInfo
  const afInfo = formDataList.value[currtTabId.value].afDfsuInfo

  let infoList: any[]
  if (target == "be") {
    infoList = [beInfo]
    if (files.length >= 2) infoList.push(afInfo)
    const be_dfsu_info = await updateDfsuInfo(files, infoList)
    console.log({ be_dfsu_info })
  } else if (target == "af") {
    infoList = [afInfo]
    if (files.length >= 2) infoList.push(beInfo)
    const af_dfsu_info = await updateDfsuInfo(files, infoList)
    console.log({ af_dfsu_info })
  } else if (target == "project") {
    await updateProjectRangeInfo(files)
    return
  }
}

async function updateDfsuInfo(files: FileList, infoList: any[]) {
  infoList.forEach(async (fileInfo, index) => {
    const file = (files as FileList)[index]

    fileInfo.reading = true
    setTimeout(() => (fileInfo.reading = false), 30000)

    fileInfo.size = file.size / 1024 / 1024
    fileInfo.name = file.name
    fileInfo.md5 = await getMd5(file)
    fileInfo.file = file

    const dfsu_info = await uploadFileApi(`${infoList[index].md5}.dfsu`, file)

    setTimeout(() => (fileInfo.reading = false), 600)

    if (dfsu_info) {
      fileInfo.bounds = dfsu_info.bounds
      fileInfo.range_geojson = dfsu_info.range_geojson
    } else {
      console.log("dfsu文件上传失败")
    }

    return dfsu_info
  })
}

async function updateProjectRangeInfo(files: FileList) {
  let basename = "" // 用来确保只会获取一个shp，其他不同名字的shp不会进行读取

  const projectRangeInfo = formDataList.value[currtTabId.value].projectRange

  localStore.projectLoading = true

  projectRangeInfo.fileList.length = 0

  for (let file of files) {
    // 获取后缀
    let ext = path.extname(file.name)
    if (file.name.endsWith(".shp.xml")) ext = ".shp.xml"

    // 获取basename
    if (!basename) basename = file.name.toString().replace(ext, "")

    if (basename != file.name.toString().replace(ext, "")) {
      setTimeout(() => (localStore.projectLoading = false), 600)
      console.log("请确保每次仅选择一套shp文件")
      continue
    }

    // 只记录shp文件的md5
    if (ext == ".shp") {
      projectRangeInfo.md5 = await getMd5(file)
      projectRangeInfo.name = path.basename(file.name, ext)
    }

    projectRangeInfo.fileList.push({ file, ext, name: file.name })
  }

  projectRangeInfo.fileCount = projectRangeInfo.fileList.length

  setTimeout(() => (localStore.projectLoading = false), 600)
}
</script>

<style lang="stylus"></style>
