# Simple Notes (Frontend-only)

A simple notes app built with React. Notes are stored in the browser using **localStorage** (no backend, no database).

## Features

- Create a note (title + content)
- Edit a note
- Delete a note
- Notes list (newest updated first)
- Persistence via `localStorage`

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in development mode.  
Open http://localhost:3000 to view it in your browser.

### `npm test`

Runs the test suite (non-backend).  

### `npm run build`

Builds the app for production to the `build` folder.

## Data storage

Notes are stored under a single localStorage key:

- `simple_notes_app__notes_v1`

To reset the app data, clear site data in your browser or remove that key in DevTools.

## Learn More

To learn React, check out the React documentation: https://reactjs.org/
