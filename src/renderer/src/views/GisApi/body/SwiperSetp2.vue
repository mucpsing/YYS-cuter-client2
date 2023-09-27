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
        @onBtnClick="() => onUploadBtnClick('be')"
      />
      <div
        class="flex items-center justify-center px-2 bg-blue-100 rounded-sm cursor-pointer hover:bg-blue-300"
        @click="switchf"
      >
        <strong class="transition-all" :style="{ transform: `rotate(${r}deg)` }">
          <c-icon-font iconName="icon-yys-04zhuanhuan" class="text-xl text-white"></c-icon-font>
        </strong>
      </div>
      <DfsuInfo
        title="DFSU文件(工程后)"
        :fileInfo="formDataList[currtFormDataId].afDfsuInfo"
        @onBtnClick="() => onUploadBtnClick('af')"
      />
    </header>

    <div :class="['flex-grow-[1] overflow-auto ']">
      <div class="h-[0]">
        <t-card>
          <!-- --------------- 【 输出名称 】 --------------- -->
          <!-- <div class="flex items-center justify-between mt-2">
        <div class="flex flex-col items-start justify-between">
          <h2 :class="['SwiperSetp__h2', 'xl:text-xl text-sm']"><strong>输出名称</strong></h2>
          <p class="max-w-[90%]">
            指定图片的输出名称，默认情况下会尝试识别shp文件名称，根据最后一段_{xxx}的xxx来命名
          </p>
        </div>
        <div class="flex gap-1">
          <t-input
            v-model="formDataList[currtFormDataId].outputName"
            size="small"
            class=""
            placeholder="文件名（不带后缀）"
            align="center"
          ></t-input>
        </div>
      </div>

      <t-divider class="my-2"></t-divider> -->

          <!-- --------------- 【 工况选择 】 --------------- -->
          <!-- <div class="flex items-center justify-between mt-2">
        <div class="flex flex-col items-start justify-between">
          <h2 :class="['SwiperSetp__h2', 'xl:text-xl text-sm']"><strong>工况选择</strong></h2>
          <p>
            常见的工况有：
            <t-tag
              class="mx-1 hover:cursor-pointer"
              v-for="(item, idx) of [
                { content: `10年一遇`, value: `10年一遇` },
                { content: `20年一遇`, value: `20年一遇` },
                { content: `50年一遇`, value: `50年一遇` },
                { content: `100年一遇`, value: `100年一遇` },
                { content: `200年一遇`, value: `200年一遇` },
              ]"
              :key="idx"
              size="small"
              theme="success"
              variant="light-outline"
              v-model="formDataList[currtFormDataId].project"
              @click="outputPojectType = item.value"
              >{{ item.value }}</t-tag
            >
          </p>
        </div>
        <div class="flex gap-1">
          <t-dropdown
            :options="[
              { content: `10年一遇`, value: `10年一遇` },
              { content: `20年一遇`, value: `20年一遇` },
              { content: `50年一遇`, value: `50年一遇` },
              { content: `100年一遇`, value: `100年一遇` },
              { content: `200年一遇`, value: `200年一遇` },
            ]"
            @click="(item) => (outputPojectType = (item.value as string))"
          >
            <t-button variant="outline" theme="primary" size="small">{{
              outputPojectType
            }}</t-button>
          </t-dropdown>
        </div>
      </div>

      <t-divider class="my-2"></t-divider> -->

          <!-- --------------- 【 洪水类型 】 --------------- -->
          <!-- <div class="flex items-center justify-between mt-2">
        <div class="flex flex-col items-start justify-between">
          <h2 :class="['SwiperSetp__h2', 'xl:text-xl text-sm']"><strong>洪水类型</strong></h2>
          <p>
            常见的<strong>洪水</strong>类型有：
            <t-tag
              class="mx-1 hover:cursor-pointer"
              v-for="(item, idx) of [
                { content: `以洪为主`, value: `以洪为主` },
                { content: `以潮为主`, value: `以潮为主` },
              ]"
              :key="idx"
              size="small"
              :theme="idx % 2 == 1 ? 'danger' : 'primary'"
              variant="light-outline"
              @click="outputFloodMode = item.value"
              >{{ item.value }}</t-tag
            >
          </p>
        </div>
        <div class="flex gap-1">
          <t-dropdown
            :options="[
              { content: `以洪为主`, value: `以洪为主` },
              { content: `以潮为主`, value: `以潮为主` },
            ]"
            @click="(item) => (outputFloodMode = (item.value as string))"
          >
            <t-button variant="outline" theme="primary" size="small">{{
              outputFloodMode
            }}</t-button>
          </t-dropdown>
        </div>
      </div> -->
          <t-loading :loading="projectLoading" class="flex items-center justify-between mt-2">
            <div class="flex flex-col items-start justify-between">
              <h2 :class="['SwiperSetp__h2', 'xl:text-xl text-sm']">
                <strong
                  >工程范围
                  <t-tag theme="danger" size="small" variant="light-outline"
                    >仅支持<strong>面shp文件</strong></t-tag
                  ></strong
                >
              </h2>
              <p>
                <span
                  ><strong>上传文件：</strong
                  >{{ formDataList[currtFormDataId].projectRange.name + ".shp" }}</span
                >
              </p>

              <p>
                <strong
                  >已选文件{{
                    `(${formDataList[currtFormDataId].projectRange.fileCount})`
                  }}：</strong
                >
              </p>
              <p class="flex flex-wrap gap-2">
                <t-tag
                  variant="light-outline"
                  theme="success"
                  v-for="(ext, idx) of formDataList[currtFormDataId].projectRange.shpList"
                  :key="idx"
                >
                  {{ ext }}
                </t-tag>
              </p>
            </div>
            <div class="flex gap-1">
              <t-button
                :onClick="() => onUploadBtnClick('project')"
                theme="success"
                variant="outline"
                size="medium"
              >
                <template #icon>
                  <cps-icon-font iconName="icon-yys-folder-opened" class="mr-2" />
                </template>

                {{ formDataList[currtFormDataId].projectRange.name || "选择.shp文件" }}</t-button
              >
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
                <t-button variant="outline" theme="success" size="medium">
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
              <p>河道数据点的间距（后期自动根据河道自动识别）</p>
            </div>
            <div class="flex gap-1">
              <t-input size="medium" placeholder="25" class="w-[100px]" align="center"></t-input>
            </div>
          </div>
          <t-divider class="my-2"></t-divider>

          <!-- --------------- 【 流速范围 】 --------------- -->
          <div class="flex items-center justify-between mt-2">
            <div class="flex flex-col items-start justify-between">
              <h2 :class="['SwiperSetp__h2', 'xl:text-xl text-sm']"><strong>流速范围</strong></h2>
              <p class="max-w-[80%]">
                大于这个长度的流速等值线才会被标注流速关系字段（不变，增大，减少）
              </p>
            </div>
            <div class="flex gap-1">
              <t-input placeholder="200" size="medium" class="w-[100px]" align="center"></t-input>
            </div>
          </div>
          <!-- <t-divider class="my-2"></t-divider> -->

          <!-- --------------- 【 等值线序列 】 --------------- -->
          <!-- <div class="flex items-center justify-between mt-2">
        <div class="flex flex-col w-full gap-1">
          <h2 :class="['SwiperSetp__h2', 'xl:text-xl text-sm']"><strong>等值线序列</strong></h2>
          <p class="max-w-[90%]">自定义等值线步进，使用分号 ";" 分割每个步进</p>
          <t-input
            size="small"
            v-model="counterSetp"
            :placeholder="defaultCounterSetp"
            class="w-[100%] text-sm"
            type="text"
            align="center"
          ></t-input>
        </div>
      </div>
      <t-divider class="my-2"></t-divider> -->
        </t-card>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import DfsuInfo from "../_components/dfsuInfo.vue"
