import "./Canvas.css";

import init, { Universe } from "game-of-life-rs";
import { useCallback, useEffect, useRef } from "react";

const MIN_START_ACTIVITY = 0.05;
const MIN_LIFETIME = 200;
const MIN_ACTIVITY = 0.03;

/// Funky pixel background
// const CELL_SIZE = 4; // px
// const GRID_COLOR = "#010e1b";
// const RENDER_DELAY = 6;
// const GRID_WIDTH = 20;

/// Default
const CELL_SIZE = 4;
const GRID_COLOR = "#010e1b";
const RENDER_DELAY = 2;
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
      if (needsResize(universeRef.current)) {
        const [width, height] = getUniverseDimensions();
        universeRef.current.resize(width, height);
        canvasRef.current.width = (CELL_SIZE + GRID_WIDTH) * universeRef.current.width() + 1;
        canvasRef.current.height = (CELL_SIZE + GRID_WIDTH) * universeRef.current.height() + 1;
      }

      universeRef.current.tick();

      if (universeRef.current.activity() < MIN_ACTIVITY) {
        const [width, height] = getUniverseDimensions();
        universeRef.current = new Universe(width, height, MIN_LIFETIME, MIN_START_ACTIVITY);
      }

      renderCount = 0;
      drawGrid(ctxRef.current, universeRef.current.width(), universeRef.current.height());
      drawCells(ctxRef.current, universeRef.current, wasmRef.current.memory).catch(console.error);
    }

    renderCount++;
    requestRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const loadWasm = async () => {
      wasmRef.current = await init();

      // Construct the universe, and set the width and height
      const [width, height] = getUniverseDimensions();
      universeRef.current = new Universe(width, height, MIN_LIFETIME, MIN_START_ACTIVITY);
      canvasRef.current.width = (CELL_SIZE + GRID_WIDTH) * universeRef.current.width() + 1;
      canvasRef.current.height = (CELL_SIZE + GRID_WIDTH) * universeRef.current.height() + 1;
      ctxRef.current = canvasRef.current.getContext("2d");
      ctxRef.current.imageSmoothingEnabled = false;

      // Draw the grid
      drawGrid(ctxRef.current, universeRef.current.width(), universeRef.current.height());
      await drawCells(ctxRef.current, universeRef.current, wasmRef.current.memory);
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

const drawCells = async (ctx, universe, memory) => {
  universe.generate_image_data();
  const imageData = new ImageData(universe.width(), universe.height());
  const dataPtr = universe.image_data();
  const data = new Uint8ClampedArray(
    memory.buffer,
    dataPtr,
    universe.width() * universe.height() * 4
  );
  imageData.data.set(data);
  // Use bitmap to scale image data
  const bitmap = await createImageBitmap(imageData);
  ctx.drawImage(bitmap, 0, 0, window.innerWidth, window.innerHeight);
};

const getUniverseDimensions = () => {
  const width = Math.ceil(window.innerWidth / (CELL_SIZE + GRID_WIDTH));
  const height = Math.ceil(window.innerHeight / (CELL_SIZE + GRID_WIDTH));
  return [width, height];
};

const needsResize = (universe) => {
  const [width, height] = getUniverseDimensions();
  return universe.width() !== width || universe.height() !== height;
};
