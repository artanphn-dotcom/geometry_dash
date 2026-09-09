# Dreni's Game

Dreni's Game is a polished HTML5 arcade runner built in JavaScript and rendered on an HTML canvas. It combines fast rhythm-based platforming, neon visual styling, multiple levels, coins, checkpoints, moving platforms, jump pads, and a progression system designed for quick replayability.

This project is a custom game prototype created as a personal arcade experience with a clean, modern presentation and a more approachable difficulty curve.

## Overview

- Genre: endless runner / precision platformer
- Platform: HTML5 canvas, JavaScript, browser-based
- Style: neon cyberpunk arcade aesthetic
- Objective: survive hazards, collect coins, reach the finish line, and clear all 10 levels

## Features

- 10 handcrafted levels with increasing difficulty
- Responsive canvas-based gameplay
- Jump pads and moving platforms
- checkpoint progression
- coin collection and score tracking
- local save/progression support
- pause and resume support
- sound toggle with lightweight synthesized audio
- level-select menu and continue system

## Project Structure

- `index.html` – main game shell and gameplay logic
- `css/game.css` – interface and visual styling
- `js/main.js` – main runtime bootstrap and orchestration
- `js/player.js` – player movement and state logic
- `js/levels.js` – level templates and stage configuration
- `js/collision.js` – collision helpers
- `js/audio.js` – basic audio synthesis and sound controls

## How to Run

You can run the game by opening the HTML file in a browser or by serving the project locally.

### Option 1: Open directly

Open `index.html` in a browser.

### Option 2: Local web server

```bash
cd geometry-rush
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Controls

- Space, W, or Up Arrow: jump
- Mouse click or tap: jump
- Escape: pause/resume

## Gameplay Notes

- Each level contains spikes, moving elements, coins, and safe platform sections.
- Progress is saved locally in the browser.
- The game is tuned to be more forgiving than a hard arcade challenge, making it accessible for casual play.

## Credits

Designed and built as Dreni's Game, with a modern arcade runner feel and a custom neon aesthetic.

## License

This project is for personal and educational use unless otherwise specified.
