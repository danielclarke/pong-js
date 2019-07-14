import Player from "./player.js"
import AABB from "./aabb.js"
import Ball from "./ball.js"

export const restrictPlayerMovement = <T>(player: Player, boundary: AABB<T>): void => {
    player.y = Math.max(player.y, boundary.point.y);
    player.y = Math.min(player.y, boundary.point.y + boundary.height - player.height);
}

export const restrictBallMovement = <T>(ball: Ball, boundary: AABB<T>): boolean => {
    if (ball.y < boundary.point.y) {
        ball.y = boundary.point.y;
        ball.dy = - ball.dy * 0.9;
        return true;
    } else if (boundary.point.y + boundary.height < ball.y + ball.height) {
        ball.y = boundary.point.y + boundary.height - ball.height;
        ball.dy = - ball.dy * 0.9;
        return true;
    } 
    return false;
}

export default class Physics {}