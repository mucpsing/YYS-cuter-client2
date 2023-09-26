<template>
  <section
    :class="['flex flex-col w-full gap-2', 'flex-grow-[2]', 'rounded-xl p-2 text-xs xl:text-md']"
  >
    <input
      type="file"
      style="display: none"
      ref="afInputRef"
      @change="onInputChange($event, 'af')"
      multiple
      accept=".dfsu"
    />
    <input
      type="file"
      style="display: none"
      ref="beInputRef"
      @change="onInputChange($event, 'be')"
      accept=".dfsu"
      multiple
    />
    <input
      ref="projectRangeRef"
      type="file"
      style="display: none"
      multiple
      :onChange="onInputProjectRangeChange"
      accept=".cpg,.dbf,.sbn,.sbx,.shp,.shx,.shp.xml"
    />
    <!-- --------------- 【 工程前后的数据文件上传 】 --------------- -->
    <header
      ref="headerRef"
      :class="['flex-grow-[0]', 'flex gap-1', 'min-h-[150px] flex-or relative']"
    >
      <!-- 拖拽激活后的样式遮罩层 -->
      <div class="GisApi__drapMask" :class="{ 'GisApi__drapMask-show': isOverDropZone }">
        <div class="GisApi__drapMaskTip">最多支持读取前两个dfsu文件</div>
      </div>

      <t-card
        :class="['flex-grow-[1]']"
        title="DFSU文件(工程前)"
        :loading="formDataList[currtFormDataId].beDfsuInfo.reading"
      >
        <div :class="['flex justify-start']">
          <div class="flex flex-col text-gray-500">
            <h3 class="my-1 text-black">
              <strong>工程前：</strong>{{ formDataList[currtFormDataId].beDfsuInfo.name }}
            </h3>
            <!-- TODO electron 才有的特性这里屏蔽掉，后期需要优化 -->
            <!-- <p>文件路径：{{ formDataList[currtFormDataId].beDfsuInfo.path }}</p> -->
            <span>文件大小：{{ formDataList[currtFormDataId].beDfsuInfo.size.toFixed(2) }} MB</span>
            <span>上传名称：{{ formDataList[currtFormDataId].beDfsuInfo.md5 }}.dfsu</span>
          </div>
        </div>

        <div class="flex justify-center w-full pt-3">
          <t-button
            size="medium"
            class="min-w-[250px]"
            :theme="formDataList[currtFormDataId].beDfsuInfo.md5 ? 'success' : 'danger'"
            :onClick="() => onUploadBtnClick('be')"
          >
            选择dfsu文件
          </t-button>
        </div>
      </t-card>

      <div
        class="flex items-center justify-center px-2 bg-blue-100 rounded-sm cursor-pointer hover:bg-blue-300"
        @click="switchf"
      >
        <c-icon-font iconName="huifu" class=""></c-icon-font>
      </div>

      <t-card
        :class="['flex-grow-[1]']"
        title="DFSU文件(工程后)"
        :loading="formDataList[currtFormDataId].afDfsuInfo.reading"
      >
        <div :class="['flex justify-start']">
          <div class="flex flex-col text-gray-500">
            <h3 class="my-1 text-black">
              <strong>工程后：</strong>{{ formDataList[currtFormDataId].afDfsuInfo.name }}
            </h3>
            <!-- TODO electron 才有的特性这里屏蔽掉，后期需要优化 -->
            <!-- <p>文件路径：{{ formDataList[currtFormDataId].afDfsuInfo.path }}</p> -->
            <span>文件大小：{{ formDataList[currtFormDataId].afDfsuInfo.size.toFixed(2) }} MB</span>
            <span>上传名称：{{ formDataList[currtFormDataId].afDfsuInfo.md5 }}.dfsu</span>
          </div>
        </div>

        <div class="flex justify-center w-full pt-3">
          <t-button
            class="min-w-[250px]"
            :theme="formDataList[currtFormDataId].afDfsuInfo.md5 ? 'success' : 'danger'"
            :onClick="() => onUploadBtnClick('af')"
          >
            选择dfsu文件
          </t-button>
        </div>
      </t-card>
    </header>

    <t-card :class="['flex-grow-[1] ']">
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

      <!-- <t-divider class="my-2"></t-divider> -->

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
              >已选文件{{ `(${formDataList[currtFormDataId].projectRange.fileCount})` }}：</strong
            >
          </p>
          <p class="flex flex-wrap gap-2">
            <t-tag
              variant="light-outline"
              theme="success"
              v-for="(ext, idx) of projectShpList"
              :key="idx"
              :onClick="() => ''"
            >
              {{ ext }}
            </t-tag>
          </p>
        </div>
        <div class="flex gap-1">
          <t-button
            :onClick="onInputProjectRangeClick"
            theme="danger"
            variant="outline"
            size="small"
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
            size="small"
            :options="[
              { content: `工程前`, value: `工程前` },
              { content: `工程后`, value: `工程后` },
            ]"
            @click="(item) => (formDataList[currtFormDataId].riverRange = (item.value as `工程前`| `工程后`))"
          >
            <t-button variant="outline" size="small">{{
              formDataList[currtFormDataId].riverRange
            }}</t-button>
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
          <t-input size="small" placeholder="25" class="w-[100px]" align="center"></t-input>
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
          <t-input placeholder="200" size="small" class="w-[100px]" align="center"></t-input>
        </div>
      </div>
      <t-divider class="my-2"></t-divider>

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
  </section>
