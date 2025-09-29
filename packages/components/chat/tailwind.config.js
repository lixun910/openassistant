// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { heroui } from '@heroui/react';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../../node_modules/@sqlrooms/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [heroui()],
};
