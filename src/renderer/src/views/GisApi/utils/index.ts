/**
 * 截断文本
 *
 * @param text 待截断的文本
 * @param maxLength 截断后的最大长度
 * @returns 截断后的文本，如果原始文本长度小于等于最大长度，则返回原始文本；否则返回前 maxLength-3 个字符加上 "..."
 */
export function truncateText(text: string, maxLength: number = 30): string {
  if (text.length <= maxLength) {
    return text
  }
  return text.substring(0, maxLength - 3) + "..."
}

/**
 * @description: 创建TD按钮的彩虹色列表用到的数据对象,当前仅支持5*4的标签数量，既20个
 * @return {*}
 */
export function crossCombineThemesAndVariants(
  themeList: string[] = ["primary", "warning", "danger", "success"],
  variantList: string[] = ["dark", "light", "outline", "light-outline"],
): { theme: string; variant: string }[] {
  return variantList.flatMap((variant) => themeList.map((theme) => ({ theme, variant })))
}
