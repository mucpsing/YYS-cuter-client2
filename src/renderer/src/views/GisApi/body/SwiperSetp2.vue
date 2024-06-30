<template>
  <section
    :class="['flex flex-col w-full gap-2', 'flex-grow-[2]', 'rounded-xl p-2 text-xs xl:text-md']"
  >
    <!-- --------------- 【 工程前后的数据文件上传 】 --------------- -->
    <header
      ref="headerRef"
      :class="['flex-grow-[0]', 'flex gap-1', 'min-h-[150px] flex-or relative']"
    >
      <!-- 拖拽激活后的样式遮罩层 -->
      <div class="GisApi__drapMask" :class="{ 'GisApi__drapMask-show': isOverDropZone }">
        <div class="GisApi__drapMaskTip">最多支持读取前两个dfsu文件</div>
      </div>

      <DfsuInfo
        title="DFSU文件(工程前)"
        :fileInfo="formDataList[currtFormDataId].beDfsuInfo"
        @onBtnClick="() => onUploadBtnClickHandler('be')"
      />
      <!-- 切换按钮 -->
      <div
        class="flex items-center justify-center px-2 bg-blue-100 rounded-sm cursor-pointer hover:bg-blue-300"
        @click="switchAfAndBeDfsuFile"
      >
        <strong class="transition-all" :style="{ transform: `rotate(${r}deg)` }">
          <c-icon-font iconName="icon-yys-04zhuanhuan" class="text-xl text-white"></c-icon-font>
        </strong>
      </div>
      <DfsuInfo
        title="DFSU文件(工程后)"
        :fileInfo="formDataList[currtFormDataId].afDfsuInfo"
        @onBtnClick="() => onUploadBtnClickHandler('af')"
      />
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
                @click="(item) => (formDataList[currtFormDataId].radian_or_angle = (item.value as `弧度`| `角度`))"
              >
                <t-button
                  variant="outline"
                  :theme="
                    formDataList[currtFormDataId].radian_or_angle == '弧度' ? 'danger' : 'warning'
                  "
                  size="medium"
                >
                  {{ formDataList[currtFormDataId].radian_or_angle }}
                </t-button>
              </t-dropdown>
            </div>
          </div>
          <t-divider class="my-2"></t-divider>
          <t-loading :loading="projectLoading" class="flex items-center justify-between mt-2">
            <div class="flex flex-col items-start justify-between">
              <h2 :class="['SwiperSetp__h2', 'xl:text-xl text-sm']">
                <strong>工程范围 </strong>

                <t-radio-group
                  class="ml-2"
                  v-model="formDataList[currtFormDataId].projectRangeType"
                >
                  <t-radio value="shp">shp面文件</t-radio>
                  <t-radio value="point">指定坐标</t-radio>
                </t-radio-group>
              </h2>
              <p v-if="formDataList[currtFormDataId].projectRangeType == 'shp'">
                <span
                  >上传文件<strong class="text-xs">(面SHP文件)</strong>：{{
                    formDataList[currtFormDataId].projectRange.name
                      ? formDataList[currtFormDataId].projectRange.name + ".shp"
                      : "未选择"
                  }}</span
                >
              </p>
              <p v-if="formDataList[currtFormDataId].projectRangeType == 'shp'">
                <strong
                  >已选文件{{
                    `(${formDataList[currtFormDataId].projectRange.fileCount})`
                  }}：</strong
                >
              </p>
              <p
                v-if="formDataList[currtFormDataId].projectRangeType == 'shp'"
                class="flex flex-wrap gap-2"
              >
                <t-tag
                  variant="light-outline"
                  theme="success"
                  v-for="(item, idx) of formDataList[currtFormDataId].projectRange.fileList"
                  :key="idx"
                >
                  {{ item.name }}
                </t-tag>
              </p>
            </div>
            <div class="flex gap-1">
              <t-button
                v-if="formDataList[currtFormDataId].projectRangeType == 'shp'"
                :onClick="() => onUploadBtnClickHandler('project')"
                theme="success"
                variant="outline"
                size="medium"
              >
                <template #icon>
                  <cps-icon-font iconName="icon-yys-folder-opened" class="mr-2" />
                </template>

                {{ formDataList[currtFormDataId].projectRange.name || "选择.shp文件" }}</t-button
              >
              <div v-if="formDataList[currtFormDataId].projectRangeType == 'point'">
                <t-input-number
                  v-model="formDataList[currtFormDataId].projectPoints.x"
                  theme="normal"
                  placeholder="X坐标"
                ></t-input-number>
                ，
                <t-input-number
                  v-model="formDataList[currtFormDataId].projectPoints.y"
                  theme="normal"
                  placeholder="Y坐标"
                ></t-input-number>
              </div>
            </div>
          </t-loading>
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
                  :onclick="() => (formDataList[currtFormDataId].riverRange = '工程前')"
                  >工程前</t-tag
                >
                、
                <t-tag
                  size="small"
                  class="cursor-pointer"
                  variant="light-outline"
                  theme="danger"
                  :onclick="() => (formDataList[currtFormDataId].riverRange = '工程后')"
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
                @click="(item) => (formDataList[currtFormDataId].riverRange = (item.value as `工程前`| `工程后`))"
              >
                <t-button
                  variant="outline"
                  :theme="
                    formDataList[currtFormDataId].riverRange == '工程后' ? 'primary' : 'danger'
                  "
                  size="medium"
                >
                  {{ formDataList[currtFormDataId].riverRange }}
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
                v-model="formDataList[currtFormDataId].mesh_size"
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
                v-model="formDataList[currtFormDataId].contour_range"
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
import DfsuInfo from "../_components/dfsuInfo.vue"
import { getMd5 } from "@renderer/utils/calculateMd5"
import { useDropZone } from "@vueuse/core"
import path from "path-browserify"
import { UP_FILE_ACCEPT_TYPE } from "../store/config"

