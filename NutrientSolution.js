import { Particle } from "./Particle.js";

export class NutrientSolution {

    static baseDeathChance = 0.05;
    static baseMicrobeSpawnChance = 1;
    static microbeRadius = 4;
    static microbeResistance = 1;

    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;

        this.oxygenLevel = 0;
        this.temperatureLevel = 0;
    }

    draw(ctx) {
        const maxOxygen = 1;
        const maxTemperature = 1;
        const barWidth = 200;
        const barHeight = 20;

        ctx.fillStyle = "gray";
        ctx.fillRect(10, 40, barWidth, barHeight);

        ctx.fillStyle = "blue";
        ctx.fillRect(10, 40, barWidth * (this.oxygenLevel / maxOxygen), barHeight);
        ctx.strokeStyle = "black";
        ctx.strokeRect(10, 40, barWidth, barHeight);

        ctx.fillStyle = "orange";
        ctx.fillRect(10, 70, barWidth * (this.temperatureLevel / maxTemperature), barHeight);
        ctx.strokeStyle = "black";
        ctx.strokeRect(10, 70, barWidth, barHeight);

        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + 3, this.y + 3, this.width - 6, this.height - 6);
        ctx.fill();
    }

    increaseOxygenLevel() {
        this.oxygenLevel += 0.015;
        if(this.oxygenLevel > 1) {
            this.oxygenLevel = 1;
        }
    }

    decreaseOxygenLevel() {
        this.oxygenLevel -= 0.00035;
        if(this.oxygenLevel < 0) {
            this.oxygenLevel = 0;
        }
    }

    increaseTemperatureLevel() {
        this.temperatureLevel += 0.018;
        if(this.temperatureLevel > 1) {
            this.temperatureLevel = 1;
        }
    }

    decreaseTemperatureLevel() {
        this.temperatureLevel -= 0.018;
        if(this.temperatureLevel < 0) {
            this.temperatureLevel = 0;
        }
    }

    decreaseTemperatureLevelLower() {
        this.temperatureLevel -= 0.0001;
        if(this.temperatureLevel < 0) {
            this.temperatureLevel = 0;
        }
    }

    trySpawnMicrobe(microbesArray) {
        // let spawnChance = Math.random() * NutrientSolution.baseMicrobeSpawnChance * this.oxygenLevel * 1.8;
        let spawnChance = 1;
        if(spawnChance * (1 - this.temperatureLevel) > 0.5) {
            const microbe = new Particle(this.x + Math.random() * this.width, this.y + NutrientSolution.microbeRadius + 6, NutrientSolution.microbeRadius, "#ff0000", false, false);
            microbe.wasInBox = true;
            microbesArray.push(microbe);
        }
    }
    
    getNumMicrobes(microbesArray) {
        return microbesArray.length;
    }

    getDensityFactor(microbesArray) {
        const numMicrobes = this.getNumMicrobes(microbesArray);
        return Math.min(1, numMicrobes / 100);
    }

    tryKillMicrobes(microbesArray){
    	for(let i=microbesArray.length-1;i>=0;i--){
        	let densityFactor=this.getDensityFactor(microbesArray);
        	let chance=NutrientSolution.baseDeathChance*(1+densityFactor*2);
        	chance *= (1-this.oxygenLevel) * 2 + (1.4 + this.temperatureLevel) * (1.4 + this.temperatureLevel) * (4 * this.temperatureLevel) * (2 * this.temperatureLevel) * (4 * this.oxygenLevel) * 0.3; 
        	chance /= NutrientSolution.microbeResistance;

	        if(densityFactor < 0.3) {
	            chance /= (NutrientSolution.microbeResistance * 1.2 * (1.5 / densityFactor ));
	        }

	        if(this.oxygenLevel == 0) {
	            chance = 1;
        	}
        
	        if(Math.random()<chance) microbesArray.splice(i,1);
	    }
	}

    useOxygen(microbesArray) {
        const numMicrobes = this.getNumMicrobes(microbesArray);
        let densityFactor = Math.min(1, numMicrobes / 80); 
        this.oxygenLevel -= densityFactor / 110;
        if(numMicrobes == 0) {
            densityFactor = 0;
        }
        if(this.oxygenLevel < 0) {
            this.oxygenLevel = 0;
        }
    }
}