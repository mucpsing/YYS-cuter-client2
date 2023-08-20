/*!
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2022-12-06 12:48:25.633958
 * @Last Modified by: CPS
 * @Last Modified time: 2022-12-06 12:48:25.633958
 * @Projectname
 * @file_path "D:\CPS\IDE\JS_SublmieText\Data\Packages\cps-fileheader"
 * @Filename "main.py"
 * @Description: 功能描述
 */

export const MIME_TYPE_LIST = [
  { ext: "json", contentType: "application/json" },
  { ext: "webp", contentType: "image/webp" },
  { ext: "3gp", contentType: "video/3gpp" },
  { ext: "apk", contentType: "application/vndandroidpackage-archive" },
  { ext: "asf", contentType: "video/x-ms-asf" },
  { ext: "avi", contentType: "video/x-msvideo" },
  { ext: "bin", contentType: "application/octet-stream" },
  { ext: "bmp", contentType: "image/bmp" },
  { ext: "c", contentType: "text/plain" },
  { ext: "class", contentType: "application/octet-stream" },
  { ext: "conf", contentType: "text/plain" },
  { ext: "cpp", contentType: "text/plain" },
  { ext: "doc", contentType: "application/msword" },
  {
    ext: "docx",
    contentType:
      "application/vndopenxmlformats-officedocumentwordprocessingmldocument",
  },
  { ext: "xls", contentType: "application/vndms-excel" },
  {
    ext: "xlsx",
    contentType:
      "application/vndopenxmlformats-officedocumentspreadsheetmlsheet",
  },
  { ext: "exe", contentType: "application/octet-stream" },
  { ext: "gif", contentType: "image/gif" },
  { ext: "gtar", contentType: "application/x-gtar" },
  { ext: "gz", contentType: "application/x-gzip" },
  { ext: "h", contentType: "text/plain" },
  { ext: "htm", contentType: "text/html" },
  { ext: "html", contentType: "text/html" },
  { ext: "jar", contentType: "application/java-archive" },
  { ext: "java", contentType: "text/plain" },
  { ext: "jpeg", contentType: "image/jpeg" },
  { ext: "jpg", contentType: "image/jpeg" },
  { ext: "js", contentType: "application/x-javascript" },
  { ext: "log", contentType: "text/plain" },
  { ext: "m3u", contentType: "audio/x-mpegurl" },
  { ext: "m4a", contentType: "audio/mp4a-latm" },
  { ext: "m4b", contentType: "audio/mp4a-latm" },
  { ext: "m4p", contentType: "audio/mp4a-latm" },
  { ext: "m4u", contentType: "video/vndmpegurl" },
  { ext: "m4v", contentType: "video/x-m4v" },
  { ext: "mov", contentType: "video/quicktime" },
  { ext: "mp2", contentType: "audio/x-mpeg" },
  { ext: "mp3", contentType: "audio/x-mpeg" },
  { ext: "mp4", contentType: "video/mp4" },
  { ext: "mpc", contentType: "application/vndmpohuncertificate" },
  { ext: "mpe", contentType: "video/mpeg" },
  { ext: "mpeg", contentType: "video/mpeg" },
  { ext: "mpg", contentType: "video/mpeg" },
  { ext: "mpg4", contentType: "video/mp4" },
  { ext: "mpga", contentType: "audio/mpeg" },
  { ext: "msg", contentType: "application/vndms-outlook" },
  { ext: "ogg", contentType: "audio/ogg" },
  { ext: "pdf", contentType: "application/pdf" },
  { ext: "png", contentType: "image/png" },
  { ext: "pps", contentType: "application/vndms-powerpoint" },
  { ext: "ppt", contentType: "application/vndms-powerpoint" },
  {
    ext: "pptx",
    contentType:
      "application/vndopenxmlformats-officedocumentpresentationmlpresentation",
  },
  { ext: "prop", contentType: "text/plain" },
  { ext: "rc", contentType: "text/plain" },
  { ext: "rmvb", contentType: "audio/x-pn-realaudio" },
  { ext: "rtf", contentType: "application/rtf" },
  { ext: "sh", contentType: "text/plain" },
  { ext: "tar", contentType: "application/x-tar" },
  { ext: "tgz", contentType: "application/x-compressed" },
  { ext: "txt", contentType: "text/plain" },
  { ext: "wav", contentType: "audio/x-wav" },
  { ext: "wma", contentType: "audio/x-ms-wma" },
  { ext: "wmv", contentType: "audio/x-ms-wmv" },
  { ext: "wps", contentType: "application/vndms-works" },
  { ext: "xml", contentType: "text/plain" },
  { ext: "z", contentType: "application/x-compress" },
  { ext: "zip", contentType: "application/x-zip-compressed" },
  { ext: "", contentType: "*/*" },
];

export async function getExtFromContentType(
  contentType: string
): Promise<string> {
  for (const each of MIME_TYPE_LIST) {
    if (each.contentType == contentType) return each.ext;
  }

  return "";
}
