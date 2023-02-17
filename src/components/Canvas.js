import "./Canvas.css";

import init, { Universe } from "game-of-life-rs";
import { useCallback, useEffect, useRef } from "react";

const MIN_START_ACTIVITY = 0.05;
const MIN_LIFETIME = 200;
const MIN_ACTIVITY = 0.02;

const CELL_SIZE = 4;
const RENDER_DELAY = 4;
const PADDING = 0;

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
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }

      universeRef.current.tick();

      if (universeRef.current.activity() < MIN_ACTIVITY) {
        const [width, height] = getUniverseDimensions();
        universeRef.current = new Universe(width, height, MIN_LIFETIME, MIN_START_ACTIVITY);
      }

      renderCount = 0;
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
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      ctxRef.current = canvasRef.current.getContext("2d");

      // Draw the grid
      await drawCells(ctxRef.current, universeRef.current, wasmRef.current.memory);
    };

    loadWasm();
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);

  return <canvas id="game-of-life-canvas" ref={canvasRef} />;
}

const drawCells = async (ctx, universe, memory) => {
  universe.generate_image_data(PADDING);

  const width = pad(universe.width(), PADDING);
  const height = pad(universe.height(), PADDING);

  const dataPtr = universe.image_data();
  const data = new Uint8ClampedArray(memory.buffer, dataPtr, width * height * 4);
  const imageData = new ImageData(data, width, height);

  // Use bitmap to scale image data
  const bitmap = await createImageBitmap(imageData);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(bitmap, 0, 0, window.innerWidth, window.innerHeight);
};

const getUniverseDimensions = () => {
  const width = Math.ceil((window.innerWidth - PADDING) / (PADDING + 1) / CELL_SIZE);
  const height = Math.ceil((window.innerHeight - PADDING) / (PADDING + 1) / CELL_SIZE);
  return [width, height];
};

const needsResize = (universe) => {
  const [width, height] = getUniverseDimensions();
  return universe.width() !== width || universe.height() !== height;
};

const pad = (value, padding) => {
  return padding * value + padding + value;
};
