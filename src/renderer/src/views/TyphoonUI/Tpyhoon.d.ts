declare global {
  interface Window {
    AMap: any
    _AMapSecurityConfig: any
  }
}
export interface DataObjT {
  fileName: string
  parserData: any
  echartsData: any
}

export {}
