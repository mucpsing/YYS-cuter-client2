<template>
  <t-card class="flex-grow-[1]" :title="props.title">
    <div :class="['flex justify-start']">
      <div class="flex flex-col text-gray-500">
        <h3 class="my-1 text-lg text-black"><strong>文件名：</strong>{{ currtFileName }}</h3>
        <p>文件路径：{{ currtFilePath }}</p>
        <span>文件大小：{{ currtFileSize.toFixed(2) }} MB</span>
        <span>解析进度：{{ progress.toFixed(2) }}<strong>%</strong></span>
        <span>上传名称：{{ currtMd5 }}.dfsu</span>
      </div>
    </div>

    <div class="absolute bottom-0 left-0 flex justify-center w-full pb-2">
      <t-button
        class="min-w-[250px]"
        theme="danger"
        :onClick="uploadHandler"
        :loading="!Boolean(progress == 0 || progress == 100)"
        :disabled="!Boolean(progress == 0 || progress == 100)"
      >
        上传dfsu文件
      </t-button>
    </div>
    <input
      type="file"
      style="display: none"
      ref="inputRef"
      :onChange="onInputChange"
      accept=".dfsu"
    />
  </t-card>
</template>

<script setup lang="ts">
import { uploadFile } from "../api"
import SparkMD5 from "spark-md5"

const currtMd5 = ref("")
const inputRef = ref<HTMLInputElement>()
const progress = ref(0)
const currtFileSize = ref(0)
const currtFileName = ref("")
const currtFilePath = ref("")

const props = withDefaults(
  defineProps<{
    title?: string
  }>(),
  {
    title: "dfsu文件",
  },
)

/**
 * @description: 将大文件进行分割抽离特征再计算md5，加快计算
 */
async function splitFileToSmallChunks(file: File) {
  const offset = 2 * 1024 * 1024
  // hash抽样: 第一个区块2M，中间区块取前中后各2个字节，最后区块数据全要
  let chunks = [file.slice(0, offset)] //抽样后的区块
  let cur = offset

  while (cur < file.size) {
    if (cur + offset >= file.size) {
      chunks.push(file.slice(cur, cur + offset))
    } else {
      const mid = cur + offset / 2,
        end = cur + offset
      chunks.push(file.slice(cur, cur + 2))
      chunks.push(file.slice(mid, mid + 2))
      chunks.push(file.slice(end - 2, end))
    }
    cur += offset
  }

  return chunks
}

/**
 * @description:
 * @param {*} chunks 分格成多个小块的文件对象，如果需要准确完整的md5，本函数不合适
 * @return {*}
 */
async function getMd5(chunks: Blob[]) {
  const spark = new SparkMD5.ArrayBuffer()

  for (let index = 0; index < chunks.length; index++) {
    const reader = new FileReader()
    reader.readAsArrayBuffer(chunks[index])
    await new Promise((resolve) => {
      reader.onload = async (e) => {
        if (!e || !e.target) return console.log("发生异常")
        spark.append(e.target.result as ArrayBuffer)
        resolve(spark)
      }
    })

    progress.value += 100 / chunks.length
  }

  return spark.end()
}

async function uploadHandler(_e: Event) {
  if (!inputRef || !inputRef.value) return console.log("input元素获取失败")

  if (inputRef.value.value) inputRef.value.value = ""

  inputRef.value.click()
}

async function onInputChange(_e: HTMLInputElement) {
  if (!inputRef || !inputRef.value) return console.log("input元素获取失败")
  if (!inputRef.value.files) return console.log("input为空，不执行上传")

  const file = inputRef.value.files[0]

  console.log(file)
  currtFileSize.value = file.size / 1024 / 1024
  currtFileName.value = file.name
  currtFilePath.value = file.path.toString()

  // 文件分块和md5生成
  progress.value = 0
  const chunks = await splitFileToSmallChunks(file)
  currtMd5.value = await getMd5(chunks)
  progress.value = 100

  const _fromData = new FormData()
  _fromData.append("filename", `${currtMd5.value}.dfsu`)
  _fromData.append("file", file)

  // 不一定需要更新，往父组件回传这个formData
  await uploadFile(_fromData)
}
</script>

<style scoped></style>
