<template>  
  <div class="paper" :style="{ width: paperWidth + 'px', height: paperHeight + 'px' }">  
    <div class="fold" :style="{ bottom: foldBottom + 'px', right: foldRight + 'px' }"></div>  
  </div>  
</template>  
  
<script lang="ts">  
import { ref } from 'vue';  
  
export default {  
  setup() {  
    // A4纸张尺寸（转换为像素，假设1mm = 3.78px）  
    const paperWidth = ref(1118); // 297mm * 3.78px/mm  
    const paperHeight = ref(804); // 210mm * 3.78px/mm  
  
    // 折叠角的尺寸和位置  
    const foldSize = ref(100); // 折叠角的大小  
    const foldBottom = ref(-50); // 折叠角底部偏移  
    const foldRight = ref(-50); // 折叠角右侧偏移  
  
    // 如果需要，你可以在这里添加逻辑来动态改变这些值  
  
    return {  
      paperWidth,  
      paperHeight,  
      foldSize, // 注意：虽然foldSize在样式中未直接使用，但可以在其他地方使用  
      foldBottom,  
      foldRight,  
    };  
  },  
};  
</script>  
  
<style scoped>  
.paper {  
  position: relative;  
  background-color: white;  
  border: 1px solid #ccc;  
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);  
}  
  
.fold {  
  position: absolute;  
  width: 100px; /* 或者使用 foldSize.value，但这里为了简单直接写死了 */  
  height: 100px;  
  background-color: white;  
  border-left: 1px solid #ccc;  
  border-top: 1px solid #ccc;  
  transform: rotate(45deg);  
  transform-origin: 100% 100%;  
  box-shadow: -2px -2px 5px rgba(0, 0, 0, 0.2);  
  z-index: -1;  
}  
</style>