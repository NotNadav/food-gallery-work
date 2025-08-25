# Meal Menu App

A React application that displays meals from TheMealDB API with category filtering and detailed meal information.

## Features

- Browse meals by category
- View meal details with ingredients and instructions
- Responsive design
- Interactive meal cards with hover effects

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## API Endpoints Used

- `https://www.themealdb.com/api/json/v1/1/list.php?c=list` - Get all categories
- `https://www.themealdb.com/api/json/v1/1/filter.php?c={category}` - Get meals by category
- `https://www.themealdb.com/api/json/v1/1/lookup.php?i={mealId}` - Get detailed meal information

## Technologies Used

- React 18
- Vite
- Axios
- CSS Grid & Flexbox
- TheMealDB API

## Build for Production

```bash
npm run build
```

