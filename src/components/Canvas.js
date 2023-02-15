import init, { Cell, Universe } from "game-of-life-rs";
import { useEffect, useRef } from "react";

import memory from "game-of-life-rs/game_of_life_rs_bg.wasm";

export default function Canvas() {
  const requestRef = useRef();
  const previousTimeRef = useRef();
  const universeRef = useRef();

  const animate = (time) => {
    console.log("Animate");
    if (previousTimeRef.current !== undefined) {
      // Call our update function here
    }

    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    console.log("Effect");
    // init().then();
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return <canvas id="game-of-life-canvas" />;
}

// const CELL_SIZE = 5; // px
// const GRID_COLOR = "#EEE";
// const DEAD_COLOR = "#FFF";
// const COLOR_CHANGE_RATE = 0.5;
// const RENDER_DELAY = 3;

// // Construct the universe, and get its width and height
// const universe = new Universe();
// const width = universe.width();
// const height = universe.height();

// // Give the canvas room for all of our cells and a 1px border
// // around each of them
// const canvas = document.getElementById("game-of-life-canvas");
// canvas.height = (CELL_SIZE + 1) * height + 1;
// canvas.width = (CELL_SIZE + 1) * width + 1;
// const ctx = canvas.getContext("2d");

// let animationId = null;
// let renderCount = 0;
// const renderLoop = () => {
//   if (renderCount === RENDER_DELAY) {
//     universe.tick();
//     renderCount = 0;
//   }
//   drawGrid();
//   drawCells();

//   animationId = requestAnimationFrame(renderLoop);
//   renderCount++;
// };

// const drawGrid = () => {
//   ctx.beginPath();
//   ctx.strokeStyle = GRID_COLOR;

//   // Vertical lines
//   for (let i = 0; i <= width; i++) {
//     ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
//     ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
//   }

//   // Horizontal lines
//   for (let j = 0; j <= height; j++) {
//     ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
//     ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
//   }

//   ctx.stroke();
// };

// const drawCells = () => {
//   const cellsPtr = universe.cells();
//   const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);
//   const cellGensPtr = universe.cell_generations();
//   const cellGens = new Uint32Array(memory.buffer, cellGensPtr, width * height);

//   ctx.beginPath();

//   // Alive cells
//   ctx.fillStyle = "#000";
//   for (let row = 0; row < height; row++) {
//     for (let col = 0; col < width; col++) {
//       const idx = getIndex(row, col);
//       if (cells[idx] !== Cell.Alive) {
//         continue;
//       }

//       // ctx.fillStyle = GRADIENT[Math.floor((cellGens[idx] * COLOR_CHANGE_RATE) % GRADIENT.length)];
//       ctx.fillRect(col * (CELL_SIZE + 1) + 1, row * (CELL_SIZE + 1) + 1, CELL_SIZE, CELL_SIZE);
//     }
//   }

//   // Dead cells
//   ctx.fillStyle = DEAD_COLOR;
//   for (let row = 0; row < height; row++) {
//     for (let col = 0; col < width; col++) {
//       const idx = getIndex(row, col);
//       if (cells[idx] !== Cell.Dead) {
//         continue;
//       }

//       ctx.fillRect(col * (CELL_SIZE + 1) + 1, row * (CELL_SIZE + 1) + 1, CELL_SIZE, CELL_SIZE);
//     }
//   }

//   ctx.stroke();
// };

// const getIndex = (row, column) => {
//   return row * width + column;
// };

// drawGrid();
// drawCells();
// animationId = requestAnimationFrame(renderLoop);