import { uploadFile } from "../api"
import { getMd5 } from "@renderer/utils/calculateMd5"
import { useDropZone } from "@vueuse/core"
import path from "path-browserify"

import { formDataList, currtFormDataId } from "../store/state"

const projectShpList = computed(
  () => formDataList.value[currtFormDataId.value].projectRange.shpList,
)
const projectLoading = ref(false)

const inputElement = document.createElement("input")
inputElement.type = "file"
inputElement.multiple = true

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
async function switchf() {
  const temp = Object.assign({}, formDataList.value[currtFormDataId.value].beDfsuInfo)
  Object.assign(
    formDataList.value[currtFormDataId.value].beDfsuInfo,
    formDataList.value[currtFormDataId.value].afDfsuInfo,
  )
  Object.assign(formDataList.value[currtFormDataId.value].afDfsuInfo, temp)

  r.value = r.value >= 1800 ? 0 : r.value + 180 // 点击旋转按钮效果
}

async function onUploadBtnClick(fileType: "be" | "af" | "project") {
  const uploadFileType = {
    dfsu: ".dfsu",
    shp: ".cpg,.dbf,.sbn,.sbx,.shp,.shx,.shp.xml",
  }

  let target: keyof typeof uploadFileType
  if (["be", "af"].includes(fileType)) {
    target = "dfsu"
  } else {
    target = "shp"
  }

  inputElement.accept = uploadFileType[target]
  inputElement.onchange = (e) => onInputChange(e, fileType)
  if (inputElement.value) inputElement.value = ""
  inputElement.click()
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

  const uploadBodyList: { file: File; ext: string }[] = []
  const projectRangeInfo = formDataList.value[currtFormDataId.value].projectRange
  const shpList = formDataList.value[currtFormDataId.value].projectRange.shpList

  projectLoading.value = true
  shpList.length = 0
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
      projectRangeInfo.fileList.push(file)
    }

    uploadBodyList.push({ file, ext })
    shpList.push(file.name)
  }

  

  projectRangeInfo.fileCount = shpList.length

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
