import init, { Cell, Universe } from "game-of-life-rs";
import { useCallback, useEffect, useRef } from "react";

import { GRADIENT } from "./gradient";

const CELL_SIZE = 5; // px
const GRID_COLOR = "#EEE";
const DEAD_COLOR = "#010e1b";
const ALIVE_COLOR = "#000";
const COLOR_CHANGE_RATE = 0.5;
const RENDER_DELAY = 3;
const GRID_WIDTH = 0;

let renderCount = 0;

export default function Canvas() {
  const requestRef = useRef();
  const wasmRef = useRef();
  const universeRef = useRef();
  const canvasRef = useRef();
  const ctxRef = useRef();

  const animate = useCallback(() => {
    if (ctxRef.current === undefined) {
      console.warn("Canvas context not initialized");
      requestRef.current = requestAnimationFrame(animate);
      return;
    }
    if (universeRef.current === undefined) {
      console.warn("Universe not initialized");
      requestRef.current = requestAnimationFrame(animate);
      return;
    }

    if (renderCount === RENDER_DELAY) {
      universeRef.current.tick();
      renderCount = 0;
      drawGrid(ctxRef.current, universeRef.current.width(), universeRef.current.height());
      drawCells(ctxRef.current, universeRef.current, wasmRef.current.memory);
    }

    renderCount++;
    requestRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const loadWasm = async () => {
      wasmRef.current = await init();

      // Construct the universe, and set the width and height
      universeRef.current = new Universe(200, 100);
      const canvas = canvasRef.current;
      canvas.height = (CELL_SIZE + GRID_WIDTH) * universeRef.current.height() + 1;
      canvas.width = (CELL_SIZE + GRID_WIDTH) * universeRef.current.width() + 1;
      ctxRef.current = canvas.getContext("2d");

      // Draw the grid
      drawGrid(ctxRef.current, universeRef.current.width(), universeRef.current.height());
      drawCells(ctxRef.current, universeRef.current, wasmRef.current.memory);
    };

    loadWasm();
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);

  return <canvas id="game-of-life-canvas" ref={canvasRef} />;
}

const drawGrid = (ctx, width, height) => {
  if (GRID_WIDTH === 0) return;

  ctx.beginPath();
  ctx.strokeStyle = GRID_COLOR;

  // Vertical lines
  for (let i = 0; i <= width; i++) {
    ctx.moveTo(i * (CELL_SIZE + GRID_WIDTH) + 1, 0);
    ctx.lineTo(i * (CELL_SIZE + GRID_WIDTH) + 1, (CELL_SIZE + GRID_WIDTH) * height + 1);
  }

  // Horizontal lines
  for (let j = 0; j <= height; j++) {
    ctx.moveTo(0, j * (CELL_SIZE + GRID_WIDTH) + 1);
    ctx.lineTo((CELL_SIZE + GRID_WIDTH) * width + 1, j * (CELL_SIZE + GRID_WIDTH) + 1);
  }

  ctx.stroke();
};

const drawCells = (ctx, universe, memory) => {
  const width = universe.width();
  const height = universe.height();

  const cellsPtr = universe.cells();
  const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);
  const cellGensPtr = universe.cell_generations();
  const cellGens = new Uint32Array(memory.buffer, cellGensPtr, width * height);

  ctx.beginPath();

  // Alive cells
  ctx.fillStyle = ALIVE_COLOR;
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col, width);
      if (cells[idx] !== Cell.Alive) {
        continue;
      }

      ctx.fillStyle = GRADIENT[Math.floor((cellGens[idx] * COLOR_CHANGE_RATE) % GRADIENT.length)];
      ctx.fillRect(
        col * (CELL_SIZE + GRID_WIDTH) + 1,
        row * (CELL_SIZE + GRID_WIDTH) + 1,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }

  // Dead cells
  ctx.fillStyle = DEAD_COLOR;
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col, width);
      if (cells[idx] !== Cell.Dead) {
        continue;
      }

      ctx.fillRect(
        col * (CELL_SIZE + GRID_WIDTH) + 1,
        row * (CELL_SIZE + GRID_WIDTH) + 1,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }

  ctx.stroke();
};

const getIndex = (row, column, width) => {
  return row * width + column;
};
