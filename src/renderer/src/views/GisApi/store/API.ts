/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2025-07-02 16:00:28
 * @LastEditors: cpasion-office-win10 373704015@qq.com
 * @LastEditTime: 2025-08-11 10:20:51
 * @FilePath: \yys-cuter-client2\src\renderer\src\views\GisApi\store\API.ts
 * @Description: 接口管理，注释每个接口
 */
export const API = {
  getTemplateList: "/gisArcMapApi/v1/mxd_template_list",
  upload: "/gisArcMapApi/v1/upload_file", // 上传文件，dfsu、shp（使用压缩包形式）
  uploadCheck: "/gisArcMapApi/v1/check_file_exists",
  mxdToImg: "/gisArcMapApi/v1/mxd_to_jpg_by_md5",
  mxdToImgByTask: "/gisArcMapApi/v1/mxd_to_jpg_by_md5_task",
  iGeometryDifference: "/gisArcMapApi/v1/polygon_difference_by_md5", // 计算两个几何多边形的差值
  test: "/gisArcMapApi/v1/server_check",
  getTaskById: "/get_task_by_id",
  getAllTask: "/get_all_task",
  taskTest: "/test_task",
}

export default API
