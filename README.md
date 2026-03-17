# Snake

Small, dependency-free classic Snake game.

## Run

From `/Users/neelimakoyi/Documents/Testingapp`, start a static server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Files

- `index.html`: page shell and controls
- `styles.css`: minimal styling
- `snake-game.js`: deterministic game rules and state updates
- `app.js`: DOM rendering and input handling

## Manual verification

- Movement works with arrow keys and `WASD`
- Snake grows by one segment after eating food
- Score increments when food is eaten
- Game ends on wall collision
- Game ends on self collision
- Pause/resume works with the button and space bar
- Restart works with the button and Enter after game over
- On-screen direction buttons work on touch/mobile
