import * as AMapLoader from "@amap/amap-jsapi-loader"
interface plugins {
  loaderPlugins?: string[]
  AMapUIPlugins?: string[]
}

const getMapKeyByOrgId = () => {
  const key = "ceec0c8cc35492b2a7e83f5be1043de0"
  // @ts-ignore
  window._AMapSecurityConfig = {
    securityJsCode: "5a0c9bd829d2c5f203330fc94c9f0dfc",
  }
  return key
}

export async function useAMapLoader(plugins: plugins = { loaderPlugins: [], AMapUIPlugins: [] }) {
  const key = getMapKeyByOrgId()
  return await AMapLoader.load({
    key, // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: plugins.loaderPlugins, // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    AMapUI: {
      // 是否加载 AMapUI，缺省不加载
      version: "1.1", // AMapUI 缺省 1.1, JSAPI v2.0 版本需要使用AMapUI 组件库的 v1.1版本。
      plugins: plugins.AMapUIPlugins, // 需要加载的 AMapUI ui插件
    },
  })
}
