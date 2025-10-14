// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { sqlroomsTailwindPreset } from '@sqlrooms/ui';

const preset = sqlroomsTailwindPreset();

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...preset,
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../../node_modules/@sqlrooms/*/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    ...preset.theme,
    extend: {
      ...preset.theme?.extend,
    },
  },
};
