# Canteen TV Dashboard

A React + Tailwind CSS dashboard application with fullscreen responsive layout and development debug features.

## Features

- **Fullscreen Responsive Dashboard**: Optimized for TV displays with responsive grid layout
- **Development Mode**: Normal web app behavior with scroll and mouse cursor in development
- **Debug Bar**: Bottom debug bar showing connection status and last fetch time (dev mode only)
- **Classic UI**: Clean white and black design following user preferences

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Development vs Production

- **Development Mode**: 
  - Normal web app with scroll and mouse cursor
  - Debug bar visible at bottom
  - Simulated connection status changes every 5 seconds

- **Production Mode**:
  - Fullscreen dashboard layout
  - No debug bar
  - Optimized for TV/kiosk display

## Project Structure

```
src/
├── components/
│   ├── Dashboard.js      # Main dashboard layout
│   └── DebugBar.js       # Development debug bar
├── App.js                # Main app component
├── App.css               # App-specific styles
├── index.js              # React entry point
└── index.css             # Global styles and Tailwind imports
```

## Technologies Used

- React 18
- Tailwind CSS 3
- Create React App
- Responsive Design
- CSS Grid & Flexbox

## Deployment

The app is ready for deployment to GitHub Pages or any static hosting service. Run `npm run build` to create a production build.

