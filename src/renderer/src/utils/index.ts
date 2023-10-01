import { Ref } from "vue"

export async function onInputClick(inputRef: Ref<HTMLInputElement>) {
  if (!inputRef || !inputRef.value) return
  if (inputRef.value.value) inputRef.value.value = ""

  inputRef.value.click()
}
