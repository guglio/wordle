# Wordle Clone

A simple Wordle clone built with **React**, **TypeScript**, and **Vite**.

## Features

- Hidden input technique to keep keyboard focus without showing a caret.
- Real‑time letter validation with green/yellow/grey feedback.
- Random word selection from a built‑in word list.
- Responsive layout that works on desktop and mobile.
- Game status modal with title, close (×) button, and "Play Again" reset button.
- Share result feature: generate a shareable string with emoji grid and copy to clipboard (like the original Wordle).
- Easy to extend (custom word lists, animations, statistics, etc.).

## Getting Started

### Prerequisites

- Node.js (>=18) and npm (or yarn/pnpm).

### Installation

```bash
# Clone the repository (if you haven't already)
git clone https://github.com/guglio/wordle.git
cd wordle

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

The optimized output will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

### Testing

Run the test suite with Vitest:

```bash
# Run tests once
npm test

# Watch mode (useful during development)
npm run test:watch
```

## Project Structure

```
src/
 ├─ components/      # Reusable UI components (GuessRow, LetterTile, etc.)
 ├─ hooks/           # Custom React hooks (useWordleGame, useGameStatus)
 ├─ types/           # TypeScript type definitions
 ├─ App.tsx          # Root component
 ├─ main.tsx         # Entry point
 └─ styles/          # CSS / SCSS files
```

## How It Works

1. A single hidden `<input>` captures all keyboard events.
2. React state stores:
   - `guesses`: submitted rows (each row = array of letter objects).
   - `currentRow` / `currentCol`: position of the active tile.
   - `draft`: the string being typed for the current row.
   - `solution`: the secret word.
3. On each keystroke we update `draft` (or submit on **Enter**).
4. When submitted, we compute letter statuses (green/yellow/grey) using the classic two‑pass algorithm and push the result to `guesses`.
5. After submission we reset `draft`, move to the next row, and refocus the hidden input.
6. The UI simply maps over `guesses` (or the draft for the active row) and renders tiles with appropriate background colors.
7. When the game is won or lost, the `useGameStatus` hook opens a modal that displays a title (Congratulations! / Game Over), a close button (×), and a "Play Again" button to reset the game.
8. The hook also provides a `getShareString` function that generates a shareable emoji grid (like the original Wordle) which can be copied to clipboard via the Share button in the modal.


## Contributing

Feel free to open issues or submit pull requests. Please follow the existing code style and add tests for new logic.

## License

This project is open source and available under the [MIT License](LICENSE).