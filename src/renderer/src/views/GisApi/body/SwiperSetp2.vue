<template>
  <section :class="['flex flex-col w-full gap-2', 'flex-grow-[2]', 'rounded-xl p-2']">
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
        title="工程前 - DFSU文件信息"
        :loading="formDataList[currtFormDataId].beDfsuInfo.reading"
      >
        <div :class="['flex justify-start']">
          <div class="flex flex-col text-gray-500">
            <h3 class="my-1 text-lg text-black">
              <strong>文件名：</strong>{{ formDataList[currtFormDataId].beDfsuInfo.name }}
            </h3>
            <p>文件路径：{{ formDataList[currtFormDataId].beDfsuInfo.path }}</p>
            <span>文件大小：{{ formDataList[currtFormDataId].beDfsuInfo.size.toFixed(2) }} MB</span>
            <span>上传名称：{{ formDataList[currtFormDataId].beDfsuInfo.md5 }}.dfsu</span>
          </div>
        </div>

        <div class="flex justify-center w-full pt-3">
          <t-button
            class="min-w-[250px]"
            :theme="formDataList[currtFormDataId].beDfsuInfo.md5 ? 'success' : 'danger'"
            :onClick="async () => await onUploadBtnClick('be')"
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
        title="工程后 - DFSU文件信息"
        :loading="formDataList[currtFormDataId].afDfsuInfo.reading"
      >
        <div :class="['flex justify-start']">
          <div class="flex flex-col text-gray-500">
            <h3 class="my-1 text-lg text-black">
              <strong>文件名：</strong>{{ formDataList[currtFormDataId].afDfsuInfo.name }}
            </h3>
            <p>文件路径：{{ formDataList[currtFormDataId].afDfsuInfo.path }}</p>
            <span>文件大小：{{ formDataList[currtFormDataId].afDfsuInfo.size.toFixed(2) }} MB</span>
            <span>上传名称：{{ formDataList[currtFormDataId].afDfsuInfo.md5 }}.dfsu</span>
          </div>
        </div>

        <div class="flex justify-center w-full pt-3">
          <t-button
            class="min-w-[250px]"
            :theme="formDataList[currtFormDataId].afDfsuInfo.md5 ? 'success' : 'danger'"
            :onClick="async () => await onUploadBtnClick('af')"
          >
            选择dfsu文件
          </t-button>
        </div>
      </t-card>
    </header>

    <t-card :class="['flex-grow-[1]']">
      <!-- --------------- 【 输出名称 】 --------------- -->
      <div class="flex items-center justify-between mt-2">
        <div class="flex flex-col items-start justify-between">
          <h2 class="SwiperSetp__h2"><strong>输出名称</strong></h2>
          <p class="max-w-[90%]">
            指定图片的输出名称，默认情况下会尝试识别shp文件名称，根据最后一段_{xxx}的xxx来命名
          </p>
        </div>
        <div class="flex gap-1">
          <t-input class="" placeholder="文件名（不带后缀）" align="center"></t-input>
          <t-dropdown
            :options="[
              { content: `.jpg`, value: `.jpg` },
              { content: `.jpeg`, value: `.jpeg` },
              { content: `.png`, value: `.png` },
            ]"
            @click="(item) => (outputExt = (item.value as string))"
          >
            <t-button>{{ outputExt }}</t-button>
          </t-dropdown>
        </div>
      </div>

      <t-divider class="my-2"></t-divider>

      <!-- --------------- 【 工况选择 】 --------------- -->
      <div class="flex items-center justify-between mt-2">
        <div class="flex flex-col items-start justify-between">
          <h2 class="SwiperSetp__h2"><strong>工况选择</strong></h2>
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
              theme="success"
              variant="light-outline"
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
            <t-button>{{ outputPojectType }}</t-button>
          </t-dropdown>
        </div>
      </div>

      <t-divider class="my-2"></t-divider>

      <!-- --------------- 【 洪水类型 】 --------------- -->
      <div class="flex items-center justify-between mt-2">
        <div class="flex flex-col items-start justify-between">
          <h2 class="SwiperSetp__h2"><strong>洪水类型</strong></h2>
          <p>
            常见的<strong>洪水</strong>类型有：
            <t-tag
              class="mx-1 hover:cursor-pointer"
              v-for="(item, idx) of [
                { content: `以洪为主`, value: `以洪为主` },
                { content: `以潮为主`, value: `以潮为主` },
              ]"
              :key="idx"
              theme="warning"
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
            <t-button>{{ outputFloodMode }}</t-button>
          </t-dropdown>
        </div>
      </div>

      <t-divider class="my-2"></t-divider>
    </t-card>
    <input
      type="file"
      style="display: none"
      ref="afInputRef"
      :onChange="() => onInputChange('af')"
      accept=".dfsu"
      multiple
    />
    <input
      type="file"
      style="display: none"
      ref="beInputRef"
      :onChange="() => onInputChange('be')"
      accept=".dfsu"
      multiple
    />
  </section>
</template>

<script setup lang="ts">
// import DfsuUpload from "../_components/dfsuUpload.vue"
import { uploadFile } from "../api"
import { getMd5 } from "@renderer/utils/calculateMd5"
import { useDropZone } from "@vueuse/core"

import { formDataList, currtFormDataId } from "../store/state"

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

async function switchf() {
  const temp = Object.assign({}, formDataList.value[currtFormDataId.value].beDfsuInfo)
  Object.assign(
    formDataList.value[currtFormDataId.value].beDfsuInfo,
    formDataList.value[currtFormDataId.value].afDfsuInfo,
  )
  Object.assign(formDataList.value[currtFormDataId.value].afDfsuInfo, temp)
}

async function onUploadBtnClick(target: "af" | "be") {
  let inputRef = target == "af" ? afInputRef : beInputRef

  if (!inputRef || !inputRef.value) return
  if (inputRef.value.value) inputRef.value.value = ""

  inputRef.value.click()
}

async function onInputChange(target: "af" | "be") {
  let inputRef
  let infoList
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

async function readFiles(files: File[], infoList: any[]) {
  const count = infoList.length

  for (let index = 0; index < count; index++) {
    const file = (files as File[])[index]

    infoList[index].size = file.size / 1024 / 1024
    infoList[index].name = file.name
    infoList[index].path = file.path.toString()

    infoList[index].reading = true
    infoList[index].md5 = await getMd5(file)

    setTimeout(() => {
      infoList[index].reading = false
    }, 1000)

    await uploadFile(`${infoList[index].md5}.dfsu`, file)
  }
}
</script>

<style lang="stylus">
/* 遮罩具体样式 */
.GisApi__drapMask
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

  .GisApi__drapMaskTip
    font-size clamp(1rem, 4vh, 2rem)

.GisApi__drapMask-show
  opacity 1
  z-index 50
</style>
