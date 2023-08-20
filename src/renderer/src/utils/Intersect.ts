/*
 * @Author: cpasion-office-win10 373704015@qq.com
 * @Date: 2022-12-05 17:04:57
 * @LastEditors: CPS holy.dandelion@139.com
 * @LastEditTime: 2023-08-19 16:34:01
 * @FilePath: \yys-cuter-client\src\utils\Intersect.ts
 * @Description: 向量计算代码片段：https://juejin.cn/post/6844904025587105800#heading-3
 */

export class Vector2d {
  public x: number;
  public y: number;

  /**
   * Description - 创建一个基于平面的向量对象
   *
   * @param  {int}  x    -  向量的x坐标
   * @param  {int}  y    -  向量的y坐标
   *
   * @returns {<type>} - {description}
   *
   */
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  // 大小： 获取向量长度
  lengthSquared() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /* 两个向量相加 ，返回新的向量对象*/
  public static add(vec1: Vector2d, vec2: Vector2d): Vector2d {
    const x = vec1.x + vec2.x;
    const y = vec1.y + vec2.y;
    return new Vector2d(x, y);
  }

  /* 两个向量相减 */
  static sub(vec1: Vector2d, vec2: Vector2d): Vector2d {
    const x = vec1.x - vec2.x;
    const y = vec1.y - vec2.y;
    return new Vector2d(x, y);
  }

  /*点积： 先对两个数字序列中的每组对应元素求积，再对所有积求和，结果即为点积 */
  public static dot(vec1: Vector2d, vec2: Vector2d) {
    return vec1.x * vec2.x + vec1.y * vec2.y;
  }

  /*旋转： 旋转矩阵求解*/
  public static rotate(vec: Vector2d, angle: number) {
    const cosVal = Math.cos(angle);
    const sinVal = Math.sin(angle);
    const x = vec.x * cosVal - vec.y * sinVal;
    const y = vec.x * sinVal + vec.y * cosVal;
    return new Vector2d(x, y);
  }
}

export class Circle {
  public x: number;
  public y: number;
  public r: number;
  /**
   * Description - 圆形
   *
   * @param  {type}  x    -  圆心 位置x
   * @param  {type}  y    -  圆心 位置y
   * @param  {type}  r    -  圆半径
   *
   * @returns {<Circle>} - {description}
   *
   */
  constructor(x: number, y: number, r: number) {
    this.x = x;
    this.y = y;
    this.r = r;
  }

  /* 当圆作为向量时，所处的中心位置*/
  get P() {
    return new Vector2d(this.x, this.y);
  }
}

/* 创建矩形 */
export class Rect {
  public x: number;
  public y: number;
  public w: number;
  public h: number;
  public rotation: number;

