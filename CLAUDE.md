# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a browser extension that displays CODEOWNERS information on GitHub Pull Request pages. It's built using WXT (Web Extension Tools) framework with React and TypeScript.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Create zip package for Chrome Web Store
npm run zip

# Firefox-specific commands
npm run dev:firefox
npm run build:firefox
npm run zip:firefox

# Type checking
npm run compile
```

## Architecture

### Core Components

- **WXT Framework**: Used for browser extension development with TypeScript and React support
- **Content Script**: Main logic in `entrypoints/content.ts` that injects CODEOWNERS info into GitHub PR pages
- **Manifest Configuration**: Defined in `wxt.config.ts` with Chrome extension API

### Key Files

- `entrypoints/content.ts`: Main content script that runs on GitHub PR pages
- `wxt.config.ts`: WXT configuration with React module
- `package.json`: Scripts and dependencies
- `public/icon/`: Extension icons in multiple sizes

### Content Script Logic

The extension works by:
1. Matching GitHub PR URLs (`*://github.com/*/*/pull/*`)
2. Finding file headers in the Files changed tab
3. Extracting CODEOWNERS information from existing GitHub elements
4. Injecting visual indicators next to file diffs
5. Using MutationObserver to handle dynamically loaded content

### Build Output

- Chrome: `.output/chrome-mv3/`
- Firefox: `.output/firefox-mv2/`

## Development Notes

- The extension targets GitHub's specific DOM structure for PR file headers
- Uses TypeScript with JSX for React components
- Relies on WXT's built-in development server for hot reloading
- Extension automatically handles both initial page load and dynamically loaded diff content