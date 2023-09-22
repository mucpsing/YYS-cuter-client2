<template>
  <section :class="['flex flex-col w-full gap-2', 'flex-grow-[2]', 'rounded-xl p-2']">
    <!-- --------------- 【 工程前后的数据文件上传 】 --------------- -->
    <header
      ref="headerRef"
      :class="['flex-grow-[1]', 'flex gap-2', 'min-h-[150px] flex-or relative']"
    >
      <!-- 拖拽激活后的样式遮罩层 -->
      <div class="GisApi__drapMask" :class="{ 'GisApi__drapMask-show': isOverDropZone }">
        <div class="GisApi__drapMaskTip">最多支持读取前两个dfsu文件</div>
      </div>

      <t-card
        :loading="
          !Boolean(
            formDataList[currtFormDataId].beDfsuInfo.progress == 0 ||
              formDataList[currtFormDataId].beDfsuInfo.progress == 100,
          )
        "
        :class="['flex-grow-[1]']"
        title="工程前 - DFSU文件信息"
      >
        <div :class="['flex justify-start']">
          <div class="flex flex-col text-gray-500">
            <h3 class="my-1 text-lg text-black">
              <strong>文件名：</strong>{{ formDataList[currtFormDataId].beDfsuInfo.name }}
            </h3>
            <p>文件路径：{{ formDataList[currtFormDataId].beDfsuInfo.path }}</p>
            <span>文件大小：{{ formDataList[currtFormDataId].beDfsuInfo.size.toFixed(2) }} MB</span>
            <span
              >解析进度：{{ formDataList[currtFormDataId].beDfsuInfo.progress.toFixed(2)
              }}<strong>%</strong></span
            >
            <span>上传名称：{{ formDataList[currtFormDataId].beDfsuInfo.md5 }}.dfsu</span>
          </div>
        </div>

        <input
          type="file"
          style="display: none"
          ref="beInputRef"
          :onChange="() => onInputChange('be')"
          accept=".dfsu"
          multiple
        />
      </t-card>

      <t-card
        :loading="
          !Boolean(
            formDataList[currtFormDataId].afDfsuInfo.progress == 0 ||
              formDataList[currtFormDataId].afDfsuInfo.progress == 100,
          )
        "
        :class="['flex-grow-[1]']"
        title="工程后 - DFSU文件信息"
      >
        <div :class="['flex justify-start']">
          <div class="flex flex-col text-gray-500">
            <h3 class="my-1 text-lg text-black">
              <strong>文件名：</strong>{{ formDataList[currtFormDataId].afDfsuInfo.name }}
            </h3>
            <p>文件路径：{{ formDataList[currtFormDataId].afDfsuInfo.path }}</p>
            <span>文件大小：{{ formDataList[currtFormDataId].afDfsuInfo.size.toFixed(2) }} MB</span>
            <span
              >解析进度：{{ formDataList[currtFormDataId].afDfsuInfo.progress.toFixed(2)
              }}<strong>%</strong></span
            >
            <span>上传名称：{{ formDataList[currtFormDataId].afDfsuInfo.md5 }}.dfsu</span>
          </div>
        </div>
        <input
          type="file"
          style="display: none"
          ref="afInputRef"
          :onChange="() => onInputChange('af')"
          accept=".dfsu"
          multiple
        />
      </t-card>
    </header>

    <div class="flex gap-2 justify-evenly">
      <t-button
        class="min-w-[250px]"
        :theme="formDataList[currtFormDataId].beDfsuInfo.md5 ? 'success' : 'danger'"
        :onClick="() => onUploadBtnClick('be')"
        :disabled="
          !Boolean(
            formDataList[currtFormDataId].beDfsuInfo.progress == 0 ||
              formDataList[currtFormDataId].beDfsuInfo.progress == 100,
          )
        "
      >
        选择dfsu文件
      </t-button>

      <t-button :on-click="switchf">
        反转
        <template #icon>
          <c-icon-font iconName="huifu" class="mr-2"></c-icon-font>
        </template>
      </t-button>

      <t-button
        class="min-w-[250px]"
        :theme="formDataList[currtFormDataId].afDfsuInfo.md5 ? 'success' : 'danger'"
        :onClick="() => onUploadBtnClick('af')"
        :disabled="
          !Boolean(
            formDataList[currtFormDataId].afDfsuInfo.progress == 0 ||
              formDataList[currtFormDataId].afDfsuInfo.progress == 100,
          )
        "
      >
        选择dfsu文件
      </t-button>
    </div>

    <footer :class="['flex-grow-[1]']">
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
    </footer>
  </section>
</template>

<script setup lang="ts">
// import DfsuUpload from "../_components/dfsuUpload.vue"
import { uploadFile } from "../api"
import { splitFileToSmallChunks, getMd5 } from "@renderer/utils/calculateMd5"
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

// const beDfsuInfo = formDataList.value[currtFormDataId.value].beDfsuInfo
// const afDfsuInfo = formDataList.value[currtFormDataId.value].afDfsuInfo

// const beDfsuInfo = formDataList[currtFormDataId.value].beDfsuInfo
// const afDfsuInfo = formDataList[currtFormDataId.value].afDfsuInfo

async function switchf() {
  const temp = Object.assign({}, formDataList.value[currtFormDataId.value].beDfsuInfo)
  Object.assign(
    formDataList.value[currtFormDataId.value].beDfsuInfo,
    formDataList.value[currtFormDataId.value].afDfsuInfo,
  )
  Object.assign(formDataList.value[currtFormDataId.value].afDfsuInfo, temp)

  console.log(formDataList.value[currtFormDataId.value])
  // console.log(formDataList[currtFormDataId.value])
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
  if (files.length >= 2) infoList.push(formDataList.value[currtFormDataId.value].afDfsuInfo)

  await readFiles(files, infoList)
}

async function readFiles(files: File[], infoList: any[]) {
  const count = infoList.length
  
  for (let index = 0; index < count; index++) {
    const file = (files as File[])[index]

    infoList[index].size = file.size / 1024 / 1024
    infoList[index].name = file.name
    infoList[index].path = file.path.toString()

    infoList[index].progress = 0
    const chunks = await splitFileToSmallChunks(file)
    infoList[index].md5 = await getMd5(chunks, infoList[index].progress)
    infoList[index].progress = 100

    const _fromData = new FormData()
    _fromData.append("filename", `${infoList[index].md5}.dfsu`)
    _fromData.append("file", file)

    await uploadFile(_fromData)
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
