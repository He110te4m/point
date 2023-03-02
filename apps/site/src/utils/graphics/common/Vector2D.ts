import { toDegree, toRadian } from './math'

export class Vector2D {
  private data: number[]

  constructor(...data: number[]) {
    this.data = data
  }

  static create(...data: number[]) {
    return new Vector2D(...data)
  }

  static createUnitVector() {
    return new Vector2D(1, 1)
  }

  static createXUnitVector() {
    return new Vector2D(1, 0)
  }

  static createYUnitVector() {
    return new Vector2D(0, 1)
  }

  get x() {
    return this.data[0]
  }

  set x(x: number) {
    this.data[0] = x
  }

  get y() {
    return this.data[1]
  }

  set y(y: number) {
    this.data[1] = y
  }

  get length() {
    return Math.hypot(this.x, this.y)
  }

  set length(len: number) {
    this.normalize().scaleBy(len)
  }

  clone() {
    return new Vector2D(this.x, this.y)
  }

  scaleBy(rate: number) {
    this.x *= rate
    this.y *= rate

    return this
  }

  add(vector: Vector2D) {
    this.x += vector.x
    this.y += vector.y

    return this
  }

  sub(vector: Vector2D) {
    this.x -= vector.x
    this.y -= vector.y

    return this
  }

  rotate(degree: number) {
    const radian = toRadian(degree)
    const c = Math.cos(radian)
    const s = Math.sin(radian)
    const { x, y } = this

    this.x = x * c - y * s
    this.y = x * s + y * c

    return this
  }

  cross(vector: Vector2D) {
    return this.x * vector.y - vector.x * this.y
  }

  dot(vector: Vector2D) {
    return this.x * vector.x + this.y * vector.y
  }

  normalize() {
    return this.scaleBy(1 / this.length)
  }

  angleBetween(vector: Vector2D) {
    return toDegree(Math.acos(this.dot(vector) / (this.length * vector.length)))
  }

  reverse() {
    return this.scaleBy(-1)
  }
}
