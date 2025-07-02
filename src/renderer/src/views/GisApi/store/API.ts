export const API = {
  getTemplateList: "/mxd_template_list",
  upload: "/upload_file", // 上传文件，dfsu、shp（使用压缩包形式）
  uploadCheck: "/check_file_exists",
  mxdToImg: "/mxd_to_img",
  getProjectRange: "/get_project_range", // 生成工程范围，可能会失败，需要网格一致
  test: "/serverCheck",
  iGeometryDifference: "/polygon_difference_by_md5", // 计算两个几何多边形的差值
}

export default API