  /**
   * Description - 矩形
   *
   * @param  {type}  x           -  中心坐标x
   * @param  {type}  y           -  中心坐标x
   * @param  {type}  w           -  宽
   * @param  {type}  h           -  高
   * @param  {int}   rotation    -  轴心旋转(deg)
   * @returns {<type>} - {description}
   *
   */
  constructor(x: number, y: number, w: number, h: number, rotation = 0) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.rotation = rotation;
  }

  get width() {
    return this.w;
  }

  get height() {
    return this.h;
  }

  /* 矩形中心向量 */
  get C() {
    return new Vector2d(this.x, this.y);
  }

  /* [向量] 矩形四角点的向量[顺时针方向] */
  get _leftTop() {
    return new Vector2d(this.x - this.w / 2, this.y - this.h / 2);
  }
  get _rightTop() {
    return new Vector2d(this.x + this.w / 2, this.y - this.h / 2);
  }
  get _rightBottom() {
    return new Vector2d(this.x + this.w / 2, this.y + this.h / 2);
  }
  get _leftBottom() {
    return new Vector2d(this.x - this.w / 2, this.y + this.h / 2);
  }

  /*[向量] 未旋转的X对称轴*/
  get _axisX() {
    return new Vector2d(1, 0);
  }
  /*[向量] 未旋转的Y对称轴*/
  get _axisY() {
    return new Vector2d(0, 1);
  }

  /*[向量] 四顶点距离中心的距离，用来修正偏移，方便旋转计算*/
  get leftTopC(): Vector2d {
    return Vector2d.sub(this.leftTop, this.C);
  }
  get rightTopC(): Vector2d {
    return Vector2d.sub(this.rightTop, this.C);
  }
  get rightBottomC(): Vector2d {
    return Vector2d.sub(this.rightBottom, this.C);
  }
  get leftBottomC(): Vector2d {
    return Vector2d.sub(this.leftBottom, this.C);
  }

  /* [向量] 旋转后4角顶点 */
  get leftTop() {
    return this.rotation % 360 === 0
      ? this._leftTop
      : Vector2d.add(this.C, Vector2d.rotate(this.leftTopC, this._rotation));
  }
  get rightTop() {
    return this.rotation % 360 === 0
      ? this._rightTop
      : Vector2d.add(this.C, Vector2d.rotate(this.rightTopC, this._rotation));
  }
  get rightBottom() {
    return this.rotation % 360 === 0
      ? this._rightBottom
      : Vector2d.add(
          this.C,
          Vector2d.rotate(this.rightBottomC, this._rotation)
        );
  }
  get leftBottom() {
    return this.rotation % 360 === 0
      ? this._leftBottom
      : Vector2d.add(this.C, Vector2d.rotate(this.leftBottomC, this._rotation));
  }
  /*[向量] 旋转后的对称轴*/
  get axisX() {
    return this.rotation % 360 === 0
      ? this._axisX
      : Vector2d.rotate(this._axisX, this._rotation);
  }
  get axisY() {
    return this.rotation % 360 === 0
      ? this._axisY
      : Vector2d.rotate(this._axisY, this._rotation);
  }

  /* 弧度转角度 单位换算 */
  get _rotation() {
    return (this.rotation / 180) * Math.PI;
  }

  /* 四角顶点的数组 */
  get _vertexs() {
    return [this._leftTop, this._rightTop, this._rightBottom, this._leftBottom];
  }

  get vertexs() {
    return [this.leftTop, this.rightTop, this.rightBottom, this.leftBottom];
  }
}

/**
 * @description: 测试矩形与矩形是否相交(check rect and rect)
 * @param {Rect} a
 * @param {Rect} b
 * @return {*}
 */
export function rectWithRect(a: Rect, b: Rect) {
  const a_min_x = a.x;
  const a_min_y = a.y;
  const a_max_x = a.x + a.width;
  const a_max_y = a.y + a.height;

  const b_min_x = b.x;
  const b_min_y = b.y;
  const b_max_x = b.x + b.width;
  const b_max_y = b.y + b.height;

  return (
    a_min_x <= b_max_x &&
    a_max_x >= b_min_x &&
    a_min_y <= b_max_y &&
    a_max_y >= b_min_y
  );
}

export function getIntersectCoords(a: Rect, b: Rect): boolean | object {
  if (!rectWithRect(a, b)) false;

  return {
    startX: Math.max(a.x, b.x),
    startY: Math.max(a.y, b.y),
    endX: Math.min(a.x + a.width, b.x + b.width),
    endY: Math.min(a.y + a.height, b.y + b.height),
  };
}

export function rectWithRect2(rect1: Rect, rect2: Rect) {
  const half1Width = rect1.width / 2;
  const half1Height = rect1.height / 2;
  const half2Width = rect2.width / 2;
  const half2Height = rect2.height / 2;

  const cen1 = { x: rect1.x + half1Width, y: rect1.y + half1Height };
  const cen2 = { x: rect2.x + half2Width, y: rect2.y + half2Height };

  return (
    Math.abs(cen2.x - cen1.x) <= half1Width + half2Width &&
    Math.abs(cen2.y - cen1.y) <= half1Height + half2Height
  );
}
