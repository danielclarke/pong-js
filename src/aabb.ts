export class Point<T> {
    constructor (public x: number, public y: number, public data: T) {}
}

export default class AABB<T> {
    constructor (public point: Point<T>, public width: number, public height: number) {}

    contains (point: Point<T>): boolean {
        return this.point.x <= point.x &&
        this.point.y <= point.y &&
        point.x < this.point.x + this.width &&
        point.y < this.point.y + this.height;
    }

    intersects (aabb: AABB<T>): boolean {
        if (!(
            aabb.point.x + aabb.width < this.point.x ||
            aabb.point.y + aabb.height < this.point.y ||
            this.point.x + this.width < aabb.point.x ||
            this.point.y + this.height < aabb.point.y
        )) {
            return true;
        }
        return false;
    }
}