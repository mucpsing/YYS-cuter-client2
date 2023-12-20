<template>
  <section :class="['flex flex-col w-full gap-2', 'flex-grow-[2]', 'bg-sky-100 rounded-md p-2']">
    <div class="flex justify-between">
      <t-input-adornment prepend="输出名称：">
        <t-select-input
          :value="formDataList[currtFormDataId].title"
          :popup-visible="popupVisible"
          :popup-props="{ overlayInnerStyle: { padding: '0px' } }"
          placeholder="点击列出常用命名推荐"
          allow-input
          clearable
          style="min-width: 200px"
          @input-change="onTitleChange"
          @popup-visible-change="(val) => (popupVisible = val)"
        >
          <template #panel>
            <ul class="">
              <li
                class="p-1 cursor-pointer hover:bg-gray-200"
                v-for="item in options"
                :key="item"
                @click="() => onTitleWithPopupChange(item)"
              >
                {{ item }}
              </li>
            </ul>
          </template>
        </t-select-input>
      </t-input-adornment>

      <t-button class="w-[120px]" size="medium"
        >{{
          formDataList[currtFormDataId].mxdName
            ? formDataList[currtFormDataId].mxdName
            : "当前未选择"
        }}
        <template #icon>
          <c-icon-font
            iconName="icon-yys-open"
            :rotate="180"
            color="white"
            :class="['text-white mr-2']"
          ></c-icon-font
        ></template>
      </t-button>
    </div>

    <!-- 父级元素可被撑开 -->
    <section :class="['parent', 'h-full', 'flex flex-col']">
      <div class="w-full h-0 flex-grow-[2]">
        <!-- 设置了height 0 的元素内部元素要设置可以滚动 -->
        <div class="h-full overflow-auto">
          <!-- 这里的子元素是动态获取，最终导致父级元素被撑开，无法完全使用合适的动态高度 -->
          <!-- 多包一层div是因为button使用flex后内容的布局特性不能跟div一样，所以这里套多一层 -->
          <div
            :class="['p-1 my-2']"
            v-for="(item, idx) of templateInfo"
            :key="idx"
            @click="() => clickHandler(item)"
          >
            <!-- 这里使用button是为了可以对已选择模板固定一个样式 -->
            <!-- 样式通过 focus: 来实现已选状态记录 -->
            <button
              :class="[
                'w-full px-2',
                'h-[150px]  bg-white  rounded-md',
                'flex items-center gap-4',
                'outline outline-offset-2 outline-1 outline-blue-100',
                'focus:outline-red-400 focus:outline-2',
                'hover:outline-blue-500 hover:outline-2',
                'hover:cursor-pointer',
              ]"
            >
              <img
                :src="item.preview"
                :class="['object-cover max-h-[100px]']"
                alt="请选择一个要导出的类型"
              />

              <div :class="['flex flex-col justify-start items-start']">
                <span>
                  <strong>{{ `${item.template_id} - ${item.template_name}` }}</strong>
                </span>
                <p class="text-left">{{ item.description }}</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { templateInfo, keyWord, data } from "../store/data"
import { currtFormDataId, currtTemplateId, formDataList } from "../store/state"

onMounted(() => {
  console.log("创建1")

  // 请求数据
})

const options = ref(keyWord) // 提示词列表
const popupVisible = ref(false) // 是否显示提示列表的状态

/**
 * @description: 选择模板的处理函数
 */
const clickHandler = (item) => {
  if (item.template_id) {
    currtTemplateId.value = item.template_id
    formDataList.value[currtFormDataId.value].mxdId = item.template_id
    formDataList.value[
      currtFormDataId.value
    ].mxdName = `${item.template_id} - ${item.template_name} `
  }
}

/**
 * @description: 输入新标题时，同步tab标题显示的函数
 */
async function onTitleChange(newTitle: string) {
  formDataList.value[currtFormDataId.value].title = newTitle
  data.value[currtFormDataId.value].label = newTitle
}

/**
 * @description: 选择了常用后缀的触发函数
 */
async function onTitleWithPopupChange(new_popup: string) {
  let newTitle: string
  if (formDataList.value[currtFormDataId.value].title == "") {
    newTitle = new_popup
  } else {
    newTitle = `${formDataList.value[currtFormDataId.value].title}_${new_popup}`
  }

  formDataList.value[currtFormDataId.value].title = newTitle
  data.value[currtFormDataId.value].label = newTitle
  popupVisible.value = false
}
</script>

<style scoped></style>
