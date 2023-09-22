<template>
  <section :class="['flex flex-col w-full gap-2', 'flex-grow-[2]', 'bg-sky-600 rounded-xl p-2']">
    <!-- --------------- 【 工程前后的数据文件上传 】 --------------- -->
    <header :class="['flex-grow-[1]', 'flex gap-2', 'min-h-[250px]']">
      <t-card class="flex-grow-[1]" title="工程前 - DFSU文件">
        <div :class="['flex justify-start']">
          <div class="flex flex-col text-gray-500">
            <h3 class="my-1 text-lg text-black"><strong>文件名：</strong>{{ beDfsuInfo.name }}</h3>
            <p>文件路径：{{ beDfsuInfo.path }}</p>
            <span>文件大小：{{ beDfsuInfo.size.toFixed(2) }} MB</span>
            <span>解析进度：{{ beDfsuInfo.progress.toFixed(2) }}<strong>%</strong></span>
            <span>上传名称：{{ beDfsuInfo.md5 }}.dfsu</span>
          </div>
        </div>

        <div class="absolute bottom-0 left-0 flex justify-center w-full pb-2">
          <t-button
            class="min-w-[250px]"
            theme="danger"
            :onClick="uploadHandler"
            :loading="!Boolean(beDfsuInfo.progress == 0 || beDfsuInfo.progress == 100)"
            :disabled="!Boolean(beDfsuInfo.progress == 0 || beDfsuInfo.progress == 100)"
          >
            上传dfsu文件
          </t-button>
        </div>
        <input
          type="file"
          style="display: none"
          ref="beInputRef"
          :onChange="onInputChange"
          accept=".dfsu"
        />
      </t-card>

      <t-card class="flex-grow-[1]" title="工程后 - DFSU文件">
        <div :class="['flex justify-start']">
          <div class="flex flex-col text-gray-500">
            <h3 class="my-1 text-lg text-black"><strong>文件名：</strong>{{ beDfsuInfo.name }}</h3>
            <p>文件路径：{{ afDfsuInfo.path }}</p>
            <span>文件大小：{{ afDfsuInfo.size.toFixed(2) }} MB</span>
            <span>解析进度：{{ afDfsuInfo.progress.toFixed(2) }}<strong>%</strong></span>
            <span>上传名称：{{ afDfsuInfo.md5 }}.dfsu</span>
          </div>
        </div>

        <div class="absolute bottom-0 left-0 flex justify-center w-full pb-2">
          <t-button
            class="min-w-[250px]"
            theme="danger"
            :onClick="uploadHandler"
            :loading="!Boolean(afDfsuInfo.progress == 0 || afDfsuInfo.progress == 100)"
            :disabled="!Boolean(afDfsuInfo.progress == 0 || afDfsuInfo.progress == 100)"
          >
            上传dfsu文件
          </t-button>
        </div>
        <input
          type="file"
          style="display: none"
          ref="afInputRef"
          :onChange="onInputChange"
          accept=".dfsu"
        />
      </t-card>
    </header>

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

async function uploadHandler(_e: Event) {
  if (!inputRef || !inputRef.value) return console.log("input元素获取失败")

  if (inputRef.value.value) inputRef.value.value = ""

  inputRef.value.click()
}

async function onInputChange(_e: HTMLInputElement) {
  if (!inputRef || !inputRef.value) return console.log("input元素获取失败")
  if (!inputRef.value.files) return console.log("input为空，不执行上传")

  const file = inputRef.value.files[0]

  currtFileSize.value = file.size / 1024 / 1024
  currtFileName.value = file.name
  currtFilePath.value = file.path.toString()

  // 文件分块和md5生成
  progress.value = 0
  const chunks = await splitFileToSmallChunks(file)
  currtMd5.value = await getMd5(chunks, progress)
  progress.value = 100

  const _fromData = new FormData()
  _fromData.append("filename", `${currtMd5.value}.dfsu`)
  _fromData.append("file", file)

  // 不一定需要更新，往父组件回传这个formData
  await uploadFile(_fromData)
}
</script>

<style scoped></style>
