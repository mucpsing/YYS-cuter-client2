<template>
  <div class="container p-4 mx-auto">
    <div class="my-4 nav">
      <button
        v-for="(phone, index) in phones"
        :key="index"
        class="inline-block px-5 py-2 rounded-full"
        :class="{ 'bg-blue-500 text-white': index === activeIndex }"
        @click="setActiveTab(index)"
      >
        {{ phone.name }}
      </button>
      <button
        class="inline-block px-5 py-2 ml-4 text-white bg-green-500 rounded-full"
        @click="addNewTab"
      >
        Add New Tab
      </button>
    </div>

    <!-- Tabs content -->
    <div
      v-for="(phone, index) in phones"
      :key="index"
      class="p-8 shadow-md rounded-xl"
      :class="{ hidden: index !== activeIndex }"
    >
      <!-- Tab content here -->
      <div class="flex flex-col justify-center w-full">
        <div class="w-full">
          <h2 class="text-2xl font-bold">{{ phone.name }}</h2>
          <p :id="`guide-test__${index}`">{{ index }}</p>
          <!-- Add more content here if needed -->
          <t-button @click="() => test(index)">guide show</t-button>
        </div>
      </div>
    </div>

    <GuideSetp></GuideSetp>
  </div>
</template>

<script setup lang="ts">
import GuideSetp from "@gisapi/_components/guide.vue"
import eventBus from "@renderer/libs/eventBus"

function test(idex: number) {
  eventBus.emit("test-guide", [
    {
      element: `#guide-test__${idex}`,
      title: "测试",
      body: "测试11111111111111111111",
      placement: "bottom-right",
      highlightPadding: 5,
    },
  ])
}
interface Phone {
  id: string
  name: string
  // Add other properties as needed
}

const props = defineProps<{
  initialPhones?: Phone[] // Optional initial phones
}>()

const phones = ref<Phone[]>(props.initialPhones || []) // Use initial phones if provided, otherwise an empty array
const activeIndex = ref(0)

function setActiveTab(index: number) {
  activeIndex.value = index
}

function addNewTab() {
  // Generate a unique ID (simplified for demonstration)
  const newId = `${new Date().getTime()}`
  // Create a new phone object with a default name (can be modified by user)
  const newPhone: Phone = {
    id: newId,
    name: `New Phone ${phones.value.length + 1}`,
    // Add other default properties as needed
  }
  // Add the new phone to the phones array
  phones.value.push(newPhone)
  // Activate the new tab
  setActiveTab(phones.value.length - 1)
}
</script>

<style scoped>
/* Your styles here */
</style>
