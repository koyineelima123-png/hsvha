import {
  GRID_SIZE,
  createInitialState,
  queueDirection,
  stepGame,
  togglePause,
} from "./snake-game.js";

const TICK_MS = 140;

const boardElement = document.querySelector("#game-board");
const scoreElement = document.querySelector("#score");
const statusElement = document.querySelector("#status");
const restartButton = document.querySelector("#restart-button");
const pauseButton = document.querySelector("#pause-button");
const controlButtons = document.querySelectorAll("[data-direction]");

let state = createInitialState();
let tickHandle = null;

buildBoard();
render();
startLoop();

window.addEventListener("keydown", (event) => {
  const direction = getDirectionForKey(event.key);

  if (direction) {
    event.preventDefault();
    state = queueDirection(state, direction);
    return;
  }

  if (event.key === " ") {
    event.preventDefault();
    state = togglePause(state);
    render();
    return;
  }

  if (event.key === "Enter" && state.isGameOver) {
    event.preventDefault();
    restartGame();
  }
});

restartButton.addEventListener("click", () => {
  restartGame();
});

pauseButton.addEventListener("click", () => {
  state = togglePause(state);
  render();
});

controlButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state = queueDirection(state, button.dataset.direction);
  });
});

function startLoop() {
  stopLoop();
  tickHandle = window.setInterval(() => {
    state = stepGame(state);
    render();
  }, TICK_MS);
}

function stopLoop() {
  if (tickHandle !== null) {
    window.clearInterval(tickHandle);
  }
}

function restartGame() {
  state = createInitialState();
  render();
}

function buildBoard() {
  const cells = [];
  for (let index = 0; index < GRID_SIZE * GRID_SIZE; index += 1) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.setAttribute("role", "gridcell");
    cells.push(cell);
  }
  boardElement.replaceChildren(...cells);
}

function render() {
  const cells = boardElement.children;

  for (const cell of cells) {
    cell.className = "cell";
  }

  state.snake.forEach((segment, index) => {
    const cell = cells[toIndex(segment.x, segment.y)];
    if (!cell) {
      return;
    }
    cell.classList.add("snake");
    if (index === 0) {
      cell.classList.add("head", `facing-${state.direction}`);
    } else if (index % 2 === 0) {
      cell.classList.add("segment-alt");
    }
  });

  if (state.food) {
    const foodCell = cells[toIndex(state.food.x, state.food.y)];
    foodCell?.classList.add("food");
  }

  scoreElement.textContent = String(state.score);
  statusElement.textContent = getStatusLabel();
  pauseButton.textContent = state.isPaused ? "Resume" : "Pause";
  pauseButton.disabled = state.isGameOver;
}

function toIndex(x, y) {
  return y * GRID_SIZE + x;
}

function getStatusLabel() {
  if (state.isGameOver) {
    return "Game over";
  }

  if (state.isPaused) {
    return "Paused";
  }

  return "Running";
}

function getDirectionForKey(key) {
  const normalizedKey = key.toLowerCase();
  const keyMap = {
    arrowup: "up",
    w: "up",
    arrowdown: "down",
    s: "down",
    arrowleft: "left",
    a: "left",
    arrowright: "right",
    d: "right",
  };

  return keyMap[normalizedKey] ?? null;
}
