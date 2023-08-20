/**
 * @Description - 将字符串格式的rgb转换成hex格式
 *
 * @param {string} rgbColor  - CSS样式中颜色格式`rgb(xx,xx,xx)`
 *
 * @returns {string } - 16进制颜色格式`"#xxxxxx"`
 * @example
 * ```js
 * const testColor = 'rgba(223, 41, 210, 0.50)';
 * let hex = rgb2hex(testColor); // #DF29D280
 * ```
 */
export function rgb2hex(rgbColor: string): string {
  const startReg = /^rgba?\(/;
  const end = ")";
  rgbColor = rgbColor.replaceAll(" ", "");

  if (!startReg.test(rgbColor) && !rgbColor.endsWith(end)) return rgbColor;

  const colorList = rgbColor.replace(startReg, "").replace(")", "").split(",");

  let res = "#";
  /* 确保只转换 r g b ， a保留*/
  for (let i = 0; i <= 3; i++) {
    if (i < 3) {
      const hexadecimal = parseInt(colorList[i] as string).toString(16);
      res += hexadecimal.length == 1 ? "0" + hexadecimal : hexadecimal;
    } else {
      const hexadecimal = Math.round(parseFloat(colorList[i]) * 255).toString(
        16
      );
      res += hexadecimal;
    }
  }

  return res.toUpperCase();
}

/**
 * @Description - 将16进制的颜色转换成rgb格式，仅支持6位的颜色
 *
 * @param {string} hexColor  - 16进制颜色格式支持4位，7位，和9位
 *
 * @returns {string } - CSS样式中颜色格式`rgba(r,g,b)`
 * @example
 * ```js
 * const testColor = '#DF29D280';
 * let rgba = hex2rgb(testColor);
 * // rgba(223, 41, 210, 0.50)
 * ```
 *
 */
export function hex2rgb(hexColor: string): string {
  if (!hexColor.startsWith("#")) return hexColor;

  if (![7, 9, 4].includes(hexColor.length)) return hexColor;

  const colorList = hexColor.split("");
  let a: string | number;
  switch (hexColor.length) {
    case 9:
      // 计算透明度
      a = (parseInt(`${colorList[7]}${colorList[8]}`, 16) / 255).toFixed(2);
      break;
    case 7:
      a = "1";
      break;
    case 4:
      hexColor = `${colorList[0]}${colorList[1]}${colorList[1]}${colorList[2]}${colorList[2]}${colorList[3]}${colorList[3]}`;
      a = "1";
      break;
    default:
      a = "1";
      break;
  }

  const r = parseInt(`${colorList[1]}${colorList[2]}`, 16);
  const g = parseInt(`${colorList[3]}${colorList[4]}`, 16);
  const b = parseInt(`${colorList[5]}${colorList[6]}`, 16);

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
