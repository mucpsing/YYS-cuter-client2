import AMapLoader from "@amap/amap-jsapi-loader"
import "@amap/amap-jsapi-types"

// 初始化地图的异步函数
/**
 * @description: 
 * @param {string} key
 * @param {string} securityJsCode
 * @return {*}
 * 
 *  const Amap = initAMap(key, s_key)
 * 
 *  // 创建地图实例
    map = new AMap.Map("container", {
      viewMode: "3D", // 是否为 3D 地图模式
      zoom: 11, // 初始化地图级别
      center: [116.397428, 39.90923], // 初始化地图中心点位置
    })
 */
export async function initJSAmap(
  key: string,
  securityJsCode: string,
  elementId: string,
): Promise<AMap.Map | null> {
  let map: AMap.Map | null = null

  // 设置高德地图安全配置
  window._AMapSecurityConfig = {
    securityJsCode: securityJsCode, // 使用传入的 securityJsCode 参数
  }

  try {
    // 异步加载高德地图 API
    const AMap = await AMapLoader.load({
      key: key, // 传入的开发者Key
      version: "2.0", // 指定要加载的 JSAPI 版本
      plugins: ["AMap.Scale"], // 使用的插件
    })

    // 创建地图实例
    map = new AMap.Map(elementId, {
      viewMode: "2D", // 是否为 3D 地图模式
      zoom: 11, // 初始化地图级别
      center: [116.397428, 39.90923], // 初始化地图中心点位置
    })

    // 返回地图实例
    return map
  } catch (error) {
    console.error("加载高德地图失败：", error)
    return null
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // 检查脚本是否已经加载
    const existingScript = document.querySelector(`script[src="${src}"]`)
    if (existingScript) {
      resolve() // 如果脚本已存在，直接返回
      return
    }

    // 创建新的 script 标签
    const script = document.createElement("script")
    script.src = src
    script.onload = () => resolve() // 脚本加载成功
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`)) // 脚本加载失败

    // 将脚本插入到 body 中
    document.body.appendChild(script)
  })
}

export async function initWebAmap(key: string, elementID: string): Promise<AMap.Map | null> {
  try {
    // 动态加载高德地图 API
    await loadScript(`//webapi.amap.com/maps?v=2.0&key=${key}`)

    // 初始化高德地图实例
    const map = new AMap.Map(elementID, {
      zoom: 10,
      center: [116.397428, 39.90923], // 默认设置中心点为北京
    })

    // 如果需要，可以在此添加更多的高德地图控件或功能

    return map
  } catch (error) {
    console.error("高德地图加载失败:", error)
    return null
  }
}
