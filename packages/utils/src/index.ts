// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

export * from './tool-cache';
export * from './openassistant-tool';
export * from './cache';
export * from './geojson';
export * from './format';
export * from './tool-output-manager';
export * from './conversation-cache';

export function generateId() {
  // generate a random id with 10 characters
  return Math.random().toString(36).substring(2, 15);
}
