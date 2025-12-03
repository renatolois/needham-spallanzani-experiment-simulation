export class OpenBox {
    constructor(x, y, width, height, color, holeWidth) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.holeWidth = holeWidth;
        this.holeX = this.x + (this.width - this.holeWidth) / 2
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + 3, this.y + 3, this.width - 6, this.height - 6);
        
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.holeX, this.y, this.holeWidth, 10);
        ctx.fill();
    }
}