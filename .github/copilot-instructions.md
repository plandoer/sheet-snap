# Copilot Instructions

## Project Overview

The project is a mobile application that will let users to add new rows to a Google Sheet.

## Summary

- This project is a React Native app built with Expo.

## File Structure

- Place screens/routes under `src/app/`, reusable components under `src/components/`, and shared utilities under `src/utils/`.
- Use PascalCase for component files (e.g. `ExpenseItem.tsx`) and camelCase for utility files (e.g. `dateUtils.ts`).

## Color Scheme

- Use colors from `global-styles.ts` for consistency across the app.
- If you need to add new colors, please add them to `global-styles.ts` and use them in the components.
- Never hardcode color values (e.g. hex codes, `rgb`/`rgba`) directly in components. If the color you need isn't already in `global-styles.ts`, add it there first, then reference it from the component.

## Important Notes

- If I provide wireframes, use them as a reference. No need to match styles and colors exactly, but the layout and structure should be similar.
- Improve spacing, typography, and visual hierarchy over the wireframes while preserving their layout and structure.

## Libraries

The project uses the following libraries:

- Expo
- Expo Router
- React Native