import { formDataList, currtFormDataId } from "../store/state"

onMounted(() => {
  customFileUpInputElement = document.createElement("input")
})

onUnmounted(() => {
  document.body.appendChild(customFileUpInputElement)
  document.body.removeChild(customFileUpInputElement)
})

const projectLoading = ref(false)
let customFileUpInputElement: HTMLInputElement

// 用来支持拖拽文件
const headerRef = ref<HTMLElement>()
const { isOverDropZone } = useDropZone(headerRef, onDrop)
async function onDrop(files: File[] | null) {
  if (isOverDropZone && files) {
    if (files.length == 1) {
    }
  }
}

const r = ref(90)
/**
 * @description: 交换工程前和工程后两个文件的信息
 */
async function switchAfAndBeDfsuFile() {
  const temp = Object.assign({}, formDataList.value[currtFormDataId.value].beDfsuInfo)
  Object.assign(
    formDataList.value[currtFormDataId.value].beDfsuInfo,
    formDataList.value[currtFormDataId.value].afDfsuInfo,
  )
  Object.assign(formDataList.value[currtFormDataId.value].afDfsuInfo, temp)

  r.value = r.value >= 1800 ? 0 : r.value + 180 // 点击旋转按钮效果
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
  customFileUpInputElement.onchange = (e) => onInputChange(e, fileType)
  customFileUpInputElement.type = "file"
  customFileUpInputElement.multiple = true
  if (customFileUpInputElement.value) customFileUpInputElement.value = ""
  customFileUpInputElement.click()
}

async function onInputChange(e: any, target: "be" | "af" | "project") {
  if (!e.target) return console.log("获取实例失败")
  if (!e.target.files) return console.log("没有选中文件")

  const files = e.target.files
  const beInfo = formDataList.value[currtFormDataId.value].beDfsuInfo
  const afInfo = formDataList.value[currtFormDataId.value].afDfsuInfo

  let infoList: any[]
  if (target == "be") {
    infoList = [beInfo]
    if (files.length >= 2) infoList.push(afInfo)
    await updateDfsuInfo(files, infoList)
  } else if (target == "af") {
    infoList = [afInfo]
    if (files.length >= 2) infoList.push(beInfo)
    await updateDfsuInfo(files, infoList)
  } else if (target == "project") {
    await updateProjectRangeInfo(files)
    return
  }
}

async function updateDfsuInfo(files: FileList, infoList: any[]) {
  infoList.forEach(async (fileInfo, index) => {
    const file = (files as FileList)[index]

    fileInfo.reading = true
    fileInfo.size = file.size / 1024 / 1024
    fileInfo.name = file.name
    fileInfo.md5 = await getMd5(file)
    fileInfo.file = file

    setTimeout(() => (fileInfo.reading = false), 600)

    // await uploadFile(`${infoList[index].md5}.dfsu`, file)
  })
}

async function updateProjectRangeInfo(files: FileList) {
  let basename = "" // 用来确保只会获取一个shp，其他不同名字的shp不会进行读取

  // const uploadBodyList: { file: File; ext: string }[] = []
  const projectRangeInfo = formDataList.value[currtFormDataId.value].projectRange
  // const shpList = formDataList.value[currtFormDataId.value].projectRange.shpList

  projectLoading.value = true
  // shpList.length = 0
  projectRangeInfo.fileList.length = 0

  for (let file of files) {
    // 获取后缀
    let ext = path.extname(file.name)
    if (file.name.endsWith(".shp.xml")) ext = ".shp.xml"

    // 获取basename
    if (!basename) basename = file.name.toString().replace(ext, "")

    if (basename != file.name.toString().replace(ext, "")) {
      setTimeout(() => (projectLoading.value = false), 600)
      console.log("请确保每次仅选择一套shp文件")
      continue
    }

    // 只记录shp文件的md5
    if (ext == ".shp") {
      projectRangeInfo.md5 = await getMd5(file)
      projectRangeInfo.name = path.basename(file.name, ext)
    }

    projectRangeInfo.fileList.push({ file, ext, name: file.name })
    // uploadBodyList.push({ file, ext })
    // shpList.push(file.name)
  }

  projectRangeInfo.fileCount = projectRangeInfo.fileList.length

  // const md5 = projectRangeInfo.md5
  // console.log(uploadBodyList.map((item) => ({ filename: `${md5}${item.ext}`, file: item.file })))

  setTimeout(() => (projectLoading.value = false), 600)
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
  @apply text-lg
}
</style>
