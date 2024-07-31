<template>
  <section
    :class="['flex flex-col w-full gap-2', 'flex-grow-[2]', 'rounded-xl p-2 text-xs xl:text-md']"
  >
    <!-- --------------- 【 工程前后的数据文件上传 】 --------------- -->
    <header
      ref="dropElementRef"
      :class="['flex-grow-[0]', 'flex gap-1', 'min-h-[150px] flex-or relative']"
      :id="`Gis-Api__dfsu_input_${tabStore.currtFormData.id}`"
    >
      <!-- 拖拽激活后的样式遮罩层 -->
      <div class="GisApi__drapMask" :class="{ 'GisApi__drapMask-show': isOverDropZone }">
        <div class="GisApi__drapMaskTip">最多支持读取前两个dfsu文件</div>
      </div>

      <!-- <DfsuInfo
        title="DFSU文件(工程前)"
        :fileInfo="tabStore.currtFormData.beDfsuInfo"
        @onBtnClick="() => onUploadBtnClickHandler('be')"
      /> -->
      <FileTransfer />

      <!-- 切换按钮 -->
      <div
        class="flex items-center justify-center px-2 bg-blue-100 rounded-sm cursor-pointer hover:bg-blue-300"
        @click="switchAfAndBeDfsuFile"
      >
        <strong
          class="transition-all"
          :style="{ transform: `rotate(${localStore.switchIconRoate}deg)` }"
        >
          <c-icon-font iconName="icon-yys-04zhuanhuan" class="text-xl text-white"></c-icon-font>
        </strong>
      </div>

      <FileTransfer />
      <!-- <DfsuInfo
        title="DFSU文件(工程后)"
        :fileInfo="tabStore.currtFormData.afDfsuInfo"
        @onBtnClick="() => onUploadBtnClickHandler('af')"
      /> -->
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

          <section
            :loading="localStore.projectLoading"
            class="flex items-center justify-between mt-2"
          >
            <div class="flex flex-col items-start justify-between">
              <h2 :class="['SwiperSetp__h2', 'xl:text-xl text-sm']">
                <strong>工程范围 </strong>

                <t-radio-group class="ml-2" v-model="tabStore.currtFormData.projectRangeType">
                  <t-radio value="shp">shp面文件</t-radio>
                  <t-radio value="point">指定坐标</t-radio>
                </t-radio-group>
              </h2>
              <p v-if="tabStore.currtFormData.projectRangeType == 'shp'">
                <span
                  >上传文件<strong class="text-xs">(面SHP文件)</strong>：{{
                    tabStore.currtFormData.projectRange.name
                      ? tabStore.currtFormData.projectRange.name + ".shp"
                      : "未选择"
                  }}</span
                >
              </p>
              <p v-if="tabStore.currtFormData.projectRangeType == 'shp'">
                <strong
                  >已选文件{{ `(${tabStore.currtFormData.projectRange.fileCount})` }}：</strong
                >
              </p>
              <p
                v-if="tabStore.currtFormData.projectRangeType == 'shp'"
                class="flex flex-wrap gap-2"
              >
                <t-tag
                  variant="light-outline"
                  theme="success"
                  v-for="(item, idx) of tabStore.currtFormData.projectRange.fileList"
                  :key="idx"
                >
                  {{ item.name }}
                </t-tag>
              </p>
            </div>
            <div class="flex gap-1 transition-all">
              <t-button
                v-if="tabStore.currtFormData.projectRangeType == 'shp'"
                :onClick="() => onUploadBtnClickHandler('project')"
                theme="success"
                variant="outline"
                size="medium"
              >
                <template #icon>
                  <cps-icon-font iconName="icon-yys-folder-opened" class="mr-2" />
                </template>

                {{ tabStore.currtFormData.projectRange.name || "选择.shp文件" }}</t-button
              >
              <div v-if="tabStore.currtFormData.projectRangeType == 'point'">
                <t-input-number
                  v-model="tabStore.currtFormData.projectPoints.x"
                  theme="normal"
                  placeholder="X坐标"
                ></t-input-number>
                ，
                <t-input-number
                  v-model="tabStore.currtFormData.projectPoints.y"
                  theme="normal"
                  placeholder="Y坐标"
                ></t-input-number>
              </div>
            </div>
          </section>
          <t-divider class="my-2"></t-divider>
          <div class="flex items-center justify-between mt-2">
            <div class="flex flex-col items-start justify-between">
              <h2 :class="['SwiperSetp__h2', 'xl:text-xl text-sm']"><strong>河道选择</strong></h2>
              <p>
                使用哪个工况的河道作用到图片中（一般建议采用工程前）：
                <t-tag
                  size="small"
                  class="cursor-pointer"
                  variant="light-outline"
                  theme="primary"
                  :onclick="() => (tabStore.currtFormData.riverRange = '工程前')"
                  >工程前</t-tag
                >
                、
                <t-tag
                  size="small"
                  class="cursor-pointer"
                  variant="light-outline"
                  theme="danger"
                  :onclick="() => (tabStore.currtFormData.riverRange = '工程后')"
                  >工程后</t-tag
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

import DfsuInfo from "./dfsuInfo.vue"
import FileTransfer from "./fileTransfer/index.vue"
import { UP_FILE_ACCEPT_TYPE } from "@gisapi/store/config"

import { uploadFileApi } from "@gisapi/api"
import type { FileInfoBase } from "@gisapi/Types"
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

/**
 * @description: 交换工程前和工程后两个文件的信息
 */
async function switchAfAndBeDfsuFile() {
  // pinia 中交换工程前后两个数据
  tabStore.exchaneDfsuInfo()

  if (localStore.switchIconRoate >= 1800) localStore.switchIconRoate = 0
  localStore.switchIconRoate += 180 // 点击旋转按钮效果
}

/**
 * @description: 实时修改accept来控制文件上传
 * @param {*} fileType be和AF用来标识dfsu，其他文件认作shp
 */
async function onUploadBtnClickHandler(fileType: "be" | "af" | "project") {
  let target: keyof typeof UP_FILE_ACCEPT_TYPE
  if (["be", "af"].includes(fileType)) {
    target = "dfsu"
  } else {
    target = "shp"
  }

  // 调用点击事件
  customFileUpInputElement.accept = UP_FILE_ACCEPT_TYPE[target]
  customFileUpInputElement.onchange = (e) => upFileHandler(e, fileType)
  customFileUpInputElement.type = "file"
  customFileUpInputElement.multiple = true
  if (customFileUpInputElement.value) customFileUpInputElement.value = ""
  customFileUpInputElement.click()
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

    const dfsu_info: FileInfoBase = await uploadFileApi(`${infoList[index].md5}.dfsu`, file)

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

<style lang="stylus">
/* 遮罩具体样式 */
.GisApi__drapMask{
  position absolute
  width 100%
  height 100%
  text-align center
  display flex
  align-items center
  justify-content center
  pointer-events none
  color rgba(0, 0, 0,1)
  background-color rgba(255, 255, 255, 0.1)
  opacity 0
  box-sizing border-box
  border-radius 5px
  backdrop-filter blur(5px)
  transition all 0.6s cubic-bezier(0.25, 1, 0.5, 1)

  .GisApi__drapMaskTip{
    font-size clamp(1rem, 4vh, 2rem)
  }
}

.GisApi__drapMask-show{
  opacity 1
  z-index 50
}

.GisApi__SwiperSetp2-title{
  opacity 1
  font-size: 1.125rem /* 18px */;
  line-height: 1.75rem /* 28px */;
}
</style>