</template>

<script setup lang="ts">
// import DfsuUpload from "../_components/dfsuUpload.vue"
import { uploadFile } from "../api"
import { getMd5 } from "@renderer/utils/calculateMd5"
import { useDropZone } from "@vueuse/core"
import path from "path-browserify"

import { formDataList, currtFormDataId } from "../store/state"

const inputElement = document.createElement("input")
inputElement.type = "file"

const headerRef = ref<HTMLElement>()
const { isOverDropZone } = useDropZone(headerRef, onDrop)
async function onDrop(files: File[] | null) {
  if (isOverDropZone && files) {
    if (files.length == 1) {
    }
  }
}

const outputExt = ref(".jpg")
const outputFloodMode = ref("选择类型")
const outputPojectType = ref("选择工况")
const beInputRef = ref<HTMLInputElement>()
const afInputRef = ref<HTMLInputElement>()

const projectRangeRef = ref<HTMLInputElement>()
const projectShpList = ref<string[]>([])
const projectLoading = ref(false)

async function switchf() {
  const temp = Object.assign({}, formDataList.value[currtFormDataId.value].beDfsuInfo)
  Object.assign(
    formDataList.value[currtFormDataId.value].beDfsuInfo,
    formDataList.value[currtFormDataId.value].afDfsuInfo,
  )
  Object.assign(formDataList.value[currtFormDataId.value].afDfsuInfo, temp)
}

async function onUploadBtnClick(target: "af" | "be") {
  // let inputRef = target == "af" ? afInputRef : beInputRef

  // if (!inputRef || !inputRef.value) return
  // if (inputRef.value.value) inputRef.value.value = ""

  console.log("按钮点击~~~~~~~~~~~~~~~~", inputElement)
  // inputRef.value.click()

  inputElement.accept = ".dfsu"
  inputElement.click()
}

async function onInputChange(e: any, target: "af" | "be") {
  console.log("Input ~onInputChange--------------------", e)
  let inputRef: globalThis.Ref<HTMLInputElement | undefined>
  let infoList: any[]

  if (target == "be") {
    inputRef = beInputRef
    infoList = [formDataList.value[currtFormDataId.value].beDfsuInfo]
  } else if (target == "af") {
    inputRef = afInputRef
    infoList = [formDataList.value[currtFormDataId.value].afDfsuInfo]
  } else {
    return
  }

  if (!inputRef || !inputRef.value) return console.log("input元素获取失败")
  if (!inputRef.value.files) return console.log("input为空，不执行上传")

  const files = inputRef.value.files
  if (files.length >= 2) {
    if (target == "be") infoList.push(formDataList.value[currtFormDataId.value].afDfsuInfo)
    if (target == "af") infoList.push(formDataList.value[currtFormDataId.value].beDfsuInfo)
  }
  await readFiles(files, infoList)
}

async function readFiles(files: FileList, infoList: any[]) {
  console.log("readFiles--------------------")

  const count = infoList.length

  for (let index = 0; index < count; index++) {
    const file = (files as FileList)[index]

    console.log({ file })

    infoList[index].size = file.size / 1024 / 1024
    infoList[index].name = file.name
    // infoList[index].path = file.path.toString()

    infoList[index].reading = true
    infoList[index].md5 = await getMd5(file)

    setTimeout(() => {
      infoList[index].reading = false
    }, 1000)

    // await uploadFile(`${infoList[index].md5}.dfsu`, file)
  }
}

async function onInputProjectRangeClick() {
  if (!projectRangeRef || !projectRangeRef.value) return
  if (projectRangeRef.value.value) projectRangeRef.value.value = ""

  projectRangeRef.value.click()
}

async function onInputProjectRangeChange(_e: Event) {
  if (!projectRangeRef || !projectRangeRef.value) return console.log("input元素获取失败")
  if (!projectRangeRef.value.files) return console.log("input为空，不执行上传")

  const files = projectRangeRef.value.files
  let basename = "" // 用来确保只会获取一个shp，其他不同名字的shp不会急需读取

  if (files.length == 0) return

  const uploadBodyList: { file: File; ext: string }[] = []
  projectLoading.value = true
  projectShpList.value.length = 0

  for (let file of files) {
    // 识别shp文件
    let ext = path.extname(file.name)
    if (file.name.endsWith(".shp.xml")) ext = ".shp.xml"
    if (!basename) {
      basename = file.name.toString().replace(ext, "")
    } else {
      if (basename != file.name.toString().replace(ext, "")) {
        setTimeout(() => (projectLoading.value = false), 600)

        return console.log("请确保每次仅选择一套shp文件")
      }
    }

    // 只记录shp文件的md5
    if (ext == ".shp") {
      formDataList.value[currtFormDataId.value].projectRange.md5 = await getMd5(file)
      formDataList.value[currtFormDataId.value].projectRange.name = path.basename(file.name, ext)
      formDataList.value[currtFormDataId.value].projectRange.path = file.path
      formDataList.value[currtFormDataId.value].projectRange.fileCount = files.length
    }

    uploadBodyList.push({ file, ext })
    projectShpList.value.push(file.name)
  }

  let md5 = formDataList.value[currtFormDataId.value].projectRange.md5

  // console.log(uploadBodyList)
  console.log(uploadBodyList.map((item) => ({ filename: `${md5}${item.ext}`, file: item.file })))
  // await readFiles(files, infoList)
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
