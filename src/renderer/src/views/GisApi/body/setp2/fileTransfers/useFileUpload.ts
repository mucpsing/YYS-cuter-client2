// src/renderer/src/composables/useFileUpload.ts
import { ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { useFileStroe, useGisApiTabStore } from '@gisapi/store/index'
import { UP_FILE_ACCEPT_TYPE } from '@gisapi/store/config'
import { uploadFile } from '@gisapi/utils/server'
import type { FileListKeyT } from '@gisapi/Types'

export function useFileUpload() {
  const fileStore = useFileStroe()
  const tabStore = useGisApiTabStore()
  const isUploading = ref(false)

  /**
   * 添加多个文件到指定列表，并自动上传
   * @param files - 文件列表
   * @param targetListKey - 目标列表ID
   * @param onProgress - 可选进度回调 (md5, progress) => void
   * @returns 成功上传的 md5 列表
   */
  const addFiles = async (
    files: File[],
    targetListKey: FileListKeyT,
    onProgress?: (md5: string, progress: number) => void
  ): Promise<string[]> => {
    const uploadedMd5s: string[] = []

    for (const file of files) {
      // 添加文件到 store，获取 md5 等信息
      const fileInfo = await fileStore.addDfsuItem(file)
      if (!fileInfo) {
        MessagePlugin.warning({
          content: '添加文件失败，请检查文件格式是否正确',
          duration: 3000,
          zIndex: 1001,
        })
        continue
      }
      const { md5 } = fileInfo

      // 加入目标列表
      tabStore.addDfsu(targetListKey, md5)

      // 开始上传
      try {
        const uploadResult = await uploadFile(
          file,
          fileInfo,
          (progress: number) => {
            tabStore.updateSelectFileItemByMd5(md5, { uploadProgress: progress })
            if (onProgress) onProgress(md5, progress)
          }
        )

        if (uploadResult && uploadResult.range_geojson) {
          fileStore.geoJsonObj[md5] = uploadResult.range_geojson
          tabStore.updateSelectFileItemByMd5(md5, { uploadProgress: 100 })
          uploadedMd5s.push(md5)
        } else {
          // 上传结果无效，清理数据
          fileStore.removeDataByMd5(md5)
          tabStore.removeDfsu(md5)
        }
      } catch (err) {
        console.warn('上传失败:', err)
        fileStore.removeDataByMd5(md5)
        tabStore.removeDfsu(md5)
      }
    }

    return uploadedMd5s
  }

  /**
   * 移除已选中的文件（批量）
   */
  const removeCheckedItems = (listKey: FileListKeyT) => {
    const list = tabStore.currtFormData[listKey]
    if (!list) return

    const md5ToRemove: string[] = []
    list.forEach((item) => {
      if (item.checked) {
        md5ToRemove.push(item.md5)
      }
    })

    md5ToRemove.forEach((md5) => tabStore.removeDfsu(md5))
  }

  /**
   * 自动选中唯一文件（用于下一步快捷操作）
   */
  const autoCheckSingle = () => {
    for (const key of tabStore.fileListKeys) {
      const list = tabStore.currtFormData[key]
      if (list && list.length === 1) {
        list[0].checked = true
      }
    }
  }

  return {
    isUploading,
    addFiles,
    removeCheckedItems,
    autoCheckSingle,
  }
}