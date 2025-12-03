import { Particle } from './Particle.js';
import { OpenBox } from './OpenBox.js';
import { NutrientSolution } from './NutrientSolution.js';
import { initializeParticleArray, updateAndCollide } from './Utils.js';

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const obstructionSlider = document.getElementById("obstructionSlider");

const increaseTemperatureButton = document.getElementById("increaseTemp");
const decreaseTemperatureButton = document.getElementById("decreaseTemp");

const microbesCounterParagraph = document.getElementById("microbesCounter");

let obstructionValue = parseFloat(obstructionSlider.value);

const numAirParticles = 400;
const numAirMicrobes = 80;
const numBoxs = 1;
const numNutrientSolutions = 1;

const airParticleRadius = 3.5;
const airParticleColor = "#4040ff";
const airMicrobeRadius = 3;
const airMicrobeColor = "#d35742";
// const particleSpeedFactor = 2;

const airParticles = new Array(numAirParticles);
const airMicrobes = new Array(numAirMicrobes);
const microbesArray = [];
const boxs = new Array(numBoxs);
const nutrientSolutions = new Array(numNutrientSolutions);

const boxHoleSize = 200;

const boxX = canvas.width / 4;
const boxY = canvas.height / 4 + canvas.height / 6;
const boxWidth = canvas.width / 2;
const boxHeight = canvas.height / 2;

boxs[0] = new OpenBox(boxX, boxY, boxWidth, boxHeight, "white", boxHoleSize);
nutrientSolutions[0] = new NutrientSolution(boxX, boxY + boxHeight * 2/3, boxWidth, boxHeight / 3, "#72cedeff");

function animateParticles() {
    microbesCounterParagraph.innerText = "num. microbes: " + nutrientSolutions[0].getNumMicrobes(microbesArray);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // nutrientSolutions[0].decreaseOxygenLevel();
    nutrientSolutions[0].decreaseTemperatureLevelLower();
    boxs[0].draw(ctx);
    nutrientSolutions[0].draw(ctx);

    updateAndCollide(airParticles, numAirParticles, boxs, nutrientSolutions, microbesArray, canvas, ctx, obstructionValue);
    updateAndCollide(airMicrobes, numAirMicrobes, boxs, nutrientSolutions, microbesArray, canvas, ctx, obstructionValue);
    updateAndCollide(microbesArray, microbesArray.length, boxs, nutrientSolutions, microbesArray, canvas, ctx, obstructionValue);

    requestAnimationFrame(animateParticles);
}


initializeParticleArray(numAirParticles, airParticles, airParticleRadius, airParticleColor, false, true, canvas);
initializeParticleArray(numAirMicrobes, airMicrobes, airMicrobeRadius, airMicrobeColor, true, true, canvas);


obstructionSlider.addEventListener("input", (event) => {
    obstructionValue = parseFloat(event.target.value);
});

increaseTemperatureButton.addEventListener("click", (event) => {
    nutrientSolutions[0].increaseTemperatureLevel();    
});

decreaseTemperatureButton.addEventListener("click", (event) => {
    nutrientSolutions[0].decreaseTemperatureLevel();    
});

animateParticles();

console.log(obstructionValue);