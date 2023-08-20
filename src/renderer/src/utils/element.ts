// 获取元素的padding和margin偏移量
export function getPaddingAndMarginOffsets(target: HTMLElement | string) {
  let element = {} as HTMLElement;
  if (typeof target == "string") {
    element = document.getElementById(target) as HTMLElement;
  } else {
    element = target;
  }

  // 获取元素的样式
  const styles = window.getComputedStyle(element);

  // 提取上、左、右、下方向的padding值并转换为数值
  const paddingTop = parseInt(styles.paddingTop || "0", 10);
  const paddingLeft = parseInt(styles.paddingLeft || "0", 10);
  const paddingRight = parseInt(styles.paddingRight || "0", 10);
  const paddingBottom = parseInt(styles.paddingBottom || "0", 10);

  // 提取上、左、右、下方向的margin值并转换为数值
  const marginTop = parseInt(styles.marginTop || "0", 10);
  const marginLeft = parseInt(styles.marginLeft || "0", 10);
  const marginRight = parseInt(styles.marginRight || "0", 10);
  const marginBottom = parseInt(styles.marginBottom || "0", 10);

  // 计算上、左、右、下方向的偏移量并返回
  const topOffset = paddingTop + marginTop;
  const leftOffset = paddingLeft + marginLeft;
  const rightOffset = paddingRight + marginRight;
  const bottomOffset = paddingBottom + marginBottom;

  // 获取元素的高度和宽度
  const height = element.offsetHeight;
  const width = element.offsetWidth;

  const { x, y } = element.getBoundingClientRect();

  return {
    topOffset,
    leftOffset,
    rightOffset,
    bottomOffset,
    height,
    width,
    x,
    y,
  };
}
