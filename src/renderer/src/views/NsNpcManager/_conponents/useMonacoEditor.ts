/*
 * @Author: CPS holy.dandelion@139.com
 * @Date: 2023-09-16 19:43:06
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2023-09-16 19:43:47
 * @FilePath: \YYS-cuter-client2\src\renderer\src\views\NsNpcManager\_conponents\useMonacoEditor.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * 
 * 
 * @example
import { useMonacoEditor } from '@/hooks/useMonacoEditor'
const { monacoRef, initMonaco } = useMonacoEditor()

onMounted(async()=>{
	await initMonaco()
  monacoRef.value.editor.create(document.getElementById('container'), {
  	value: "function hello() {\n\talert('Hello world!');\n}",
  	language: 'javascript'
  });
})
 * 
 */
import loader from "@monaco-editor/loader"
import { ref } from "vue"

const monacoRef = ref<any>(null)
const monacoLoader = loader.init()

const initMonaco = () => {
  return new Promise<void>((resolve, reject) => {
    if (monacoRef.value) {
      resolve()
      return
    }
    monacoLoader
      .then((monacoInstance) => {
        monacoRef.value = monacoInstance
      })
      .catch((error) => {
        if (error?.type !== "cancelation") {
          console.error("Monaco initialization error:", error)
          reject()
        }
      })
  })
}

export function useMonacoEditor() {
  return {
    initMonaco,
    monacoRef,
  }
}
