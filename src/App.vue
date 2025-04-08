<template>
  <router-view></router-view>
</template>

<style>
/* 全局样式 */
:root {
  --primary-color: #1976d2;
  --primary-light: #64b5f6;
  --primary-dark: #1565c0;
  --success-color: #00c853;
  --error-color: #ff1744;
  --warning-color: #ff9100;
  --text-primary: #333;
  --text-secondary: #666;
  --text-light: #999;
  --border-color: #ddd;
  --background-light: #f5f5f5;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
  Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  color: var(--text-primary);
  background: var(--background-light);
  position: relative;
}

a {
  text-decoration: none;
  color: inherit;
}

button {
  cursor: pointer;
  font-family: inherit;
}

input, select, textarea {
  font-family: inherit;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style>
