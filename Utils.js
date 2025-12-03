import { Particle } from "./Particle.js";

export function handleCollision(a, b) {
    const vnm = Math.sqrt(
        (b.x - a.x) * (b.x - a.x) +
        (b.y - a.y) * (b.y - a.y)
    );

    const vnux = (b.x - a.x) / vnm;
    const vnuy = (b.y - a.y) / vnm;

    const dot1 = a.vx * vnux + a.vy * vnuy;
    const dot2 = b.vx * vnux + b.vy * vnuy;

    const vpa1x = dot1 * vnux;
    const vpa1y = dot1 * vnuy;
    const vpe1x = a.vx - vpa1x;
    const vpe1y = a.vy - vpa1y;
    const vpa2x = dot2 * vnux;
    const vpa2y = dot2 * vnuy;
    const vpe2x = b.vx - vpa2x;
    const vpe2y = b.vy - vpa2y;
                
    a.vx = vpe1x + vpa2x;
    a.vy = vpe1y + vpa2y;
    b.vx = vpe2x + vpa1x;
    b.vy = vpe2y + vpa1y;

    let overlap = (a.radius + b.radius - a.getDistance(b));
    a.x -= vnux * overlap / 2;
    a.y -= vnuy * overlap / 2;
    b.x += vnux * overlap / 2;
    b.y += vnuy * overlap / 2;
}

export function updateAndCollide(particles, numParticles, boxs, nutrientSolutions, microbesArray, canvas, ctx, obstructionValue) {
    for(let i = 0; i < particles.length; i++) {
    for(let j = i + 1; j < particles.length; j++) {
            if(particles[i].isSamePosition(particles[j])) {
                handleCollision(particles[i], particles[j]);   
            }
        }
    }

    for (let i = 0; i < particles.length; i++) {
        particles[i].update(canvas, boxs, nutrientSolutions, microbesArray, obstructionValue);
        particles[i].draw(ctx);
    }

    if(particles.length > 0 && !particles[0].isAirParticle) {
        nutrientSolutions[0].tryKillMicrobes(microbesArray);
        nutrientSolutions[0].useOxygen(microbesArray);
    }
}

export function initializeParticleArray(numParticles, particleArray, particleRadius, particleColor, isAirMicrobe, isAirParticle, canvas) {
    for(let i = 0; i < numParticles; i++) {
        particleArray[i] = (new Particle(Math.random() * (canvas.width - 4 * particleRadius) + 2 * particleRadius, Math.random() * (canvas.height - 4 * particleRadius) + 2 * particleRadius, particleRadius, particleColor, isAirMicrobe, isAirParticle));
    }    
}