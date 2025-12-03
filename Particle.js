export class Particle {
    static microbeMitosisBaseChance = 0.0125;

    constructor(x, y, radius, color, isAirMicrobe, isAirParticle) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.vx = (Math.random() - 0.5) * 5;
        this.vy = (Math.random() - 0.5) * 5;
        this.radius = radius;
        this.wasInBox = false
        this.isAirMicrobe = isAirMicrobe;
        this.isAirParticle = isAirParticle;
    }

    update(canvas, boxs, nutrientSolutions, microbesArray, obstructionValue) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.vx *= -1;
        } else if (this.x + this.radius > canvas.width) {
            this.x = canvas.width - this.radius;
            this.vx *= -1;
        }
        if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.vy *= -1;
        } else if (this.y + this.radius > canvas.height) {
            this.y = canvas.height - this.radius;
            this.vy *= -1;
        }
        
        

        if(!this.wasInBox) {
            const inBox = ( this.y + this.radius > boxs[0].y &&
                            this.y - this.radius < boxs[0].y + boxs[0].height &&
                            !this.wasInBox &&
                            this.x + this.radius > boxs[0].x &&
                            this.x - this.radius < boxs[0].x + boxs[0].width &&
                            !this.wasInBox
            );

            const inHole = (inBox && this.x - this.radius > boxs[0].holeX &&
                            this.x + this.radius < boxs[0].holeX + boxs[0].holeWidth &&
                            this.y < boxs[0].y + boxs[0].height - this.radius
            );
        
            if(inHole && Math.random() > obstructionValue) {
                this.wasInBox = true;
            } else if(inBox) {
                const distLeft = Math.abs(this.x - boxs[0].x);
                const distRight = Math.abs(this.x - (boxs[0].x + boxs[0].width));
                const distTop = Math.abs(this.y - boxs[0].y);
                const distBottom = Math.abs(this.y - (boxs[0].y + boxs[0].height));
                const minX = Math.min(distLeft, distRight);
                const minY = Math.min(distBottom, distTop);
                if(minX < minY) {
                    this.vx *= -1;
                    if(distLeft < distRight) this.x = boxs[0].x - this.radius;
                    else this.x = boxs[0].x + boxs[0].width + this.radius;
                } else if(minY < minX) {
                    this.vy *= -1;
                    if(distTop < distBottom) this.y = boxs[0].y - this.radius;
                    else this.y = boxs[0].y + boxs[0].height + this.radius;
                } else {
                    if (distLeft < distRight) this.x = boxs[0].x - this.radius;
                    else this.x = boxs[0].x + boxs[0].width + this.radius;

                    if (distTop < distBottom) this.y = boxs[0].y - this.radius;
                    else this.y = boxs[0].y + boxs[0].height + this.radius;

                    this.vx *= -1;
                    this.vy *= -1;
                }
            }
        } else {
            if(this.isAirParticle && this.y >= nutrientSolutions[0].y) {
                this.wasInBox = false;
                this.x = Math.random() * (canvas.width - 4 * this.radius) + 2 * this.radius;
                this.y = Math.random() * (canvas.height - 4 * this.radius) + 2 * this.radius;
                if(!this.isAirMicrobe) {
                    nutrientSolutions[0].increaseOxygenLevel();
                } else {
                    nutrientSolutions[0].trySpawnMicrobe(microbesArray);
                }
            }

            const minX = boxs[0].x;
            const maxX = boxs[0].x + boxs[0].width;
            const minY = boxs[0].y + (this.isAirParticle ? 0 : boxs[0].height * (2/3));
            const maxY = boxs[0].y + boxs[0].height;

            const nMinX = this.x - this.radius < minX;
            const nMaxX = this.x + this.radius > maxX;
            const nMinY = this.y - this.radius < minY;
            const nMaxY = this.y + this.radius > maxY;

            const outBox = nMinX || nMaxX || nMinY || nMaxY;
            const inHole = (outBox && this.x - this.radius > boxs[0].holeX &&
                            this.x + this.radius < boxs[0].holeX + boxs[0].holeWidth &&
                            this.y < boxs[0].y + boxs[0].height - this.radius
            );

            if(!this.isAirParticle) {
                if(Math.random() < Particle.microbeMitosisBaseChance * (1 - (nutrientSolutions[0].getDensityFactor(microbesArray)) * 1.9) * 0.8 * nutrientSolutions[0].oxygenLevel) {
                    this.x -= this.radius;
                    this.y -= this.radius / 3;
                    const newMicrobe = new Particle(this.x + this.radius * 2, this.y, this.radius, this.color, false, false);
                    newMicrobe.wasInBox = true;
                    microbesArray.push(newMicrobe);
                }
            }
            
            if(this.isAirParticle && inHole && Math.random() > obstructionValue) {
                this.wasInBox = false;
            } else if(outBox) {       
                if(nMinX) {
                    this.x = minX + this.radius;
                    this.vx *= -1;
                } else if(nMaxX) {
                    this.x = maxX - this.radius;
                    this.vx *= -1;
                }
                if (nMinY) {
                    this.y = minY + this.radius;
                    this.vy *= -1;
                } else if(nMaxY) {
                    this.y = maxY - this.radius;
                    this.vy *= -1;
                }
            }
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    getDistance(p) {
        const dx = this.x - p.x;
        const dy = this.y - p.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    isSamePosition(p) {
        return this.getDistance(p) < this.radius + p.radius;
    }
}