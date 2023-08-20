import fs from "fs";
import fse from "fs-extra";

// export async function tomlDataFormat(dataJson:object){
//   let res = {}
//   Object.keys(dataJson).forEach(key => res[key] = Section(dataJson[key]));
// }

export const sleep = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay));

export async function exportJson(exportPath: string, data: object | string) {
  try {
    if (typeof data == "string") {
      data = JSON.parse(data);
    }

    await fse.writeJson(exportPath, data, { spaces: 2 });

    if (fs.existsSync(exportPath)) return exportPath;

    return "";
  } catch (err) {
    return "";
  }
}

export async function exportFile(exportPath: string, data: string) {
  try {
    return exportPath;
  } catch (err) {
    return "";
  }
}
