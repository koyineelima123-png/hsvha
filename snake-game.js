export const GRID_SIZE = 16;
export const INITIAL_DIRECTION = "right";
export const INITIAL_SNAKE = [
  { x: 2, y: 8 },
  { x: 1, y: 8 },
  { x: 0, y: 8 },
];

const DIRECTION_VECTORS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITES = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

export function createInitialState(randomFn = Math.random) {
  const snake = INITIAL_SNAKE.map((segment) => ({ ...segment }));
  return {
    gridSize: GRID_SIZE,
    snake,
    direction: INITIAL_DIRECTION,
    queuedDirection: INITIAL_DIRECTION,
    food: getRandomEmptyCell(snake, GRID_SIZE, randomFn),
    score: 0,
    isGameOver: false,
    isPaused: false,
  };
}

export function queueDirection(state, nextDirection) {
  if (!DIRECTION_VECTORS[nextDirection]) {
    return state;
  }

  const blockedDirection = OPPOSITES[state.direction];
  if (nextDirection === blockedDirection && state.snake.length > 1) {
    return state;
  }

  return {
    ...state,
    queuedDirection: nextDirection,
  };
}

export function togglePause(state) {
  if (state.isGameOver) {
    return state;
  }

  return {
    ...state,
    isPaused: !state.isPaused,
  };
}

export function stepGame(state, randomFn = Math.random) {
  if (state.isGameOver || state.isPaused) {
    return state;
  }

  const direction = resolveDirection(state.direction, state.queuedDirection, state.snake.length);
  const nextHead = movePoint(state.snake[0], DIRECTION_VECTORS[direction]);
  const willEatFood = pointsEqual(nextHead, state.food);
  const collisionBody = willEatFood ? state.snake : state.snake.slice(0, -1);

  if (hitsBoundary(nextHead, state.gridSize) || hitsSnake(nextHead, collisionBody)) {
    return {
      ...state,
      direction,
      queuedDirection: direction,
      isGameOver: true,
    };
  }

  const nextSnake = [nextHead, ...state.snake];

  if (!willEatFood) {
    nextSnake.pop();
  }

  return {
    ...state,
    snake: nextSnake,
    direction,
    queuedDirection: direction,
    food: willEatFood ? getRandomEmptyCell(nextSnake, state.gridSize, randomFn) : state.food,
    score: willEatFood ? state.score + 1 : state.score,
  };
}

export function getRandomEmptyCell(snake, gridSize, randomFn = Math.random) {
  const occupied = new Set(snake.map(({ x, y }) => `${x},${y}`));
  const openCells = [];

  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) {
        openCells.push({ x, y });
      }
    }
  }

  if (openCells.length === 0) {
    return null;
  }

  const index = Math.floor(randomFn() * openCells.length);
  return openCells[index];
}

function resolveDirection(currentDirection, queuedDirection, snakeLength) {
  if (!queuedDirection) {
    return currentDirection;
  }

  if (snakeLength > 1 && queuedDirection === OPPOSITES[currentDirection]) {
    return currentDirection;
  }

  return queuedDirection;
}

function movePoint(point, vector) {
  return {
    x: point.x + vector.x,
    y: point.y + vector.y,
  };
}

function hitsBoundary(point, gridSize) {
  return point.x < 0 || point.y < 0 || point.x >= gridSize || point.y >= gridSize;
}

function hitsSnake(point, snake) {
  return snake.some((segment) => pointsEqual(segment, point));
}

function pointsEqual(a, b) {
  return a?.x === b?.x && a?.y === b?.y;
}
