# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Cosette Tabucol, built with React and Vite. The site is deployed to GitHub Pages at [cosettekay.github.io/cosette](https://cosettekay.github.io/cosette/).

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev

# Build for production (outputs to dist/ with base path ./)
npm run build

# Preview production build locally
npm run preview

# Run linter
npm run lint
```

## Key Architecture Details

### Build Configuration

- **Vite** is used as the build tool with React plugin
- **Base path**: The production build uses `base: '/cosette/'` in `vite.config.js` for GitHub Pages deployment
- **Build output**: Uses `--base=./` flag in package.json build script for relative paths
- **Development** uses standard Vite defaults with HMR

### Project Structure

- `index.html` - Main HTML file containing all portfolio content (single-page layout)
- `src/main.js` - Entry point that imports styles
- `src/styles.css` - All styling for the portfolio
- `src/animated-flower.js` - Commented out code for canvas-based flower animation (currently unused)
- `public/` - Static assets including profile images
- `dist/` - Build output directory (ignored in git)

### Site Architecture

The portfolio is built as a **single-page application** with all content in `index.html`:

1. **Header** - Navigation bar with name and social links (GitHub, LinkedIn)
2. **Hero Section** (`#home`) - Split layout with greeting text on left and animated canvas on right
3. **About Section** (`#about`) - Personal bio, tech stack, and profile photo
4. **Experience Section** (`#experience`) - Job history with tabbed interface (currently Grassroots Analytics)
5. **Expertise Section** (`#expertise`) - Grid of skill cards (Web Dev, Mobile Dev, Automation/Testing, AI/ML)
6. **Projects Section** (`#projects`) - Filterable project grid with placeholder "coming soon" items

### Styling Approach

- Pure CSS (no preprocessor or CSS-in-JS)
- Custom properties likely used for theming (based on class names like `.accent`, `.wash`)
- Responsive design patterns evident from hero split layout
- All styles centralized in `src/styles.css`

### Linting

ESLint is configured with:
- React Hooks rules (`recommended-latest`)
- React Refresh plugin for Vite HMR
- Custom rule: allows unused variables with uppercase names (e.g., constants)
- Targets modern JavaScript (ES2020+)

## Deployment

The site is configured for GitHub Pages deployment:
- Built files go to `dist/`
- Base path is set to `/cosette/` for the GitHub Pages URL structure
- Likely uses a GitHub Actions workflow (check `.github/workflows/`) for automatic deployment on push to main
