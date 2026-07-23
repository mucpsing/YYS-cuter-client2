/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2026-07-22 15:05:48
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2026-07-22 15:05:54
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\body\setp2\fileTransfers\useSortableDrag.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// src/renderer/src/composables/useSortableDrag.ts
import Sortable from 'sortablejs'
import { nextTick, onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import type { FileListKeyT } from '@gisapi/Types'

/**
 * 为多个列表容器统一初始化 Sortable 拖拽
 * @param containerRef - 包裹所有 ul 的父容器 ref
 * @param getDataMap - 获取当前数据映射的函数 (返回 Record<listId, FileItem[]>)
 */
export function useSortableDrag(
  containerRef: Ref<HTMLElement | undefined>,
  getDataMap: () => Record<string, any[]>
) {
  const sortableInstances = new Map<string, Sortable>()

  const initAll = () => {
    const container = containerRef.value
    if (!container) return

    // 查找所有作为拖拽列表的 ul 元素（带有 data-list-id 属性）
    const ulElements = container.querySelectorAll<HTMLElement>('ul[data-list-id]')
    ulElements.forEach((ul) => {
      const listId = ul.dataset.listId
      if (!listId) return

      // 避免重复初始化
      if (sortableInstances.has(listId)) {
        return
      }

      const sortable = Sortable.create(ul, {
        group: 'items',
        animation: 150,
        onStart: () => {
          // 可添加拖动开始状态
        },
        onEnd: (e) => {
          const fromId = (e.from as HTMLElement).dataset.listId!
          const toId = (e.to as HTMLElement).dataset.listId!
          const dataMap = getDataMap()

          if (e.newIndex == null || e.oldIndex == null) return

          if (fromId === toId) {
            // 同列表内移动
            const list = dataMap[fromId]
            const [moved] = list.splice(e.oldIndex, 1)
            list.splice(e.newIndex, 0, moved)
          } else {
            // 跨列表移动
            const fromList = dataMap[fromId]
            const toList = dataMap[toId]
            const [moved] = fromList.splice(e.oldIndex, 1)
            if (!moved) return

            // 重置选中状态
            moved.checked = false
            moved.disabled = false

            toList.splice(e.newIndex, 0, moved)

            // 如果源列表只剩一项，取消其选中状态
            if (fromList.length === 1) {
              fromList[0].checked = false
              fromList[0].disabled = false
            }
          }
        },
      })

      sortableInstances.set(listId, sortable)
    })
  }

  const destroyAll = () => {
    sortableInstances.forEach((instance) => instance.destroy())
    sortableInstances.clear()
  }

  // 生命周期：挂载时初始化，卸载时销毁
  onMounted(() => {
    nextTick(initAll)
  })

  onBeforeUnmount(destroyAll)

  // 提供重新初始化方法（当列表动态增减时调用）
  const reInit = () => {
    destroyAll()
    nextTick(initAll)
  }

  return {
    reInit,
    destroyAll,
  }
}