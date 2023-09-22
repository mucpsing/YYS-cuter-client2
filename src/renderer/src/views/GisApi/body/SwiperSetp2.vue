<template>
  <section :class="['flex flex-col w-full gap-2', 'flex-grow-[2]', 'rounded-xl p-2']">
    <!-- --------------- 【 工程前后的数据文件上传 】 --------------- -->
    <header :class="['flex-grow-[1]', 'flex gap-2', 'min-h-[150px] flex-or']">
      <t-card :class="['flex-grow-[1]']" title="工程前 - DFSU文件信息">
        <div :class="['flex justify-start']">
          <div class="flex flex-col text-gray-500">
            <h3 class="my-1 text-lg text-black"><strong>文件名：</strong>{{ beDfsuInfo.name }}</h3>
            <p>文件路径：{{ beDfsuInfo.path }}</p>
            <span>文件大小：{{ beDfsuInfo.size.toFixed(2) }} MB</span>
            <span>解析进度：{{ beDfsuInfo.progress.toFixed(2) }}<strong>%</strong></span>
            <span>上传名称：{{ beDfsuInfo.md5 }}.dfsu</span>
          </div>
        </div>

        <input
          type="file"
          style="display: none"
          ref="beInputRef"
          :onChange="() => onInputChange('be')"
          accept=".dfsu"
        />
      </t-card>

      <t-card :class="['flex-grow-[1]']" title="工程后 - DFSU文件信息">
        <div :class="['flex justify-start']">
          <div class="flex flex-col text-gray-500">
            <h3 class="my-1 text-lg text-black"><strong>文件名：</strong>{{ afDfsuInfo.name }}</h3>
            <p>文件路径：{{ afDfsuInfo.path }}</p>
            <span>文件大小：{{ afDfsuInfo.size.toFixed(2) }} MB</span>
            <span>解析进度：{{ afDfsuInfo.progress.toFixed(2) }}<strong>%</strong></span>
            <span>上传名称：{{ afDfsuInfo.md5 }}.dfsu</span>
          </div>
        </div>
        <input
          type="file"
          style="display: none"
          ref="afInputRef"
          :onChange="() => onInputChange('af')"
          accept=".dfsu"
        />
      </t-card>
    </header>

    <div class="flex gap-2 justify-evenly">
      <t-button
        class="min-w-[250px]"
        :theme="beDfsuInfo.md5 ? 'success' : 'danger'"
        :onClick="() => onUploadBtnClick('be')"
        :loading="!Boolean(beDfsuInfo.progress == 0 || beDfsuInfo.progress == 100)"
        :disabled="!Boolean(beDfsuInfo.progress == 0 || beDfsuInfo.progress == 100)"
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
        :theme="afDfsuInfo.md5 ? 'success' : 'danger'"
        :onClick="() => onUploadBtnClick('af')"
        :loading="!Boolean(afDfsuInfo.progress == 0 || afDfsuInfo.progress == 100)"
        :disabled="!Boolean(afDfsuInfo.progress == 0 || afDfsuInfo.progress == 100)"
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

const outputExt = ref(".jpg")
const outputFloodMode = ref("选择类型")
const outputPojectType = ref("选择工况")
const beInputRef = ref<HTMLInputElement>()
const afInputRef = ref<HTMLInputElement>()

const beDfsuInfo = reactive({
  md5: "",
  progress: 0,
  size: 0,
  path: "",
  name: "",
})

const afDfsuInfo = reactive({
  md5: "",
  progress: 0,
  size: 0,
  path: "",
  name: "",
})

async function switchf() {
  const temp = Object.assign({}, beDfsuInfo)
  Object.assign(beDfsuInfo, afDfsuInfo)
  Object.assign(afDfsuInfo, temp)
}

async function onUploadBtnClick(target: "af" | "be") {
  let inputRef
  switch (target) {
    case "be":
      inputRef = beInputRef
      break

    case "af":
      inputRef = afInputRef

      break

    default:
      return
  }

  if (inputRef.value.value) inputRef.value.value = ""

  inputRef.value.click()
}

async function onInputChange(target: "af" | "be") {
  let inputRef, info

  console.log("onInputChange", target)

  switch (target) {
    case "be":
      inputRef = beInputRef
      info = beDfsuInfo
      break

    case "af":
      inputRef = afInputRef
      info = afDfsuInfo
      break

    default:
      return
  }
  console.log("onInputChange1")

  if (!inputRef || !inputRef.value) return console.log("input元素获取失败")
  if (!inputRef.value.files) return console.log("input为空，不执行上传")

  const file = inputRef.value.files[0]
  console.log(file)

  info.size = file.size / 1024 / 1024
  info.name = file.name
  info.path = file.path.toString()

  // 文件分块和md5生成
  info.progress = 0
  const chunks = await splitFileToSmallChunks(file)
  info.md5 = await getMd5(chunks, info.progress)
  info.progress = 100

  const _fromData = new FormData()
  _fromData.append("filename", `${info.md5}.dfsu`)
  _fromData.append("file", file)

  // 不一定需要更新，往父组件回传这个formData
  await uploadFile(_fromData)
}
</script>

<style scoped></style>
