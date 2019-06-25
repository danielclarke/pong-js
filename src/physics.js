export const restrictPlayerMovement = (player, boundary) => {
    player.y = Math.max(player.y, boundary.point.y);
    player.y = Math.min(player.y, boundary.point.y + boundary.height - player.height);
};
export const restrictBallMovement = (ball, boundary) => {
    if (ball.y < boundary.point.y) {
        ball.y = boundary.point.y;
        ball.dy = -ball.dy * 0.9;
        return true;
    }
    else if (boundary.point.y + boundary.height < ball.y + ball.height) {
        ball.y = boundary.point.y + boundary.height - ball.height;
        ball.dy = -ball.dy * 0.9;
        return true;
    }
    return false;
};
export default class Physics {
}
