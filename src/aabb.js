export class Point {
    constructor(x, y, data) {
        this.x = x;
        this.y = y;
        this.data = data;
    }
}
export default class AABB {
    constructor(point, width, height) {
        this.point = point;
        this.width = width;
        this.height = height;
    }
    // contains (point: Point<T>): boolean {
    //     return this.point.x <= point.x &&
    //     this.point.y <= point.y &&
    //     point.x < this.point.x + this.width &&
    //     point.y < this.point.y + this.height;
    // }
    intersects(aabb) {
        if (!(aabb.point.x + aabb.width < this.point.x ||
            aabb.point.y + aabb.height < this.point.y ||
            this.point.x + this.width < aabb.point.x ||
            this.point.y + this.height < aabb.point.y)) {
            return true;
        }
        return false;
    }
    containsPoint(point) {
        return this.point.x <= point.x &&
            this.point.y <= point.y &&
            point.x < this.point.x + this.width &&
            point.y < this.point.y + this.height;
    }
    contains(aabb) {
        const a = [
            new Point(aabb.point.x, aabb.point.y, aabb.point.data),
            new Point(aabb.point.x + aabb.width, aabb.point.y, aabb.point.data),
            new Point(aabb.point.x, aabb.point.y + aabb.height, aabb.point.data),
            new Point(aabb.point.x + aabb.width, aabb.point.y + aabb.height, aabb.point.data)
        ];
        for (let p of a) {
            if (!this.containsPoint(p)) {
                return false;
            }
        }
        return true;
    }
}
