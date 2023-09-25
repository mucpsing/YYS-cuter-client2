<template>
  <section
    :class="['flex flex-row w-full gap-2', 'flex-grow-[2]', 'rounded-xl p-2 whitespace-nowrap']"
  >
    <div class="h-full flex-grow-[1] left bg-gray-100 rounded-md overflow-auto">
      <div class="py-2 pl-3 pr-4 h-[0]">
        <!-- --------------- 【 工程范围 】 --------------- -->
        <div class="flex items-center justify-between mt-2">
          <div class="flex flex-col items-start justify-between">
            <h2 class="SwiperSetp__h2">
              <strong
                >工程范围
                <t-tag theme="danger" size="small" variant="light-outline"
                  >仅支持支持<strong>面shp文件</strong></t-tag
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
              <span
                ><strong>文件路径：</strong
                >{{ formDataList[currtFormDataId].projectRange.path }}</span
              >
            </p>
            <p>
              <span
                ><strong>文件数量：</strong
                >{{ formDataList[currtFormDataId].projectRange.fileCount }}
              </span>
            </p>
            <p class="flex gap-2">
              <strong>完整shp列表：</strong>
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
            <t-button :onClick="onInputClick" theme="danger" variant="outline">
              <template #icon>
                <cps-icon-font iconName="icon-yys-folder-opened" class="mr-2" />
              </template>

              {{ formDataList[currtFormDataId].projectRange.name || "选择.shp文件" }}</t-button
            >
          </div>
        </div>
        <t-divider class="my-2"></t-divider>

        <input
          ref="projectRangeRef"
          type="file"
          style="display: none"
          accept=".cpg,.dbf,.sbn,.sbx,.shp,.shx,.shp.xml"
          multiple
          :onChange="onInputChange"
        />

        <!-- --------------- 【 河道选择 】 --------------- -->
        <div class="flex items-center justify-between mt-2">
          <div class="flex flex-col items-start justify-between">
            <h2 class="SwiperSetp__h2"><strong>河道选择</strong></h2>
            <p>
              使用哪个工况的河道作为模板河道：
              <t-tag
                class="cursor-pointer"
                variant="light-outline"
                theme="primary"
                :onclick="() => (formDataList[currtFormDataId].riverRange = '工程前')"
                >工程前</t-tag
              >
              、
              <t-tag
                class="cursor-pointer"
                variant="light-outline"
                theme="danger"
                :onclick="() => (formDataList[currtFormDataId].riverRange = '工程后')"
                >工程后</t-tag
              >
            </p>
          </div>
          <div class="flex gap-1">
            <t-dropdown
              :options="[
                { content: `工程前`, value: `工程前` },
                { content: `工程后`, value: `工程后` },
              ]"
              @click="(item) => (formDataList[currtFormDataId].riverRange = item.value)"
            >
              <t-button variant="outline" theme="success">{{
                formDataList[currtFormDataId].riverRange
              }}</t-button>
            </t-dropdown>
          </div>
        </div>
        <t-divider class="my-2"></t-divider>

        <!-- --------------- 【 模型数据 】 --------------- -->
        <div class="flex items-center justify-between mt-2">
          <div class="flex flex-col items-start justify-between">
            <h2 class="SwiperSetp__h2"><strong>网格间距</strong></h2>
            <p>河道数据点的间距（后期自动根据河道自动识别）</p>
          </div>
          <div class="flex gap-1">
            <t-input placeholder="25" class="w-[100px]" align="center"></t-input>
          </div>
        </div>
        <t-divider class="my-2"></t-divider>

        <!-- --------------- 【 流速范围 】 --------------- -->
        <div class="flex items-center justify-between mt-2">
          <div class="flex flex-col items-start justify-between">
            <h2 class="SwiperSetp__h2"><strong>流速范围</strong></h2>
            <p class="max-w-[80%]">
              大于这个长度的流速等值线才会被标注流速关系字段（不变，增大，减少）
            </p>
          </div>
          <div class="flex gap-1">
            <t-input placeholder="200" class="w-[100px]" align="center"></t-input>
          </div>
        </div>
        <t-divider class="my-2"></t-divider>

        <!-- --------------- 【 等值线序列 】 --------------- -->
        <div class="flex items-center justify-between mt-2">
          <div class="flex flex-col w-full gap-1">
            <h2 class="SwiperSetp__h2"><strong>等值线序列</strong></h2>
            <p class="max-w-[90%]">自定义等值线步进，使用分号 ";" 分割每个步进</p>
            <t-input
              v-model="counterSetp"
              :placeholder="defaultCounterSetp"
              class="w-[100%] text-sm"
              type="text"
              align="center"
            ></t-input>
          </div>
        </div>
        <t-divider class="my-2"></t-divider>
      </div>
    </div>

    <!-- <div class="h-full min-w-[450px] flex-grow-[999] right"></div> -->
  </section>
</template>

<script setup lang="ts">
import { formDataList, currtFormDataId } from "../store/state"
import { uploadFile } from "../api"
import path from "path-browserify"
import { getMd5 } from "@renderer/utils/calculateMd5"

const riverSelect = ref("工程后")
const projectRangeRef = ref<HTMLInputElement>()
const projectShpList = ref<string[]>([])

async function onInputClick() {
  if (!projectRangeRef || !projectRangeRef.value) return
  if (projectRangeRef.value.value) projectRangeRef.value.value = ""

  projectRangeRef.value.click()
}

async function onInputChange(e: Event) {
  if (!projectRangeRef || !projectRangeRef.value) return console.log("input元素获取失败")
  if (!projectRangeRef.value.files) return console.log("input为空，不执行上传")

  const files = projectRangeRef.value.files
  if (files.length == 0) return

  const uploadBodyList: { file: File; ext: string }[] = []
  projectShpList.value.length = 0

  for (let file of files) {
    // 识别shp文件
    let ext = path.extname(file.name)
    if (file.name.endsWith(".shp.xml")) ext = ".shp.xml"

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

  console.log(uploadBodyList)
  console.log(uploadBodyList.map((item) => ({ filename: `${md5}${item.ext}`, file: item.file })))
  // await readFiles(files, infoList)
}

// const projectRangeFile

const defaultCounterSetp =
  "0.01;-0.01;0.03;-0.03;0.05;-0.05;0.1;-0.1;0.15;-0.15;0.2;-0.2;0;-0.3;0.3"
const counterSetp = ref("")

const outputPojectMode = ref("选择类型")
</script>

<style lang="stylus">
.SwiperSetp__h2{
  @apply text-xl text-slate-600 pb-1
}
</style>
