import SparkMD5 from "spark-md5"
import type { Ref } from "vue"
/**
 * @description: 将大文件进行分割抽离特征再计算md5，加快计算
 */
export async function splitFileToSmallChunks(file: File) {
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
 * @param {Blob} chunks 分格成多个小块的文件对象，如果需要准确完整的md5，本函数不合适
 * @param {Ref} progressRef 记录进度的一个响应式变量
 * @return {*}
 */
export async function getMd5(chunks: Blob[], progressRef?: Ref<number>) {
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

    if (progressRef) {
      progressRef.value += 100 / chunks.length
    }
  }

  return spark.end()
}
